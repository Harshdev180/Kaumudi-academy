import React from 'react';

export default function Overview() {
  return (
    // Padding vertical (py) ko kam karke 4 kar diya hai
    <section className="max-w-3xl py-4">
      {/* Heading aur index ke beech ka margin (mb) bhi kam kiya gaya hai */}
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-serif font-bold text-[#6b1d14]">1.</span>
        <h2 className="text-2xl font-bold text-[#6b1d14] tracking-tight">
          Overview
        </h2>
      </div>

      {/* Paragraph text */}
      <p className="text-[#374151] leading-relaxed text-[16px]">
        The Ashtadhyayi of Panini is more than just a grammar book; it is a 
        sophisticated generative machine. This course provides a robust 
        foundation in linguistic analysis, covering the Maheshwara Sutras, 
        Pratyaharas, and the intricate rule-ordering systems (Paribhashas) 
        that govern the language.
      </p>
    </section>
  );
}