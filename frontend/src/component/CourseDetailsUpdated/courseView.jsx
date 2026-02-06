import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, BarChart2, Globe, ArrowLeft, ArrowRight, CheckCircle, Star, Quote } from 'lucide-react';

const CourseDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { course } = location.state || {};

  if (!course) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#fffcf5] text-[#74271E] font-serif font-bold text-2xl">
        Course Not Found...
      </div>
    );
  }

  // Dummy data for reviews and teacher
  const reviews = [
    { id: 1, name: "Rahul Sharma", rating: 5, comment: "The way of teaching is very traditional yet easy to understand. Highly recommended!", date: "2 days ago" },
    { id: 2, name: "Priya Verma", rating: 4, comment: "Great course content. The Vyakaran concepts are now very clear to me.", date: "1 week ago" }
  ];

  return (
    <div className="min-h-screen bg-[#fffcf5] pb-20 font-sans">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-[#74271E] overflow-hidden">
        <img src={course.image} className="w-full h-full object-cover opacity-40" alt={course.title} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <button 
            onClick={() => navigate(-1)} 
            className="absolute top-8 left-8 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <span className="bg-[#d6b15c] text-[#74271E] px-4 py-1 rounded-full text-xs font-bold uppercase mb-4 tracking-widest shadow-lg">
            {course.type} Academy
          </span>
          <h1 className="text-white text-4xl md:text-6xl font-serif font-bold max-w-3xl leading-tight">
            {course.title}
          </h1>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="max-w-[1100px] mx-auto px-6 -mt-16 relative z-10">
        <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 p-8 md:p-12">
          
          <div className="grid md:grid-cols-3 gap-12">
            {/* Left Side: Info */}
            <div className="md:col-span-2">
              <div className="flex flex-wrap gap-6 mb-8 border-b border-gray-100 pb-8">
                <div className="flex items-center gap-2 text-gray-600 font-bold">
                   <Globe size={20} className="text-[#6b1d14]" /> {course.language}
                </div>
                <div className="flex items-center gap-2 text-gray-600 font-bold">
                   <Clock size={20} className="text-[#6b1d14]" /> {course.duration}
                </div>
                <div className="flex items-center gap-2 text-gray-600 font-bold">
                   <BarChart2 size={20} className="text-[#6b1d14]" /> {course.level}
                </div>
              </div>

              <h2 className="text-2xl font-serif font-bold text-[#74271E] mb-4">About the Course</h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                {course.description} This course is designed to provide you with a profound understanding of the subject, combining traditional knowledge with modern accessibility. 
              </p>

              <h2 className="text-2xl font-serif font-bold text-[#74271E] mb-6">Course Syllabus Highlights</h2>
              <div className="space-y-4 mb-12">
                {["Fundamentals of the subject", "Advanced practical application", "Interactive doubt sessions", "Final Certification assessment"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[#fffcf5] p-4 rounded-2xl border border-[#d6b15c]/30">
                    <CheckCircle size={20} className="text-[#d6b15c]" />
                    <span className="text-gray-700 font-bold text-sm">{item}</span>
                  </div>
                ))}
              </div>

              {/* Teacher Section Added */}
              <h2 className="text-2xl font-sans-serif font-bold text-[#74271E] mb-6">Meet Your Instructor</h2>
              <div className="bg-[#fffcf5] p-6 rounded-[30px] border border-[#d6b15c]/20 flex flex-col md:flex-row gap-6 items-center mb-12">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" 
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-md"
                  alt="Instructor"
                />
                <div>
                  <h3 className="text-xl font-bold text-[#74271E]">Acharya Vikramaditya</h3>
                  <p className="text-[#d6b15c] font-bold text-sm mb-2">Ph.D. in Sanskrit Sahitya | 15+ Years Experience</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Acharya ji has trained over 5000+ students globally in Vedic Shastras and Paninian Grammar. His teaching method focuses on conceptual clarity and practical chanting.
                  </p>
                </div>
              </div>

              {/* Reviews Section Added */}
              <h2 className="text-2xl font-sans-serif font-bold text-[#74271E] mb-6">Student Feedback</h2>
              <div className="space-y-6">
                {reviews.map((rev) => (
                  <div key={rev.id} className="border-l-4 border-[#d6b15c] bg-gray-50 p-6 rounded-r-3xl">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-[#74271E]">{rev.name}</h4>
                        <div className="flex gap-1 my-1">
                          {[...Array(rev.rating)].map((_, i) => <Star key={i} size={14} fill="#d6b15c" color="#d6b15c" />)}
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">{rev.date}</span>
                    </div>
                    <p className="text-gray-600 text-sm italic flex gap-2">
                      <Quote size={16} className="text-[#d6b15c] flex-shrink-0" /> {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Pricing Card */}
            <div className="bg-[#fffcf5] rounded-[40px] p-8 border border-[#d6b15c]/30 h-fit sticky top-25 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-6 bg-[#d6b15c]"></div>
                <span className="text-[#74271E] font-bold text-sm uppercase">Total Fee</span>
              </div>
              <h3 className="text-4xl font-bold text-[#74271E] mb-8">₹{course.price}</h3>
              
              <ul className="space-y-4 mb-8 text-sm text-gray-600 font-medium">
                <li className="flex justify-between"><span>LMS Access</span> <span className="text-[#74271E]">Lifetime</span></li>
                <li className="flex justify-between"><span>Certificate</span> <span className="text-[#74271E]">Included</span></li>
                <li className="flex justify-between"><span>Support</span> <span className="text-[#74271E]">Email/Call</span></li>
              </ul>

              <button className="w-full bg-[#74271E] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#d6b15c] hover:text-[#74271E] transition-all shadow-lg active:scale-95 group">
                Enroll Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-6 p-4 bg-white rounded-2xl border border-dashed border-[#d6b15c]/50 text-center">
                <p className="text-[10px] font-bold text-[#d6b15c] uppercase mb-1">Trusted by</p>
                <p className="text-[#74271E] font-bold text-xs">1,200+ Students already enrolled</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
        .font-serif { font-family: 'Playfair Display', sans-serif; }
      `}</style>
    </div>
  );
};

export default CourseDetailPage;