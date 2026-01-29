import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, BarChart2, Globe, Award, BookOpen, Mail, Shield, Check } from 'lucide-react';

// 1. Premium Slow Transition Settings
const slowReveal = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 1.2, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  }
};

const tabContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

export default function Overview() {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Curriculum', 'Instructor', 'Reviews'];

  // Instructor Section
  const InstructorSection = () => (
    <motion.div variants={slowReveal} initial="hidden" animate="show" className="bg-[#FFF8F0] rounded-2xl border border-[#F3EAD3] p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
      <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-[#6b1d14] overflow-hidden flex-shrink-0">
        <img src="src/assets/image1.jpeg" alt="Instructor" className="w-full h-full object-cover" />
      </div>
      <div className="flex-grow text-center md:text-left">
        <h3 className="text-2xl font-bold text-[#6b1d14]">Dr. Vikram Shastri</h3>
        <p className="text-[#6b1d14] font-bold text-sm mb-4">PhD in Vyakarana, VHU</p>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          With over 25 years of experience in decoding Vedic phonology. He bridges the gap between oral tradition and computational linguistics.
        </p>
        <div className="flex justify-center md:justify-start gap-4">
          <Mail size={20} className="text-[#6b1d14] cursor-pointer" />
          <Globe size={20} className="text-[#6b1d14] cursor-pointer" />
        </div>
      </div>
    </motion.div>
  );

  // Overview Content 
  const OverviewContent = () => (
    <motion.div variants={slowReveal} initial="hidden" animate="show" className="relative bg-[#FFF8F0] rounded-2xl border border-[#F3EAD3] p-8 md:p-14 shadow-sm overflow-hidden">
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#d1d1d1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-center gap-6 mb-10">
          <div className="h-[1px] flex-1 bg-gray-200"></div>
          <BookOpen size={30} className="text-[#6b1d14]" />
          <div className="h-[1px] flex-1 bg-gray-200"></div>
        </div>
        
        <h2 className="text-2xl font-bold text-[#6b1d14] mb-6">About the Course</h2>
        <div className="space-y-6 text-[#4B5563] leading-relaxed mb-10">
          <p>This course offers an intensive immersion into the world of Pāṇini, the father of modern linguistics. We delve beyond the surface of the Ashtadhyayi.</p>
          <p>Participants will engage with the Kashi-Vritti and Siddhanta-Kaumudi traditions, comparing classical interpretations with modern analysis.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'DURATION', val: '12 Weeks', icon: <Clock size={18} /> },
            { label: 'LEVEL', val: 'Advanced', icon: <BarChart2 size={18} /> },
            { label: 'LANGUAGE', val: 'Sanskrit/English', icon: <Globe size={18} /> },
            { label: 'CREDENTIAL', val: 'Certified', icon: <Award size={18} /> }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              whileHover={{ scale: 1.05, y: -5 }} 
              className="bg-[#FFF8F0] border border-black/10 rounded-xl p-4 flex flex-col items-center text-center transition-shadow hover:shadow-md"
            >
              <div className="text-[#6b1d14] mb-2">{item.icon}</div>
              <span className="text-[10px] font-bold text-gray-400">{item.label}</span>
              <span className="text-[13px] font-bold text-[#2D2922]">{item.val}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full">
      {/* TABS NAVIGATION - Sequence Reveal */}
      <motion.div 
        variants={tabContainer} 
        initial="hidden" 
        whileInView="show" 
        viewport={{ once: true }}
        className="flex gap-8 border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar"
      >
        {tabs.map((tab) => (
          <motion.button
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-bold transition-all relative whitespace-nowrap ${
              activeTab === tab ? 'text-[#6b1d14]' : 'text-black'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="activeTabLine" className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#6b1d14] rounded-full" />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* DYNAMIC CONTENT AREA - Slow Cinematic Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {activeTab === 'Overview' && <OverviewContent />}
          
          {activeTab === 'Curriculum' && (
            <div className="bg-[#FFF8F0] p-10 rounded-2xl border border-[#F3EAD3] shadow-sm">
              <h3 className="text-xl font-bold text-[#6b1d14] mb-4">Course Curriculum</h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex gap-3 items-center"><Check className="text-[#6b1d14]" size={18}/> Maheshwara Sutras & Phonology</li>
                <li className="flex gap-3 items-center"><Check className="text-[#6b1d14]" size={18}/> Pratyaharas & Rule Ordering</li>
              </ul>
            </div>
          )}

          {activeTab === 'Instructor' && <InstructorSection />}

          {activeTab === 'Reviews' && (
            <div className="p-12 bg-[#FFF8F0] rounded-2xl border border-[#F3EAD3] text-center shadow-sm">
              <Shield size={40} className="mx-auto text-[#6b1d14] mb-4" />
              <p className="text-gray-500 font-medium italic">Student reviews are loading from the Sanskrit Academy database...</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}