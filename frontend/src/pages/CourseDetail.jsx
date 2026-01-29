import CourseHero from "../component/coursedetail/CourseHero";
import CourseSidebar from "../component/coursedetail/CourseSidebar";
import Overview from "../component/coursedetail/Overview";
import Curriculum from "../component/coursedetail/Curriculum";
import MeetYourAcharya from "../component/coursedetail/meet";
import CourseCarousel from '../component/coursedetail/coursesugestion';

export default function CourseDetail() {
  return (
    <div className="bg-[#f1e4c8] text-[#2b2b2b]">

      {/* Content + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <CourseHero />
          <Overview />
          <Curriculum />
        </div>

        <CourseSidebar />
      </div>

      
      <MeetYourAcharya />
      <CourseCarousel />

    </div>
  );
}
