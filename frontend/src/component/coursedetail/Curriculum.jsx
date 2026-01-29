import React from 'react';
import { motion } from 'framer-motion'; 
import { ChevronDown, PlayCircle, FileText, HelpCircle, Lock } from 'lucide-react';

export default function Curriculum() {
  const curriculumData = [
    {
      week: "Week 1-3",
      title: "Foundations of Paninian Logic",
      isOpen: true,
      items: [
        { type: 'video', label: 'Introduction to Maheshwara Sutras' },
        { type: 'file', label: 'Decoding the Pratyahara Technique' },
        { type: 'quiz', label: 'Module 1 Assessment: Phonetic Structures' },
      ]
    },
    {
      week: "Week 4-8",
      title: "Morphology & Sandhi Rules",
      isOpen: false,
      items: [
        { type: 'video', label: 'Understanding Sandhi Frameworks' },
        { type: 'file', label: 'Morphological Analysis PDF' },
      ]
    },
    {
      week: "Week 9-12",
      title: "Karakas and Advanced Syntax",
      isLocked: true,
      items: [
        { type: 'video', label: 'Understanding Frameworks' },
        { type: 'file', label: 'Morphological Analysis ' },
      ]
    }
  ];

  // 1. Parent Container:
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4, // Ab har card 0.4s ke gap pe aayega (Pehele 0.15s tha)
        delayChildren: 0.2
      }
    }
  };

  // 2. Individual Item: Duration 0.4s se badhakar 1.2s kar di hai
  const item = {
    hidden: { opacity: 0, y: 40 }, // Niche se upar aayega
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 1.2, // Kaafi slow aur smooth transition
        ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for "Premium Feel"
      } 
    }
  };

  return (
    <section className="max-w-3x2 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex items-baseline gap-2 mb-6"
      >
        <span className="text-2xl font-serif font-bold text-[#6b1d14]">2.</span>
        <h2 className="text-2xl font-bold text-[#6b1d14]">Curriculum</h2>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show" 
        viewport={{ once: true, amount: 0.1 }} 
        className="space-y-5"
      >
        {curriculumData.map((section, index) => (
          <motion.div 
            key={index} 
            variants={item} 
            className="border border-gray-100 rounded-xl overflow-hidden bg-[#FFF8F0] shadow-sm"
          >
            {section.isLocked ? (
              <div className="flex items-center justify-between p-6 bg-[#f9f4ec] cursor-not-allowed">
                <div className="flex gap-4 items-center">
                  <span className="text-sm font-bold text-gray-400 min-w-[80px]">{section.week}</span>
                  <span className="font-semibold text-gray-400">{section.title}</span>
                </div>
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
            ) : (
              <details className="group" open={section.isOpen}>
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-[#fdf2e9] transition-all duration-500">
                  <div className="flex gap-4 items-center">
                    <span className="text-sm font-bold text-[#6b1d14] min-w-[80px]">{section.week}</span>
                    <span className="font-bold text-gray-800">{section.title}</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-600 group-open:rotate-180 transition-transform duration-700" />
                </summary>

                <div className="px-6 pb-6 pt-2 border-t border-[#f3e6d5]">
                  <ul className="space-y-4">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                        {item.type === 'video' && <PlayCircle className="w-4 h-4 text-[#6b1d14]" />}
                        {item.type === 'file' && <FileText className="w-4 h-4 text-[#6b1d14]" />}
                        {item.type === 'quiz' && <HelpCircle className="w-4 h-4 text-[#6b1d14]" />}
                        <span className="flex-1">{item.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            )}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}