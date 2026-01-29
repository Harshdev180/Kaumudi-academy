import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react'; 

const slowReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 1.2, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2
    }
  }
};

export default function CourseHero() {
  return (
    <section className="space-y-6 rounded-3xl">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative overflow-hidden rounded-2xl h-[520px] group shadow-2xl"
      >
        {/* Background Image */}
        <motion.img
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src="src/assets/image1.jpeg"
          alt="Sanskrit Manuscript"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* 🔥 FIX: Shadow ab Neeche se Upar ki taraf hai (Bottom-to-Top Gradient) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        <div className="relative h-full p-10 flex flex-col justify-end">
          
          {/* STEP 1: Badges */}
          <motion.div variants={slowReveal} className="flex items-center gap-3 mb-6">
            <span className="bg-[#6b1d14] text-white text-[10px] uppercase font-bold px-3 py-1 rounded-md tracking-widest shadow-lg">
              Advanced
            </span>
            <div className="flex items-center gap-1.5 bg-white/95 text-[#6b1d14] text-[10px] uppercase font-bold px-3 py-1 rounded-md tracking-widest shadow-lg">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Certificate
            </div>
          </motion.div>

          {/* STEP 2: Main Heading */}
          <motion.h1 
            variants={slowReveal}
            className="text-4xl md:text-5xl leading-[1.1] font-bold text-white drop-shadow-lg max-w-3xl"
          >
            Mastering Paninian Grammar:
            <br />
            <span className="text-white/90">The Ashtadhyayi Framework</span>
          </motion.h1>

          {/* STEP 3: Description */}
          <motion.p 
            variants={slowReveal}
            className="mt-6 text-white/80 text-lg max-w-xl leading-relaxed border-l-4 border-[#6b1d14] pl-5"
          >
            A comprehensive journey through the structural brilliance of
            classical Sanskrit linguistics.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}