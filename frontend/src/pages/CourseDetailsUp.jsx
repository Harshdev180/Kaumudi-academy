import React, { useState, useRef, useEffect } from "react";
import { Download, FileText, Languages, Play, BookOpen } from "lucide-react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/useAuthHook";
import HeroSection from "../component/CourseDetailsUpdated/HeroSection";
import SidebarCard from "../component/CourseDetailsUpdated/SidebarCard";
import InstructorSection from "../component/CourseDetailsUpdated/InstructorSection";
import CurriculumAccordion from "../component/CourseDetailsUpdated/CurriculumAccordion";
import ScheduleTable from "../component/CourseDetailsUpdated/ScheduleTable";
import Suggetion from "../component/CourseDetailsUpdated/suggetion";
import { getCourseDetail } from "../lib/api";
import { getAllCourses } from "../lib/api";
import SEO from "../components/SEO";
import logo from "../assets/logo-bgremove.webp";
import { updateCourseProgress, getCourseProgress } from "../lib/api";

const CourseDetails = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef(null);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const defaultCourse = {
    id: "default",
    title: "Sanskrit Course",
    level: "Beginner",
    description: "Course details coming soon.",
    price: 0,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv8HjlPpt0rOT7SHaevW0xmnEg9DCgkEfvrA&s",
    instructor: {
      name: "Instructor TBA",
      qualification: "To be announced",
      bio: "An expert instructor will be assigned to this course soon.",
      tags: [],
      image: null,
    },
    curriculum: [
      {
        title: "Introduction to Paspashahnika",
        isLocked: false,
        content: [
          "Purpose of Grammar (Vyakarana-prayojanam)",
          "Concept of Shabda and Artha",
          "Linguistic Analysis methodology in Mahabhashya",
        ],
      },
      {
        title: "Shivasutra and Pratyahara Analysis",
        isLocked: false,
        content: [
          "Significance of Maheshwara Sutras",
          "Formation of Pratyaharas",
          "Phonetic classifications",
        ],
      },
      {
        title: "Sutra Interpretation Principles",
        isLocked: true,
        content: [
          "Sutra structure analysis",
          "Paribhasha implementation",
          "Vartika perspectives",
        ],
      },
    ],
  };

  // 2. State for fetched course data
  const [courseData, setCourseData] = useState(null);
  const [recommendedCourses, setRecommendedCourses] = useState([]);

  useEffect(() => {
    const fetchRecommended = async () => {
      if (!courseData?._id && !courseData?.id) return;

      try {
        const response = await getAllCourses();

        const list = response?.courses || response?.data || response || [];

        // Remove current course
        const filtered = list.filter(
          (c) => (c._id || c.id) !== (courseData._id || courseData.id),
        );

        // Optional: same category match
        const sameCategory = filtered.filter(
          (c) => c.category === courseData.category,
        );

        const finalCourses = sameCategory.length > 0 ? sameCategory : filtered;

        setRecommendedCourses(finalCourses.slice(0, 6));
      } catch (err) {
        console.error("Failed to fetch recommended courses", err);
      }
    };

    fetchRecommended();
  }, [courseData]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const percent = (video.currentTime / video.duration) * 100;
    setProgress(Math.floor(percent));
  };

  useEffect(() => {
    if (!id || progress === 0) return;

    const timer = setTimeout(async () => {
      try {
        await updateCourseProgress({
          courseId: id,
          progress: progress,
        });
      } catch (err) {
        console.log("Progress update failed");
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [progress, id]);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const res = await getCourseProgress(id);

        if (res?.data?.progress) {
          setProgress(res.data.progress);
        }
      } catch (err) {
        console.log("Failed to load progress");
      }
    };

    if (id) loadProgress();
  }, [id]);

  // 3. Fetch course data from API if ID is available
  useEffect(() => {
    const fetchCourse = async () => {
      // ALWAYS fetch from API when there's an ID in the URL to get fresh data including instructor
      if (id) {
        // Try to fetch from API if ID is in URL
        try {
          setLoading(true);
          setError("");
          // console.log("Fetching course detail for ID:", id);
          const response = await getCourseDetail(id);
          // console.log("Full API Response:", response);
          // Handle both direct response and wrapped response { success, data }
          const apiCourse = response?.data?.data || response?.data || response;
          // console.log("Course API Response:", apiCourse);
          // console.log("Instructor from API:", apiCourse?.instructor);

          // Check if instructor exists and is populated
          const instructorData = apiCourse?.instructor;
          // console.log("Instructor data check:", {
          //   exists: !!instructorData,
          //   isObject: typeof instructorData === "object",
          //   name: instructorData?.name,
          //   role: instructorData?.role,
          //   description: instructorData?.description,
          //   hasValidName: !!(
          //     instructorData?.name && instructorData.name !== "Instructor TBA"
          //   ),
          // });

          // More lenient check - just need a name that exists
          const hasValidInstructor =
            instructorData &&
            typeof instructorData === "object" &&
            instructorData.name &&
            instructorData.name !== "Instructor TBA" &&
            instructorData.name !== "Instructor TBA";

          // console.log("hasValidInstructor:", hasValidInstructor);

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
            instructor: hasValidInstructor
              ? {
                  name: instructorData.name || "Instructor",
                  qualification: instructorData.role || "Faculty",
                  bio:
                    (instructorData.description &&
                      instructorData.description.trim()) ||
                    instructorData.bio ||
                    "No biography available",
                  tags: [],
                  image: instructorData.image || null,
                }
              : defaultCourse.instructor,
            curriculum: apiCourse.curriculum || defaultCourse.curriculum,
            // syllabus: apiCourse.syllabus || "",
            schedule: apiCourse.batchSchedule || defaultCourse.schedule,
            batchSchedule: apiCourse.batchSchedule || [],
          };
          setCourseData(merged);
        } catch (err) {
          console.error("Failed to fetch course:", err);
          setError("Failed to load course details. Using default data.");
          setCourseData(defaultCourse);
        } finally {
          setLoading(false);
        }
      } else if (location.state?.course) {
        // Use data from navigation (course listing)
        const incomingData = location.state.course;
        let priceValue = incomingData.price;
        if (typeof priceValue === "string") {
          priceValue = parseInt(priceValue.replace(/[^0-9]/g, "")) || 0;
        }

        // If price is missing or zero (e.g., from homepage cards), try to fetch actual course data
        if (!priceValue || priceValue === 0) {
          try {
            const listResp = await getAllCourses();
            const list = listResp?.courses || listResp?.data || listResp || [];
            const incomingTitle = String(incomingData.title || "")
              .trim()
              .toLowerCase();
            const match =
              list.find(
                (c) =>
                  String(c.title || c.name || "")
                    .trim()
                    .toLowerCase() === incomingTitle,
              ) ||
              list.find(
                (c) =>
                  (c._id || c.id) === (incomingData._id || incomingData.id),
              );
            if (match) {
              let pv = match.price || 0;
              if (typeof pv === "string") {
                pv = parseInt(pv.replace(/[^0-9]/g, "")) || 0;
              }
              priceValue = typeof pv === "number" ? pv : 0;

              // Also get instructor data from the matched course
              if (match.instructor) {
                incomingData.instructor = {
                  name: match.instructor.name,
                  qualification: match.instructor.role,
                  image: match.instructor.image,
                  bio: match.instructor.description || "",
                };
              }
            }
          } catch (e) {
            console.warn("Fallback pricing fetch failed", e);
          }
        }

        // Final fallback to defaultCourse price if still missing
        if (!priceValue || priceValue === 0) {
          priceValue =
            typeof defaultCourse.price === "string"
              ? parseInt(defaultCourse.price.replace(/[^0-9]/g, "")) || 0
              : defaultCourse.price || 0;
        }

        const merged = {
          ...defaultCourse,
          _id: incomingData.id || incomingData._id,
          id: incomingData.id || incomingData._id,
          title: incomingData.title,
          price: priceValue,
          level: incomingData.level,
          duration: incomingData.duration,
          language: incomingData.language,
          instructor: incomingData.instructor
            ? {
                name: incomingData.instructor.name || "Instructor TBA",
                qualification:
                  incomingData.instructor.qualification ||
                  "Qualification not listed",
                bio:
                  incomingData.instructor.bio || "Instructor bio coming soon.",
                tags: incomingData.instructor.tags || [],
                image: incomingData.instructor.image || null,
              }
            : {
                name: "Instructor TBA",
                qualification: "To be announced",
                bio: "An expert instructor will be assigned to this course soon.",
                tags: [],
                image: null,
              },
          curriculum: incomingData.curriculum || defaultCourse.curriculum,
          syllabus: incomingData.syllabus || "",
          schedule: incomingData.schedule || defaultCourse.schedule,
          image: incomingData.image,
          description:
            incomingData.description ||
            defaultCourse.description ||
            `Deep study into ${incomingData.category}. A ${incomingData.duration} immersive journey for ${incomingData.level} seekers.`,
        };
        setCourseData(merged);
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

  const posterUrl =
    (courseData && typeof courseData.image === "string" && courseData.image) ||
    courseData?.image?.url ||
    courseData?.images?.[0]?.url ||
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv8HjlPpt0rOT7SHaevW0xmnEg9DCgkEfvrA&s";

  const formatINR = (n) =>
    `₹ ${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const handleDownloadBrochure = () => {
    const fallbackModules = defaultCourse.curriculum || [];
    let syllabus = [];
    const cur = courseData?.curriculum;
    if (Array.isArray(cur) && cur.length) {
      syllabus = cur;
    } else if (cur && typeof cur === "object") {
      syllabus = Object.entries(cur).map(([title, items]) => ({
        title,
        isLocked: false,
        content: Array.isArray(items) ? items : [],
      }));
    } else if (
      Array.isArray(courseData?.syllabus) &&
      courseData.syllabus.length
    ) {
      syllabus = courseData.syllabus.map((s) =>
        typeof s === "string" ? { title: s, isLocked: false, content: [] } : s,
      );
    } else {
      syllabus = fallbackModules;
    }
    const html = `
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${courseData.title} - Brochure</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap" rel="stylesheet">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" integrity="sha512-YcsIPbiG8C4wY2s7t3k+HUXoQli0T3t8t3yQvA8vKJ9xI1Fv4TtHjW6cM7cVfYzWwQhD/2dQjAqV3DkO4bczrA==" crossorigin="anonymous"></script>
        <style>
          @page { size: A4; margin: 20mm; }
          body { font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#2D2417; background:#faf7f2; }
          .wrap { position:relative; max-width: 860px; margin: 0 auto; background:#fff; border:1px solid #e8dfd0; border-radius:20px; overflow:hidden; box-shadow:0 14px 45px rgba(0,0,0,0.08); }
          .watermark { position:absolute; inset:0; background:url('${logo}') center 40% / 50% no-repeat; opacity:0.06; filter: saturate(110%) contrast(115%); pointer-events:none; }
          .header { position:relative; display:flex; align-items:center; justify-content:space-between; padding:20px 26px; background:linear-gradient(90deg, #3b120e 0%, #5a1e17 55%, #2a0b08 100%); border-bottom:5px solid #d6b15c; }
          .brand { display:flex; align-items:center; gap:12px; }
          .brand img { width:60px; height:60px; object-fit:contain; border-radius:14px; background:#74271E; padding:6px; box-shadow:0 0 22px rgba(214,177,92,0.45); }
          .brand .org { font-weight:900; letter-spacing:0.10em; font-size:15px; color:#d6b15c; text-transform:uppercase; }
          .tag { font-size:11px; color:#e9d8b5; letter-spacing:0.16em; text-transform:uppercase; }
          .badge { display:inline-block; padding:7px 12px; border-radius:999px; font-size:11px; font-weight:800; border:1px solid #d6b15c; color:#d6b15c; background:rgba(255,255,255,0.08);}
          .title { padding:20px 26px 10px; }
          .title h1 { margin:0; font-size:28px; color:#74271E; letter-spacing:0.02em; }
          .meta { display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:12px 18px; padding:2px 26px 14px; }
          .meta .lab { font-size:11px; color:#8c7a56; font-weight:800; letter-spacing:0.10em; text-transform:uppercase; }
          .meta .val { font-size:14px; font-weight:800; color:#2D2417;}
          .hero { padding: 10px 26px 0; }
          .hero .poster { width:100%; height:230px; object-fit:cover; border-radius:16px; border:1px solid #efe4cf; box-shadow: 0 10px 28px rgba(0,0,0,0.08); }
          .section { padding:16px 26px 6px; }
          .section h2 { font-size:16px; color:#631D11; margin:0 0 8px; letter-spacing:0.14em; text-transform:uppercase; }
          .desc { padding:0 26px 16px; font-size:14px; color:#4a3f2e; line-height:1.6; }
          .syllabus { padding:0 26px 24px; display:grid; grid-template-columns:1fr; gap:12px; }
          .module { border:1px solid #efe4cf; border-radius:16px; overflow:hidden; background:#fff; box-shadow:0 8px 26px rgba(0,0,0,0.05); page-break-inside: avoid; }
          .module-h { display:flex; justify-content:space-between; align-items:center; background:linear-gradient(90deg,#fff,#f9f5ef); padding:12px 16px; border-bottom:1px solid #efe4cf; }
          .module-title { font-weight:900; color:#631D11; font-size:15px; letter-spacing:0.02em; }
          .module-body { padding:12px 20px; }
          .module-body ul { margin:0; padding-left:18px; }
          .module-body li { margin:6px 0; font-size:13px; color:#2D2417; }
          .footer { padding:12px 26px 20px; font-size:11px; color:#6b4b3e; border-top:1px dashed #efe4cf; display:flex; align-items:center; justify-content:space-between; }
          .actions { display:flex; gap:10px; padding: 0 26px 20px; }
          .btn { padding:10px 14px; background:#74271E; color:#fff; border:none; border-radius:10px; font-weight:800; font-size:12px; letter-spacing:0.08em; cursor:pointer; }
          .btn-outline { background:#fff; color:#74271E; border:1px solid #74271E; }
          @media print { .actions { display:none } .wrap { border:none } }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="watermark"></div>
          <div class="header">
            <div class="brand">
              <img src="${logo}" alt="Kaumudi Sanskrit Academy" />
              <div>
                <div class="org">Kaumudi Sanskrit Academy</div>
                <div class="tag">प्राचीन ज्ञान • आधुनिक पद्धति</div>
              </div>
            </div>
            <div class="badge">${courseData.category || "Course"}</div>
          </div>
          <div class="title">
            <h1>${courseData.title}</h1>
          </div>
          <div class="meta">
            <div><div class="lab">Level</div><div class="val">${
              courseData.level || "All Levels"
            }</div></div>
            <div><div class="lab">Duration</div><div class="val">${
              courseData.duration || "-"
            }</div></div>
            <div><div class="lab">Language</div><div class="val">${
              courseData.language || "-"
            }</div></div>
            <div><div class="lab">Mode</div><div class="val">${
              courseData.mode || "ONLINE"
            }</div></div>
            <div><div class="lab">Instructor</div><div class="val">${
              courseData.instructor?.name || "Instructor TBA"
            }</div></div>
            <div><div class="lab">Fee</div><div class="val">${formatINR(
              courseData.price,
            )}</div></div>
          </div>
          <div class="section"><h2>About The Course</h2></div>
          <div class="desc">${(courseData.description || "")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")}</div>
          <div class="section"><h2>Syllabus</h2></div>
          <div class="syllabus">
            ${
              syllabus.length
                ? syllabus
                    .map((m, idx) => {
                      const items = Array.isArray(m?.content) ? m.content : [];
                      const list =
                        items.length > 0
                          ? `<ul>${items
                              .map(
                                (li) =>
                                  `<li>${String(li)
                                    .replace(/</g, "&lt;")
                                    .replace(/>/g, "&gt;")}</li>`,
                              )
                              .join("")}</ul>`
                          : "";
                      return `<div class="module">
                        <div class="module-h">
                          <div class="module-title">${idx + 1}. ${
                            m?.title || "Module"
                          }</div>
                          <div style="font-size:11px;color:#8c7a56;">${
                            m?.isLocked ? "Preview" : "Open"
                          }</div>
                        </div>
                        <div class="module-body">${list}</div>
                      </div>`;
                    })
                    .join("")
                : '<div style="font-size:13px;color:#6b4b3e;">Syllabus will be updated soon.</div>'
            }
          </div>
          <div class="footer">
            <div>© Kaumudi Sanskrit Academy</div>
            <div class="badge">www.kaumudi.academy</div>
          </div>
          <div class="actions">
            <button class="btn" onclick="window.print()">Print</button>
            <button class="btn btn-outline" onclick="window.close()">Close</button>
          </div>
        </div>
        <script>
          (function() {
            function download() {
              var el = document.querySelector('.wrap');
              if (!el || !window.html2pdf) return;
              var opt = {
                margin:       [10, 10, 10, 10],
                filename:     '${courseData.title.replace(/[^a-z0-9]/gi, "_")}_Brochure.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak:    { mode: ['css', 'legacy'] }
              };
              html2pdf().set(opt).from(el).save().then(function(){
                setTimeout(function(){ window.close(); }, 600);
              });
            }
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
              setTimeout(download, 300);
            } else {
              document.addEventListener('DOMContentLoaded', function(){ setTimeout(download, 300); });
            }
          })();
        </script>
      </body>
      </html>
    `;
    const w = window.open("", "PRINT", "height=800,width=900");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
  };

  return (
    <div className="bg-[#FBF4E2] min-h-screen font-sans-serif text-[#2D2417]">
      <SEO
        title={`${courseData.title} | Kaumudi Sanskrit Academy`}
        description={
          courseData.description?.slice(0, 160) ||
          "Explore this Sanskrit course with our expert Acharyas."
        }
        canonicalPath={`/coursedetail/${id || courseData.id || courseData._id || ""}`}
        og={{
          image: posterUrl,
        }}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-10">
        <HeroSection data={courseData} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-4 -mt-6 md:-mt-10 lg:-mt-14">
              <div className="w-1.5 h-8 bg-[#d6b15c]"></div>
              <h2 className="text-2xl md:text-[28px] font-bold text-[#74271E]">
                Course Demo
              </h2>
            </div>
            <div className="relative group aspect-video bg-black rounded-4xl overflow-hidden shadow-2xl border-[6px] border-white cursor-pointer">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                poster={posterUrl}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onTimeUpdate={handleTimeUpdate}
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
                  className="absolute inset-0 z-10 flex flex-col justify-between p-4 sm:p-6 bg-black/30 hover:bg-black/40 transition-all duration-300"
                >
                  <div className="flex justify-center items-center h-full">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#74271E] rounded-full flex items-center justify-center border-2 border-white/20 shadow-2xl transform transition-transform group-hover:scale-110">
                      <div className="ml-1 w-0 h-0 border-t-[12px] sm:border-t-[14px] border-t-transparent border-l-[20px] sm:border-l-[24px] border-l-white border-b-[12px] sm:border-b-[14px] border-b-transparent"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#74271E] h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </section>

          <div className="flex flex-col sm:flex-row items-start justify-between bg-[#F9F5F0] p-5 sm:p-6 rounded-2xl border border-[#E8DFD3] shadow-sm gap-6">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 text-center sm:text-left w-full">
              {/* Icon Container: Iska size mobile par thoda balance kiya gaya hai */}
              <div className="bg-[#74271E] p-3 rounded-xl text-white shadow-lg shrink-0">
                <FileText
                  size={32}
                  strokeWidth={1.5}
                  className="md:w-9 md:h-9"
                />
              </div>

              {/* Text Container: Font sizes ko responsive banaya gaya hai  changr kiya hu px ko % me pahle 15 px tha text*/}
              <div className="space-y-1 w-full">
                <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-[#3D1A16] leading-tight">
                  {courseData.title} Syllabus
                </h3>
                <p className="text-[#7A5C58] text-sm sm:text-base md:text-lg italic font-medium">
                  Curriculum for {courseData.level} level course.
                </p>
                {/* Syllabus Content */}
                {courseData.syllabus && (
                  <div className="mt-4 p-5 bg-gradient-to-br from-white to-[#FEF8ED] rounded-xl border-2 border-[#E8DFD3] shadow-md max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-[#d6b15c] scrollbar-track-[#F5E6C8]">
                    <div className="flex items-center gap-2 mb-3 sticky top-0 bg-gradient-to-br from-white to-[#FEF8ED] pb-2 border-b border-[#E8DFD3]">
                      <BookOpen size={18} className="text-[#d6b15c]" />
                      <span className="text-[#74271E] font-bold text-sm uppercase tracking-wide">
                        Course Syllabus
                      </span>
                    </div>
                    <div className="text-[#3D1A16] text-sm md:text-base leading-7 whitespace-pre-line font-medium pt-2">
                      {courseData.syllabus}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full sm:w-max">
              <button
                onClick={handleDownloadBrochure}
                className="group relative flex w-full sm:w-max items-center justify-center gap-2.5 sm:gap-3 overflow-hidden rounded-xl bg-[#74271E] px-6 sm:px-8 py-3 sm:py-3.5 font-bold text-white shadow-[0_10px_20px_rgba(116,39,30,0.3)] transition-all duration-300 hover:bg-[#d6b15c] hover:text-[#74271E] hover:shadow-[0_15px_30px_rgba(214,177,92,0.4)] active:scale-95"
              >
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
          {/* {console.log(" Passing to InstructorSection:", courseData.instructor)} */}
          <CurriculumAccordion curriculumData={courseData.curriculum} />
          {/* {console.log("batchSchedule data:", courseData.batchSchedule)} */}
          <ScheduleTable
            scheduleData={courseData.batchSchedule || courseData.schedule || []}
          />
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <SidebarCard price={courseData.price} courseData={courseData} />
          </div>
        </div>
      </div>{" "}
      {/* 👈 CLOSE GRID HERE */}
      {/* Recommended Courses OUTSIDE grid */}
      {recommendedCourses.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
          <Suggetion courses={recommendedCourses} />
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
