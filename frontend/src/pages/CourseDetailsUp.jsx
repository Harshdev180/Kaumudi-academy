import React, { useState, useRef, useEffect } from "react";
import { Download, FileText, Languages, Play } from "lucide-react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuthHook";
import HeroSection from "../component/CourseDetailsUpdated/HeroSection";
import SidebarCard from "../component/CourseDetailsUpdated/SidebarCard";
import InstructorSection from "../component/CourseDetailsUpdated/InstructorSection";
import CurriculumAccordion from "../component/CourseDetailsUpdated/CurriculumAccordion";
import ScheduleTable from "../component/CourseDetailsUpdated/ScheduleTable";
import Suggetion from "../component/CourseDetailsUpdated/suggetion";
import { getCourseDetail } from "../lib/api";
import SEO from "../components/SEO";

const CourseDetails = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef(null);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Default Data (Fallback data)
  const defaultCourse = {
    id: "panini-01",
    title: "Advanced Paninian Grammar: Mahabhashya Study",
    level: "Advanced Certification",
    description:
      "A comprehensive deep-dive into the foundational texts of Sanskrit linguistic philosophy under expert guidance.",
    price: "14,999",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv8HjlPpt0rOT7SHaevW0xmnEg9DCgkEfvrA&s",
    instructor: {
      name: "Acharya Dr. Vasudev Shastry",
      qualification: "PHD IN VYAKARANA, BANARAS HINDU UNIVERSITY",
      bio: "With over 25 years of teaching experience, Acharya Vasudev has guided thousands of students through the complexities of Sanskrit Grammar.",
      tags: ["25+ Yrs Exp", "100+ Publications", "Veda Ratna Awardee"],
    },
  };

  // 2. State for fetched course data
  const [courseData, setCourseData] = useState(null);

  // 3. Fetch course data from API if ID is available
  useEffect(() => {
    const fetchCourse = async () => {
      // Try to get course from location state first (navigation from CourseListing)
      const incomingData = location.state?.course;

      if (incomingData) {
        // Use data from navigation
        const merged = {
          ...defaultCourse,
          _id: incomingData.id || incomingData._id,
          id: incomingData.id || incomingData._id,
          title: incomingData.title,
          price: incomingData.price,
          level: incomingData.level,
          duration: incomingData.duration,
          language: incomingData.language,
          instructor: {
            name:
              incomingData.instructorName ||
              incomingData.instructor?.name ||
              defaultCourse.instructor.name,
            qualification:
              incomingData.instructorQualification ||
              incomingData.instructor?.qualification ||
              defaultCourse.instructor.qualification,
            bio:
              incomingData.instructorBio ||
              incomingData.instructor?.bio ||
              defaultCourse.instructor.bio,
            tags:
              incomingData.instructorTags ||
              incomingData.instructor?.tags ||
              defaultCourse.instructor.tags,
            image:
              incomingData.instructorImage ||
              incomingData.instructor?.image ||
              defaultCourse.instructor.image,
          },
          curriculum: incomingData.curriculum || defaultCourse.curriculum,
          schedule: incomingData.schedule || defaultCourse.schedule,
          image: incomingData.image,
          description:
            incomingData.description ||
            defaultCourse.description ||
            `Deep study into ${incomingData.category}. A ${incomingData.duration} immersive journey for ${incomingData.level} seekers.`,
        };
        setCourseData(merged);
      } else if (id) {
        // Try to fetch from API if ID is in URL
        try {
          setLoading(true);
          setError("");
          const response = await getCourseDetail(id);
          const apiCourse = response.data || response;

          const merged = {
            ...defaultCourse,
            _id: apiCourse._id || apiCourse.id,
            id: apiCourse._id || apiCourse.id,
            title: apiCourse.title || defaultCourse.title,
            price: apiCourse.price || defaultCourse.price,
            level: apiCourse.level || defaultCourse.level,
            duration: apiCourse.duration || "",
            language: Array.isArray(apiCourse.language)
              ? apiCourse.language.join(", ")
              : apiCourse.language || "",
            image:
              apiCourse.image?.url || apiCourse.image || defaultCourse.image,
            description: apiCourse.description || defaultCourse.description,
            category: apiCourse.category || "General",
            mode: apiCourse.mode || "ONLINE",
            startDate: apiCourse.startDate,
            endDate: apiCourse.endDate,
            instructor: {
              name: apiCourse.instructor || defaultCourse.instructor.name,
              qualification: defaultCourse.instructor.qualification,
              bio: defaultCourse.instructor.bio,
              tags: defaultCourse.instructor.tags,
              image: defaultCourse.instructor.image,
            },
            curriculum: defaultCourse.curriculum,
            schedule: defaultCourse.schedule,
          };
          setCourseData(merged);
        } catch (err) {
          console.error("Failed to fetch course:", err);
          setError("Failed to load course details. Using default data.");
          setCourseData(defaultCourse);
        } finally {
          setLoading(false);
        }
      } else {
        // No ID and no location state, use default
        setCourseData(defaultCourse);
      }
    };

    fetchCourse();
  }, [id, location.state]);

  // 4. Scroll to Top Logic
  useEffect(() => {
    if (courseData) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsPlaying(false);
    }
  }, [courseData?.title]);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="bg-[#f1e4c8] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#E2D4A6] border-t-[#74271E] animate-spin mx-auto mb-4"></div>
          <p className="text-[#4A4135] font-semibold">
            Loading course details...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !courseData) {
    return (
      <div className="bg-[#f1e4c8] min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 font-bold">!</span>
          </div>
          <h3 className="text-xl font-bold text-red-600 mb-2">
            Error Loading Course
          </h3>
          <p className="text-stone-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/courses")}
            className="px-6 py-2 bg-[#74271E] text-white rounded-lg font-bold hover:bg-[#5a1f15] transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  // Show course details if courseData is available
  if (!courseData) {
    return null;
  }

  return (
    <div className="bg-[#f1e4c8] min-h-screen font-sans-serif text-[#e6d0bd]">
      <SEO
        title={`${courseData.title} | Kaumudi Sanskrit Academy`}
        description={
          courseData.description?.slice(0, 160) ||
          "Explore this Sanskrit course with our expert Acharyas."
        }
        canonicalPath={`/coursedetail/${id || courseData.id || courseData._id || ""}`}
        og={{ type: "article", image: courseData.image }}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Course",
            name: courseData.title,
            description:
              courseData.description ||
              "Sanskrit course by Kaumudi Sanskrit Academy",
            provider: {
              "@type": "Organization",
              name: "Kaumudi Sanskrit Academy",
            },
            educationalLevel: courseData.level || "All Levels",
            inLanguage: courseData.language || "sa",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item:
                  (typeof window !== "undefined"
                    ? window.location.origin
                    : "") + "/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Courses",
                item:
                  (typeof window !== "undefined"
                    ? window.location.origin
                    : "") + "/allcourses",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: courseData.title,
                item:
                  (typeof window !== "undefined"
                    ? window.location.origin
                    : "") +
                  `/coursedetail/${id || courseData.id || courseData._id || ""}`,
              },
            ],
          },
        ]}
      />
      <div className="max-w-7xl mx-auto p-10 md:p-10">
        <HeroSection data={courseData} />
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-4 -mt-14">
              <div className="w-1.5 h-8 bg-[#d6b15c]"></div>
              <h2 className="text-[28px] font-bold text-[#74271E]">
                Course Demo
              </h2>
            </div>
            <div className="relative group aspect-video bg-black rounded-4xl overflow-hidden shadow-2xl border-[6px] border-white cursor-pointer">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                poster={courseData.image}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                controls={isPlaying}
              >
                <source
                  src="https://www.w3schools.com/html/mov_bbb.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>

              {!isPlaying && (
                <div
                  onClick={handlePlayVideo}
                  className="absolute inset-0 z-10 flex flex-col justify-between p-6 bg-black/30 hover:bg-black/40 transition-all duration-300"
                >
                  <div className="flex justify-center items-center h-full">
                    <div className="w-20 h-20 bg-[#74271E] rounded-full flex items-center justify-center border-2 border-white/20 shadow-2xl transform transition-transform group-hover:scale-110">
                      <div className="ml-1 w-0 h-0 border-t-[14px] border-t-transparent border-l-[24px] border-l-white border-b-[14px] border-b-transparent"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between bg-[#F9F5F0] p-5 sm:p-6 rounded-2xl border border-[#E8DFD3] shadow-sm gap-5 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
              {/* Icon Container: Iska size mobile par thoda balance kiya gaya hai */}
              <div className="bg-[#74271E] p-3 rounded-xl text-white shadow-lg shrink-0">
                <FileText size={32} md:size={36} strokeWidth={1.5} />
              </div>

              {/* Text Container: Font sizes ko responsive banaya gaya hai  changr kiya hu px ko % me pahle 15 px tha text*/}
              <div className="space-y-1">
                <h3 className="font-bold text-lg sm:text-xl md:text-[100%] text-[#3D1A16] leading-tight">
                  {courseData.title} Syllabus
                </h3>
                <p className="text-[#7A5C58] text-sm sm:text-base md:text-[95%] italic font-medium">
                  Curriculum for {courseData.level} level course.
                </p>
              </div>
            </div>

            <div className="w-full sm:w-max">
              <button className="group relative flex w-full sm:w-max items-center justify-center gap-2.5 sm:gap-3 overflow-hidden rounded-xl bg-[#74271E] px-6 sm:px-8 py-3 sm:py-3.5 font-bold text-white shadow-[0_10px_20px_rgba(116,39,30,0.3)] transition-all duration-300 hover:bg-[#d6b15c] hover:text-[#74271E] hover:shadow-[0_15px_30px_rgba(214,177,92,0.4)] active:scale-95">
                {/* Shine effect - Unchanged */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-full" />

                {/* Icon - Sizes optimized for mobile */}
                <Download
                  size={20}
                  className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110 shrink-0"
                />

                {/* Text - Responsive font size */}
                <span className="relative whitespace-nowrap items-center justify-center text-[14px] sm:text-[16px] tracking-wide">
                  Download Brochure
                </span>

                {/* Bottom border effect - Unchanged */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#74271E] transition-all duration-300 group-hover:w-full" />
              </button>
            </div>
          </div>

          <InstructorSection instructor={courseData.instructor} />
          <CurriculumAccordion curriculumData={courseData.curriculum} />
          <ScheduleTable scheduleData={courseData.schedule} />
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-25">
            <SidebarCard price={courseData.price} courseData={courseData} />
          </div>
        </div>
        <div className="max-w-7xl mx-auto">
          <Suggetion />
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
