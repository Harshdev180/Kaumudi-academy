import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Ensure lucide-react is installed

const Dashboard = () => {
  // --- CALENDAR LOGIC START ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  // --- CALENDAR LOGIC END ---

  return (
    <div className="grid grid-cols-12 gap-6">
      
      {/* Welcome Banner */}
      <div className="col-span-8 bg-[#74271E] rounded-3xl p-12 relative overflow-hidden flex items-center shadow-xl min-h-[220px]">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full border-[32px] border-[#c9a050]/10 border-dotted" />
        <div className="relative z-10">
          <h2 className="text-4xl font-serif text-white leading-tight">
            Welcome back, <br />
            <span className="font-bold">Arjun Sharma | अर्जुन शर्मा</span>
          </h2>
        </div>
      </div>

      {/* LIVE FUNCTIONAL CALENDAR CARD */}
      <div className="col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-black/5 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-800">Calendar</h3>
          <div className="flex gap-1">
            <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
              <ChevronLeft size={16} />
            </button>
            <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mb-4">{monthName} {year}</p>
        
        <div className="grid grid-cols-7 text-center text-[10px] gap-y-2 font-bold text-gray-400 uppercase tracking-tighter">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d}>{d}</div>)}
          
          {/* Empty slots for correct day alignment */}
          {[...Array(firstDayOfMonth)].map((_, i) => <div key={`empty-${i}`} />)}
          
          {/* Dynamic Days */}
          {[...Array(daysInMonth(year, currentDate.getMonth()))].map((_, i) => {
            const day = i + 1;
            const isSelected = day === selectedDay && currentDate.getMonth() === new Date().getMonth();
            const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
            
            return (
              <div 
                key={day} 
                onClick={() => setSelectedDay(day)}
                className={`py-1.5 flex items-center justify-center rounded-full transition-colors cursor-pointer text-xs 
                  ${isSelected ? 'bg-[#c9a050] text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}
                  ${isToday && !isSelected ? 'border border-[#c9a050] text-[#c9a050]' : ''}
                `}
              >
                {day}
              </div>
            );
          })}
        </div>

        <div className="mt-4 space-y-2">
          <div className="bg-red-50/50 border-l-4 border-[#74271E] p-2 rounded-r flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#74271E]">Next Session: Oct 25, 4:00 PM</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#74271E] animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="col-span-4 bg-white rounded-3xl p-8 shadow-sm flex flex-col justify-around">
        <h3 className="font-bold text-lg mb-6">Progress Summary</h3>
        <div className="space-y-8">
          {[
            { label: 'Courses Completed', val: '4/10', color: 'border-t-[#74271E]' },
            { label: 'Hours Learned', val: '120', color: 'border-[#74271E]' },
            { label: 'Current Streak', val: '15 Days', color: 'border-t-[#74271E] border-l-[#74271E]' }
          ].map((stat, idx) => (
            <div key={idx} className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-full border-4 border-gray-100 ${stat.color} flex items-center justify-center`}>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                  <div className="w-1 h-1 bg-[#74271E] rounded-full"></div>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{stat.label}:</p>
                <p className="text-xl font-black text-gray-800">{stat.val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Continue Learning */}
      <div className="col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-black/5 flex flex-col">
        <h3 className="font-bold text-lg mb-4">Continue Learning</h3>
        <div className="bg-[#2a1b0a] h-36 rounded-2xl mb-4 flex items-center justify-center text-center p-6 relative overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
          <p className="relative z-10 text-[#c9a050] font-serif text-sm border-b border-[#c9a050]/30 pb-1">
            Introduction to <br/> Sanskrit Grammar
          </p>
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm text-gray-800">Introduction to Sanskrit Grammar</p>
          <div className="flex justify-between text-[10px] font-bold text-gray-500 mt-2 mb-1">
            <span>Progress: 65%</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-[#74271E] h-full rounded-full transition-all duration-1000" style={{ width: '65%' }}></div>
          </div>
        </div>
        <button className="mt-6 w-full bg-[#74271E] text-white py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-[#5a1e17] transition-colors">
          Resume
        </button>
      </div>

      {/* Daily Shloka Card */}
      <div className="col-span-4 bg-[#fdfbf7] rounded-3xl p-8 shadow-sm border-2 border-[#e6d5b8] flex flex-col items-center justify-center text-center relative">
        {/* Corners */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#c9a050]/40 rounded-tl-lg" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#c9a050]/40 rounded-br-lg" />
        
        <h3 className="font-bold text-gray-400 uppercase tracking-[0.2em] text-[10px] mb-6">Daily Shloka</h3>
        <div className="font-serif text-xl text-gray-800 leading-relaxed mb-6">
          <p>असतो मा सद्गमय ।</p>
          <p>तमसो मा ज्योतिर्गमय ।</p>
          <p>मृत्योर्मा अमृतं गमय ।</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-gray-500 font-medium">असतो मा सद्गमय | तमसो मा ज्योतिर्गमय |</p>
          <p className="text-[10px] text-gray-500 font-medium">मृत्योर्मा अमृतं गमय |</p>
        </div>
        <p className="mt-4 text-[11px] text-[#c9a050] italic px-4">
          Translation: Lead me from the unreal to the real, from darkness to light...
        </p>
      </div>

    </div>
  );
};

export default Dashboard;