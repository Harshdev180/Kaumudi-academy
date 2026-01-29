import React from 'react';
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

  return (
    <section className="max-w-3xl py-8">
      {/* Section Title with Index Number */}
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-2xl font-serif font-bold text-[#6b1d14]">2.</span>
        <h2 className="text-2xl font-bold text-[#6b1d14]">Curriculum</h2>
      </div>

      <div className="space-y-4">
        {curriculumData.map((section, index) => (
          <div key={index} className="border border-gray-100 rounded-xl overflow-hidden bg-[#FFF8F0]  shadow-sm">
            {section.isLocked ? (
              // Locked Section
              <div className="flex items-center justify-between p-5 bg-[#FFF8F0]  cursor-not-allowed">
                <div className="flex gap-4 items-center">
                  <span className="text-sm font-bold text-[#6b1d17] min-w-[80px]">{section.week}</span>
                  <span className="font-semibold text-gray-400">{section.title}</span>
                </div>
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
            ) : (
              // Active Section (Accordion)
              <details className="group" open={section.isOpen}>
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                  <div className="flex gap-4 items-center">
                    <span className="text-sm font-bold text-[#6b1d14] min-w-[80px]">{section.week}</span>
                    <span className="font-bold text-gray-800">{section.title}</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-600 group-open:rotate-180 transition-transform" />
                </summary>

                <div className="px-5 pb-5 pt-2 border-t border-gray-50">
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
          </div>
        ))}
      </div>
    </section>
  );
}