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
      
      <div className="max-w-7xl  mx-auto p-4 md:p-10 ">
        <HeroSection />
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Video Preview Section */}
          <section >
             <div className="flex items-center gap-3 mb-4 -mt-14">
        <div className="w-1.5 h-8 bg-[#d6b15c]"></div>
        <h2 className="text-[28px] font-bold text-[#631D11]">Course Preview</h2>
      </div>
            
            <div className="relative group aspect-video bg-black rounded-4xl overflow-hidden shadow-2xl border-[6px] border-white cursor-pointer">
              {/* Actual HTML5 Video Tag */}
            <video 
  ref={videoRef}
  className="w-full h-full object-cover"
  poster="src/assets/image1.jpeg" // Aapka poster image
  onPause={() => setIsPlaying(false)}
  onPlay={() => setIsPlaying(true)}
  controls={isPlaying} 
>
  {/* Sanskrit Shloka Chanting Sample Video */}
  <source 
    src="https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c8/Gayatri_Mantra_chunted_by_a_Pandit.ogv/Gayatri_Mantra_chunted_by_a_Pandit.ogv.480p.vp9.webm" 
    type="video/webm" 
  />
  <source 
    src="https://www.w3schools.com/html/mov_bbb.mp4" 
    type="video/mp4" 
  />
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
                  
                </div>
              )}
            </div>
          </section>

          {/* Syllabus Download Box */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-[#F9F5F0] p-5 rounded-2xl border border-[#E8DFD3] shadow-sm gap-6">
            <div className="flex items-center gap-5">
              <div className="bg-[#631D11] p-3 rounded-xl text-white shadow-lg">
                <FileText size={36} strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-2xl md:text-[20px] text-[#3D1A16]">Full Course Syllabus</h3>
                <p className="text-[#7A5C58] md:text-[18px] text-xl  italic font-small">
                  Detailed curriculum, reading lists<br/>
                </p>
              </div>
            </div>
            
            <button className="w-full sm:w-auto  bg-[#631D11] hover:bg-[#d6b15c] hover:text-[#631D11] text-white px-3 py-3 rounded-xl font-bold flex items-center justify-center gap-1 transition-all shadow-xl active:scale-95">
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
          <div className="lg:sticky lg:top-25">
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