import React, { useState, useRef } from 'react';
import { Download, FileText, Play } from 'lucide-react';
// Baaki imports wahi rahenge
import HeroSection from '../component/CourseDetailsUpdated/HeroSection';
import SidebarCard from '../component/CourseDetailsUpdated/SidebarCard';
import InstructorSection from '../component/CourseDetailsUpdated/InstructorSection';
import CurriculumAccordion from '../component/CourseDetailsUpdated/CurriculumAccordion';
import ScheduleTable from '../component/CourseDetailsUpdated/ScheduleTable';
import Suggetion from '../component/CourseDetailsUpdated/suggetion';

const CourseDetails = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="bg-[#f1e4c8]  min-h-screen font-sans-serif  text-[#e6d0bd]">
      <div className="max-w-5xl mx-auto p-4 md:p-10 pb-0">
        <HeroSection />
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Video Preview Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
           <div className="w-1.5 h-8 bg-[#B18E40]"></div>
              <h2 className="text-[28px] font-bold text-[#631D11]">Course Preview</h2>
            </div>
            
            <div className="relative group aspect-video bg-black rounded-4xl overflow-hidden shadow-2xl border-[6px] border-white cursor-pointer">
              {/* Actual HTML5 Video Tag */}
              <video 
                ref={videoRef}
                className="w-full h-full object-cover"
                poster="src/assets/image1.jpeg" // Image as poster
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                controls={isPlaying} // Controls tabhi dikhenge jab video chal raha ho
              >
                <source src="https://youtu.be/Gi2SAIBdY6s?si=m_KnP3FJAkxDy59F" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Custom Overlay (Only visible when NOT playing) */}
              {!isPlaying && (
                <div 
                  onClick={handlePlayVideo}
                  className="absolute inset-0 z-10 flex flex-col justify-between p-6 bg-black/30 hover:bg-black/40 transition-all duration-300"
                >
                  {/* Play Button matching your image */}
                  <div className="flex justify-center items-center h-full">
                     <div className="w-20 h-20 bg-[#631D11] rounded-full flex items-center justify-center border-2 border-white/20 shadow-2xl transform transition-transform group-hover:scale-110">
                        <div className="ml-1 w-0 h-0 border-t-[14px] border-t-transparent border-l-[24px] border-l-white border-b-[14px] border-b-transparent"></div>
                     </div>
                  </div>
                  
                  {/* Progress Bar (Static Look like Image) */}
                  {/* <div className="w-full space-y-2 mb-2">
                     <div className="flex justify-between text-white text-[12px] font-bold px-1 drop-shadow-md">
                        <span>00:15</span>
                        <span>15:40</span>
                     </div>
                     <div className="relative h-1.5 w-full bg-white/30 rounded-full overflow-hidden">
                        <div className="absolute top-0 left-0 h-full w-[35%] bg-[#C4A04D] rounded-full flex items-center justify-end">
                           <div className="w-3 h-3 bg-white rounded-full shadow-lg"></div>
                        </div>
                     </div>
                  </div> */}
                </div>
              )}
            </div>
          </section>

          {/* Syllabus Download Box */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-[#F9F5F0] p-8 rounded-2xl border border-[#E8DFD3] shadow-sm gap-6">
            <div className="flex items-center gap-5">
              <div className="bg-[#631D11] p-5 rounded-xl text-white shadow-lg">
                <FileText size={36} strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-2xl md:text-[20px] text-[#3D1A16]">Full Course Syllabus</h3>
                <p className="text-[#7A5C58] md:text-[18px] text-xl  italic font-small">
                  Detailed curriculum, reading lists<br/>
                </p>
              </div>
            </div>
            
            <button className="w-full sm:w-auto  bg-[#631D11] hover:bg-[#B18E40] hover:text-[#631D11] text-white px-5 py-1 rounded-2xl font-bold flex items-center justify-center gap-1 transition-all shadow-xl active:scale-95">
               <Download size={22} />
               Download Brochure
            </button>
          </div>

          <InstructorSection />
          <CurriculumAccordion />
          <ScheduleTable />
          
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-10">
            <SidebarCard />
          </div>
        </div>
        <div className="max-w-7xl mx-auto ">
        <Suggetion />
      </div>
      </div>
    </div>
  );
};

export default CourseDetails;