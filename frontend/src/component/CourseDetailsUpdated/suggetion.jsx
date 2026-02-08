import React, { useRef } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  BarChart2,
  ArrowRight,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const courses = [
  {
    id: 1,
    title: "Vyakaran Shastra: Core Paninian Foundations",
    level: "Beginner",
    description: "Learn the core principles of Paninian grammar and sentence construction from the ground up with traditional methodology.",
    price: "9,599",
    language: "Hindi & Sanskrit",
    duration: "1 Year",
    type: "ONLINE",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500",
    instructor: {
      name: "Acharya Dr. Vasudev Shastry",
      qualification: "PHD IN VYAKARANA, BANARAS HINDU UNIVERSITY",
      bio: "With over 25 years of teaching experience, Acharya Vasudev has guided thousands of students through the complexities of Sanskrit Grammar.",
      image: "https://t3.ftcdn.net/jpg/06/20/35/33/360_F_620353344_5n9KjA60OQdE2vB6H4VlEaB0nNqI8H9o.jpg",
      tags: ["25+ Yrs Exp", "100+ Publications", "Veda Ratna Awardee", "Senior Faculty"]
    },
    curriculum: [
      {
        title: "Introduction to Paspashahnika",
        content: [
          "Purpose of Grammar (Vyakarana-prayojanam)",
          "Concept of Shabda and Artha",
          "Linguistic Analysis methodology in Mahabhashya"
        ]
      },
      {
        title: "Shivasutra and Pratyahara Analysis",
        content: [
          "Esoteric significance of the 14 Shivasutras",
          "Techniques of Pratyahara formation",
          "Phonetic classification of Sanskrit sounds"
        ]
      },
    {
      title: "Sutra Interpretation Principles",
      isLocked: true, // Special property for 3rd point
      content: [] 
    }

    ],
    schedule: [
      { type: "Weekday Batch", days: "Mon, Wed, Fri", time: "07:00 AM - 08:30 AM", Date: "15th Oct, 2024" },
      { type: "Weekend Intensive", days: "Sat, Sun", time: "06:00 PM - 08:30 PM", Date: "20th Oct, 2024" }
    ]
  },
  {
    id: 2,
    title: "Vedic Phonetics: Shlok Recitation Masterclass",
    level: "Intermediate",
    description: "Explore the precise art of Swara and Akshara in Vedic recitation, focusing on the rhythmic and tonal purity of ancient chants.",
    price: "699",
    language: "Sanskrit",
    duration: "6 Weeks",
    type: "IN-PERSON",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500",
    instructor: {
      name: "Pandit Ravi Prakash",
      qualification: "VEDIC SCHOLAR & PHONETICS EXPERT",
      bio: "A specialist in Krishna Yajurveda, Pandit Ravi Prakash focuses on the preservation of oral traditions through scientific phonetic training.",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200",
      tags: ["15+ Yrs Exp", "Vedic Expert", "Ritual Specialist", "Chanting Coach"]
    },
    curriculum: [
      {
        title: "Fundamentals of Vedic Swaras",
        content: [
          "Udatta, Anudatta, and Svarita markers",
          "Rules of Accentuating Vedic Texts",
          "Breath control and Nadi-shuddhi for chanting"
        ]
      },
      {
        title: "Practical Shlok Application",
        content: [
          "Recitation of selected Suktas",
          "Metrical analysis (Chhandas) of verses",
          "Common errors in pronunciation and corrections"
        ]
      },
      {
      title: "Sutra Interpretation Principles",
      isLocked: true, // Special property for 3rd point
      content: [] 
    }
    ],
    schedule: [
      { type: "Morning Batch", days: "Tue, Thu", time: "06:00 AM - 07:30 AM", Date: "1st Nov, 2024" },
      { type: "Evening Batch", days: "Sat", time: "04:00 PM - 07:00 PM", Date: "5th Nov, 2024" }
    ]
  },
  {
    id: 3,
    title: "Spoken Sanskrit: Conversational Level-1",
    level: "Advanced",
    description: "A comprehensive journey through conversational Sanskrit, bridging the gap between ancient metaphysical teachings and modern dialogue.",
    price: "2,499",
    language: "Hindi & English",
    duration: "3 Months",
    type: "ONLINE",
    image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=500",
    instructor: {
      name: "Dr. Ananya Sharma",
      qualification: "PHD IN SANSKRIT LITERATURE, JNU",
      bio: "Dr. Ananya focuses on making Sanskrit a living language, teaching students to express complex thoughts with simplicity and elegance.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      tags: ["10+ Yrs Exp", "Linguistics Expert", "Gold Medalist", "Modern Pedagogy"]
    },
    curriculum: [
      {
        title: "Daily Conversational Structures",
        content: [
          "Sentence formation with Lakaaras (Tenses)",
          "Commonly used verbs in daily life",
          "Vocabulary for greeting and social interaction"
        ]
      },
      {
        title: "Modern Context Immersion",
        content: [
          "Translating modern concepts into Sanskrit",
          "Group discussions on cultural topics",
          "Building confidence in spontaneous speech"
        ]
      },
      {
      title: "Sutra Interpretation Principles",
      isLocked: true, // Special property for 3rd point
      content: [] 
    }
    ],
    schedule: [
      { type: "Evening Online", days: "Mon, Wed, Fri", time: "08:00 PM - 09:30 PM", Date: "10th Nov, 2024" },
      { type: "Weekend Special", days: "Sat, Sun", time: "11:00 AM - 12:30 PM", Date: "12th Nov, 2024" }
    ]
  },
  {
    id: 4,
    title: "UGC NET : Sanskrit Excellence Program",
    level: "Professional",
    description: "A strategic preparation module focusing on essential Shastras, values, and academic teachings required for modern competitive excellence.",
    price: "1,499",
    language: "English",
    duration: "6 Months",
    type: "ONLINE",
    image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=500",
    instructor: {
      name: "Prof. S. Mukherjee",
      qualification: "UGC NET QUALIFIED & SENIOR RESEARCH FELLOW",
      bio: "Prof. Mukherjee has mentored over 500+ successful candidates, specializing in the analytical breakdown of complex exam patterns.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
      tags: ["12+ Yrs Exp", "NET Expert", "Sr. Faculty", "Research Scholar"]
    },
    curriculum: [
      {
        title: "UGC Syllabus Analysis",
        content: [
          "Deep dive into Sahitya and Darshana units",
          "Vedic Literature and Puranas overview",
          "Methodology for solving previous year papers"
        ]
      },
      {
        title: "Advanced Shastra Review",
        content: [
          "Key concepts from Kavya-Prakash and Nyaya",
          "Epigraphy and Paleography fundamentals",
          "Time-management strategies for Exam Day"
        ]
      },
      {
      title: "Sutra Interpretation Principles",
      isLocked: true, // Special property for 3rd point
      content: [] 
    }
    ],
    schedule: [
      { type: "Intensive Batch", days: "Daily", time: "05:00 PM - 07:00 PM", Date: "25th Oct, 2024" },
      { type: "Mock Test Batch", days: "Sun", time: "10:00 AM - 01:00 PM", Date: "27th Oct, 2024" }
    ]
  },
  {
    id: 5,
    title: "BA Sanskrit: Philosophical & Yogic Studies",
    level: "Degree",
    description: "A deep dive into the philosophy of Darshana Shastra and the classical practice of Yoga, integrated with academic Sanskrit studies.",
    price: "3,999",
    language: "Sanskrit & Hindi",
    duration: "3 Years",
    type: "IN-PERSON",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500",
    instructor: {
      name: "Dr. Meera Iyer",
      qualification: "ACADEMIC DEAN & YOGA PHILOSOPHER",
      bio: "Dr. Meera Iyer combines traditional textual knowledge with practical yoga philosophy to provide a holistic educational experience.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200",
      tags: ["20+ Yrs Exp", "Author", "Yoga Philosopher", "Academic Dean"]
    },
    curriculum: [
      {
        title: "Darshana Shastra Overview",
        content: [
          "Introduction to Shad-Darshanas (Six Schools)",
          "Analysis of Yoga Sutras of Patanjali",
          "Metaphysics and Epistemology in Advaita"
        ]
      },
      {
        title: "Classical Sanskrit Literature",
        content: [
          "Study of Kalidasa's Raghuvamsham",
          "Dramaturgy and Natyashastra principles",
          "Ethics in Nitishastra and Panchatantra"
        ]
      },
      {
      title: "Sutra Interpretation Principles",
      isLocked: true, // Special property for 3rd point
      content: [] 
    }
    ],
    schedule: [
      { type: "Semester Batch", days: "Mon to Fri", time: "10:00 AM - 01:00 PM", Date: "1st Dec, 2024" },
      { type: "Library Hours", days: "Sat", time: "02:00 PM - 05:00 PM", Date: "7th Dec, 2024" }
    ]
  },
  // {
  //   id: 6,
  //   title: "Gita Study: Ethical Leadership & Immersion",
  //   level: "Spiritual",
  //   description: "Study the Shrimad Bhagavad Gita fluently in Sanskrit, focusing on practical life applications and the immersive speaking of its verses.",
  //   price: "699",
  //   language: "Sanskrit",
  //   duration: "6 Weeks",
  //   type: "ONLINE",
  //   image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500",
  //   instructor: {
  //     name: "Acharya Somnath",
  //     qualification: "GITA VISHARAD & SPIRITUAL SPEAKER",
  //     bio: "Acharya Somnath specializes in the application of Gita's teachings to modern-day challenges, promoting ethical leadership and mental peace.",
  //     image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=200",
  //     tags: ["18+ Yrs Exp", "Spiritual Guide", "Keynote Speaker", "Gita Scholar"]
  //   },
  //   curriculum: [
  //     {
  //       title: "Chapter-wise Philosophical Essence",
  //       content: [
  //         "The Yoga of Selfless Action (Karma Yoga)",
  //         "Understanding the Field and Knower (Kshetra-kshetrajna)",
  //         "Devotional surrendering in Bhakti Yoga"
  //       ]
  //     },
  //     {
  //       title: "Leadership and Mind Management",
  //       content: [
  //         "Decision-making strategies from the Gita",
  //         "Maintaining equanimity (Samatvam) in crisis",
  //         "Techniques for internal peace and focus"
  //       ]
  //     },
  //     {
  //       title: "3. Sutra Interpretation Principles",
  //       isLocked: true, // Special property for 3rd point
  //       content: [] 
  //     }
  //   ],
  //   schedule: [
  //     { type: "Bhakti Batch", days: "Sat, Sun", time: "05:00 PM - 06:30 PM", startDate: "15th Nov, 2024" },
  //     { type: "Meditation Session", days: "Thu", time: "06:00 AM - 07:00 AM", startDate: "17th Nov, 2024" }
  //   ]
  // }
];

 const handleToggle = (index, isLocked) => {
    if (isLocked) {
      navigate('/login'); 
      return;
    }
    setOpenIndex(openIndex === index ? -1 : index);
  };

const CourseCard = ({ course, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 px-5"
    >
      <motion.div 
        whileHover={{ y: -10 }}
        className="bg-white rounded-3xl overflow-hidden flex flex-col h-full shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl"
      >
        <div className="relative h-48 overflow-hidden">
          <motion.img 
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
            src={course.image} 
            className="w-full h-full object-cover" 
            alt={course.title} 
          />
          <div className="absolute top-4 left-4">
            <span className="bg-white text-[#6b1d14] text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1 uppercase">
              <Globe size={12} /> {course.language}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <span className="bg-[#74271E] text-white text-[10px] font-bold px-3 py-1 rounded-md shadow-sm">{course.type}</span>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow text-left">
          <h3 className="text-[#74271E] font-bold text-lg leading-tight mb-3 font-serif line-clamp-1">{course.title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">{course.description}</p>
          
          <div className="flex items-center justify-between text-gray-600 mb-6">
            <div className="flex items-center gap-1.5 text-sm">
              <Clock size={16} className="text-[#6b1d14]" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <BarChart2 size={16} className="text-[#6b1d14]" />
              <span>{course.level}</span>
            </div>
          </div>

          <div className="mt-auto flex justify-between items-center">
            <span className="text-xl font-bold text-[#74271E]">₹{course.price}</span>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Sahi link '/coursedetail' aur scroll top logic
                navigate(`/coursedetail`, { state: { course } });
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }}
              className="bg-[#74271E] text-white text-[12px] font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-[#d6b15c] transition-colors"
            >
              View Details <ArrowRight size={14} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function CourseCarousel() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.offsetWidth / (window.innerWidth >= 1024 ? 4 : window.innerWidth >= 640 ? 2 : 1);
      scrollRef.current.scrollBy({ 
        left: dir === "left" ? -cardWidth : cardWidth, 
        behavior: "smooth" 
      });
    }
  };

  return (
    <section className="w-full py-8 font-sans-serif pb-2 overflow-hidden"> 
      <div className="max-w-[1190px] mx-auto px-1">
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-3 mb-1 mt-2">
            <div className="w-1.5 h-8 bg-[#d6b15c]"></div>
            <h2 className="text-[28px] font-bold text-[#74271E]">Recommended Courses</h2>
          </div>

          <div className="flex pr-4 sm:pr-10 gap-3">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll("left")} 
              className="bg-white p-3 rounded-full shadow-md text-[#6b1d14] hover:text-white hover:bg-[#631D11] border border-gray-100"
            >
              <ChevronLeft size={20} />
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll("right")} 
              className="bg-white p-3 rounded-full shadow-md text-[#6b1d14] hover:text-white hover:bg-[#631D11] border border-gray-100"
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </div>

        <div className="relative overflow-visible"> 
          <div 
            ref={scrollRef} 
            className="flex overflow-x-hidden no-scrollbar scroll-smooth py-3"
            style={{ scrollbarWidth: 'none' }}
          >
            {courses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
        .font-serif { font-family: 'Playfair Display', sans-serif; }
      `}</style>
    </section>
  );
}