import React, { useState } from "react";
import { 
  Clock, 
  BarChart, 
  Globe, 
  Award, 
  PlayCircle, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  CheckCircle2,
  Calendar,
  FileText,
  Users,
  ArrowRight
} from "lucide-react";
import { useParams, Link } from "react-router-dom";

// This would ideally live in a separate data.js file
const courses = [
  {
    id: 1,
    title: "Foundations of Sanskrit Vyakaran (Level 1)",
    category: "Vyakarana (Grammar)",
    instructor: "Acharya Sharma",
    duration: "12 Weeks",
    level: "Beginner",
    mode: "ONLINE",
    price: "4,999",
    oldPrice: "8,999",
    image: "https://images.unsplash.com/photo-1544640808-32ca72ac7f37?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 2,
    title: "Mandukya Upanishad Deep Dive",
    category: "Veda & Upanishad",
    instructor: "Swami Jnananda",
    duration: "8 Weeks",
    level: "Intermediate",
    mode: "LIVE",
    price: "6,499",
    oldPrice: "10,000",
    image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 3,
    title: "Kalidasa's Meghaduta: Aesthetics",
    category: "Sahitya (Literature)",
    instructor: "Dr. Meenakshi",
    duration: "6 Weeks",
    level: "Advanced",
    mode: "ONLINE",
    price: "3,200",
    oldPrice: "5,500",
    image: "https://images.unsplash.com/photo-1516410529446-2c777cb7366d?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 4,
    title: "Sanskrit 101: Foundation",
    category: "Language",
    instructor: "Acharya Raghav",
    duration: "16 Weeks",
    level: "Beginner",
    mode: "RECORDED",
    price: "2,999",
    oldPrice: "4,500",
    image: "https://images.unsplash.com/photo-1502136969935-8d8eef54d77b?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 5,
    title: "Patanjali's Yoga Sutras",
    category: "Yoga & Ayurveda",
    instructor: "Vidushi Aruna",
    duration: "10 Weeks",
    level: "Intermediate",
    mode: "ONLINE",
    price: "5,500",
    oldPrice: "9,000",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 6,
    title: "Deciphering Ancient Scripts",
    category: "Darshana (Philosophy)",
    instructor: "Dr. S. Murthy",
    duration: "14 Weeks",
    level: "Advanced",
    mode: "LIVE",
    price: "7,800",
    oldPrice: "12,000",
    image: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&q=80&w=1200",
  },
];

const CourseDetailPage = () => {
  const { id } = useParams();
  const [openSection, setOpenSection] = useState(0);

  // Find current course based on URL ID
  const courseData = courses.find((c) => c.id === parseInt(id));

  // Loading/Error state
  if (!courseData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCF7] font-serif">
        <h2 className="text-2xl font-bold mb-4">Shastra Not Found</h2>
        <Link to="/allcourses" className="text-[#B38B3F] font-bold border-b border-[#B38B3F]">Return to Library</Link>
      </div>
    );
  }

  const curriculum = [
    {
      title: "Introduction to the Sutras",
      lectures: 4,
      duration: "2h 45m",
      lessons: [
        { name: "The Shiva Sutras: Cosmic Sound Matrices", duration: "Preview", isPreview: true },
        { name: "Anubandhas and It-markers", duration: "15:00", isLocked: true },
      ]
    },
    {
      title: "Module 2: Structural Logic",
      lectures: 6,
      duration: "4h 20m",
      lessons: [
        { name: "Meta-rules of Interpretation", duration: "20:00", isLocked: true },
        { name: "The Alchemy of Euphony (Sandhi)", duration: "45:00", isLocked: true },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF7] font-serif text-[#2D2417] antialiased">
      
      {/* --- BREADCRUMBS & NAVIGATION --- */}
        <div className="w-full px-10 pt-10">
        
        {/* Back Button */}
        <Link 
            to="/allcourses" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFF9E8] border border-[#E2D4A6] rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#8B6D31] hover:bg-[#B38B3F] hover:text-white hover:border-[#B38B3F] transition-all duration-300 shadow-sm group mb-6"
        >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Course Library
        </Link>

        {/* Breadcrumb Path */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#8B6D31]/60">
            <span className="hover:text-[#8B6D31] cursor-pointer transition-colors">{courseData.category}</span> 
            <span className="opacity-40">/</span> 
            <span className="text-[#8B6D31]">{courseData.title}</span>
        </nav>
        </div>


      <main className="px-10 pt-10 pb-24 max-w-screen-2xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* --- LEFT COLUMN: CONTENT --- */}
          <div className="lg:w-2/3">
            
            {/* HERO CARD */}
            <div className="relative rounded-3xl overflow-hidden bg-[#2D2417] mb-12 shadow-2xl min-h-[400px] flex items-end">
              <img 
                src={courseData.image} 
                className="absolute inset-0 w-full h-full object-cover opacity-40"
                alt={courseData.title}
              />
              <div className="relative z-10 p-8 lg:p-12 w-full bg-gradient-to-t from-[#2D2417] via-transparent">
                <span className="inline-block bg-[#B38B3F] text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest mb-6">
                  {courseData.mode} Masterclass
                </span>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  {courseData.title}
                </h1>
                <p className="text-[#E6E2D3] text-lg max-w-xl leading-relaxed">
                  Unlock the linguistic architecture of the {courseData.category} with detailed traditional commentary led by {courseData.instructor}.
                </p>
              </div>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex gap-8 border-b border-[#E2D4A6] mb-12">
              {['Overview', 'Curriculum', 'Instructor', 'Reviews'].map((tab, i) => (
                <button key={tab} className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${i === 0 ? 'border-b-2 border-[#B38B3F] text-[#B38B3F]' : 'text-[#8B6D31]/50 hover:text-[#8B6D31]'}`}>
                  {tab}
                </button>
              ))}
            </div>

            {/* ABOUT THE COURSE */}
            <section className="bg-[#FFF9E8] rounded-3xl p-8 lg:p-12 border border-[#E2D4A6] mb-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#F3EEE0] rounded-xl flex items-center justify-center">
                  <FileText className="text-[#B38B3F] w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">About the Course</h2>
              </div>
              
              <div className="space-y-6 text-[#4A4135] leading-relaxed mb-10">
                <p>
                  This course offers an intensive immersion into the world of {courseData.category}. We delve beyond the surface of classical texts to understand the meta-rules that govern the entire system of Indian derivation.
                </p>
                <p>
                  Participants will engage with traditional and modern structural analysis, comparing classical interpretations with global perspectives. This is not merely a lecture; it is an exploration of the logic that structured one of humanity's oldest and most precise knowledge systems.
                </p>
              </div>

              {/* STATS GRID */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Clock, label: "Duration", val: courseData.duration },
                  { icon: BarChart, label: "Level", val: courseData.level },
                  { icon: Globe, label: "Language", val: "Sanskrit/English" },
                  { icon: Award, label: "Credential", val: "Certified" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/50 p-4 rounded-2xl border border-[#E2D4A6]/50 flex flex-col items-center text-center">
                    <item.icon className="w-5 h-5 text-[#B38B3F] mb-2" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-stone-400 mb-1">{item.label}</span>
                    <span className="text-[11px] font-bold">{item.val}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* CURRICULUM */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-[#B38B3F] rounded-full"></div>
                Course Curriculum
              </h2>
              
              <div className="space-y-4">
                {curriculum.map((section, idx) => (
                  <div key={idx} className="border border-[#E2D4A6] rounded-2xl overflow-hidden bg-white">
                    <button 
                      onClick={() => setOpenSection(openSection === idx ? -1 : idx)}
                      className="w-full px-6 py-5 flex items-center justify-between bg-[#FFF9E8]/30 hover:bg-[#FFF9E8]/60 transition"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-[#B38B3F] text-white flex items-center justify-center text-[10px] font-bold">
                          0{idx + 1}
                        </span>
                        <div className="text-left">
                          <h4 className="font-bold text-sm lg:text-base">{section.title}</h4>
                          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-tight">
                            {section.lectures} Lectures • {section.duration}
                          </span>
                        </div>
                      </div>
                      {openSection === idx ? <ChevronUp className="w-5 h-5 text-[#B38B3F]" /> : <ChevronDown className="w-5 h-5 text-[#B38B3F]" />}
                    </button>
                    
                    {openSection === idx && section.lessons.length > 0 && (
                      <div className="px-6 py-4 border-t border-[#E2D4A6]/50 space-y-4">
                        {section.lessons.map((lesson, lIdx) => (
                          <div key={lIdx} className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                              <PlayCircle className={`w-5 h-5 ${lesson.isPreview ? 'text-[#B38B3F]' : 'text-stone-300'}`} />
                              <span className={`text-sm ${lesson.isLocked ? 'text-stone-400' : 'text-[#2D2417]'}`}>{lesson.name}</span>
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${lesson.isPreview ? 'text-[#B38B3F]' : 'text-stone-400'}`}>
                              {lesson.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* INSTRUCTOR CARD */}
            <section>
              <h2 className="text-center text-2xl font-bold mb-10">Meet Your Acharya</h2>
              <div className="bg-white rounded-3xl p-8 border border-[#E2D4A6] shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFF9E8] rounded-bl-full -z-0"></div>
                
                <div className="relative z-10 w-48 h-48 flex-shrink-0">
                  <div className="absolute inset-0 border-2 border-[#B38B3F] rounded-full translate-x-2 translate-y-2"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" 
                    className="w-full h-full object-cover rounded-full border-4 border-white relative z-10"
                    alt={courseData.instructor}
                  />
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-[#2D2417] mb-1">{courseData.instructor}</h3>
                  <p className="text-[#B38B3F] text-xs font-bold uppercase tracking-[0.2em] mb-4">Senior Faculty of {courseData.category}</p>
                  <p className="text-sm text-[#4A4135] leading-relaxed mb-6">
                    With over 25 years of experience in decoding Vedic phonology and Indian morphology, {courseData.instructor} has guided thousands of seekers worldwide. Their methodology bridges the gap between oral tradition and modern linguistics.
                  </p>
                  <div className="flex gap-4">
                    <Globe className="w-4 h-4 text-[#8B6D31] cursor-pointer hover:text-[#B38B3F]" />
                    <Award className="w-4 h-4 text-[#8B6D31] cursor-pointer hover:text-[#B38B3F]" />
                    <Users className="w-4 h-4 text-[#8B6D31] cursor-pointer hover:text-[#B38B3F]" />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* --- RIGHT COLUMN: STICKY SIDEBAR --- */}
          <div className="lg:w-1/3">
            <div className="sticky top-8 bg-[#FFF9E8] rounded-3xl border border-[#E2D4A6] p-8 shadow-xl overflow-hidden">
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-8 group cursor-pointer">
                <img src={courseData.image} className="w-full h-full object-cover" alt="Preview" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <PlayCircle className="w-10 h-10 text-white fill-white/20" />
                  </div>
                </div>
              </div>

              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-4xl font-black text-[#2D2417]">₹{courseData.price}</span>
                <span className="text-lg text-stone-400 line-through">₹{courseData.oldPrice}</span>
              </div>
              <p className="text-[#4A1D1D] text-[10px] font-black uppercase tracking-widest mb-8 flex items-center gap-2">
                <Clock className="w-3 h-3" /> Offer ends in 14 hours!
              </p>

              <div className="flex flex-col gap-3 mb-10">
                <button className="w-full bg-[#B38B3F] hover:bg-[#8B6D31] text-white py-2.5 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-md shadow-[#B38B3F]/10 active:scale-[0.98]">
                    Enroll Now
                </button>
                <button className="w-full bg-white border border-[#E2D4A6] hover:bg-[#FFF9E8] text-[#2D2417] py-2.5 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-[0.98]">
                    Add to Cart
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8B6D31]">This course includes:</p>
                {[
                  { icon: CheckCircle2, text: "Lifetime access to recordings" },
                  { icon: FileText, text: "High-res manuscript scans (PDF)" },
                  { icon: Calendar, text: "Monthly Live Q&A Sessions" },
                  { icon: Award, text: "Verifiable Digital Certificate" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-[#B38B3F]" />
                    <span className="text-xs font-medium text-[#4A4135]">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-[#E2D4A6] text-center">
                <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-4">Secure Payment via Heritage Gateway</p>
                <div className="flex justify-center gap-4 opacity-40 grayscale">
                  <div className="w-8 h-5 bg-[#2D2417] rounded-sm"></div>
                  <div className="w-8 h-5 bg-[#2D2417] rounded-sm"></div>
                  <div className="w-8 h-5 bg-[#2D2417] rounded-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetailPage;