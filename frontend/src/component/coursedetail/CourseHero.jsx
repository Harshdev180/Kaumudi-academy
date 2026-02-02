import React from 'react';
import { Clock, Video, BarChart2, Languages, ShieldCheck } from 'lucide-react'; 

export default function CourseHero() {
  return (
    /* Main wrapper updated with the requested background color */
    <section className="space-y-6 rounded-3xl">
      {/* HERO CARD */}
      <div className="relative overflow-hidden rounded-2xl h-[400px] group">
        <img
          src="src/assets/image1.jpeg"
          alt="Sanskrit Manuscript"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        <div className="relative h-full p-10 flex flex-col justify-end max-w-4xl">
          {/* Badges */}
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[#6b1d14] text-white text-[10px] uppercase font-bold px-3 py-1 rounded-md tracking-widest shadow-lg">
              Advanced
            </span>
            <div className="flex items-center gap-1.5 bg-white/95 text-[#6b1d14] text-[10px] uppercase font-bold px-3 py-1 rounded-md tracking-widest shadow-lg">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Certificate
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl leading-[1.1] font-bold text-white drop-shadow-md">
            Mastering Paninian Grammar:
            <br />
            <span className="text-white/90">The Ashtadhyayi Framework</span>
          </h1>

          <p className="mt-4 text-white/80 text-lg max-w-xl leading-relaxed border-l-2 border-[#6b1d14] pl-4">
            A comprehensive journey through the structural brilliance of
            classical Sanskrit linguistics.
          </p>
        </div>
      </div>

      {/* INFO STRIP */}
      <div className="bg-[#FFF8F0]  rounded-2xl border border-gray-100 shadow-sm px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Duration */}
        <div className="flex flex-col gap-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-[#6b1d14]">
            <Clock className="w-4 h-4" />
            <span className="text-[11px] uppercase font-extrabold tracking-widest">Duration</span>
          </div>
          <span className="text-gray-500 font-bold text-base ml-0 md:ml-6">12 Weeks</span>
        </div>

        {/* Mode */}
        <div className="flex flex-col gap-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-[#6b1d14]">
            <Video className="w-4 h-4" />
            <span className="text-[11px] uppercase font-extrabold tracking-widest">Mode</span>
          </div>
          <span className="text-gray-500 font-bold text-base ml-0 md:ml-6">Live + Recorded</span>
        </div>

        {/* Level */}
        <div className="flex flex-col gap-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-[#6b1d14]">
            <BarChart2 className="w-4 h-4" />
            <span className="text-[11px] uppercase font-extrabold tracking-widest">Level</span>
          </div>
          <span className="text-gray-500 font-bold text-base ml-0 md:ml-6">Advanced</span>
        </div>

        {/* Language */}
        <div className="flex flex-col gap-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-[#6b1d14]">
            <Languages className="w-4 h-4" />
            <span className="text-[11px] uppercase font-extrabold tracking-widest">Language</span>
          </div>
          <span className="text-gray-500 font-bold text-base ml-0 md:ml-6">Sanskrit & English</span>
        </div>

      </div>
    </section>
  );
}