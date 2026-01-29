import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Mastering Paninian Grammar",
    price: "5,481",
    rating: "9.3",
    status: "Superb",
    reviews: "1,368",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
  },
  {
    id: 2,
    title: "Vedic Phonetics & Sound",
    price: "20,501",
    rating: "8.9",
    status: "Fabulous",
    reviews: "1,123",
    image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=400",
  },
  {
    id: 3,
    title: "Manuscript Decoding 101",
    price: "7,674",
    rating: "8.6",
    status: "Fabulous",
    reviews: "141",
    image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=400",
  },
  {
    id: 4,
    title: "Classical Sanskrit Syntax",
    price: "7,369",
    rating: "8.1",
    status: "Very good",
    reviews: "668",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
  },
  {
    id: 5,
    title: "Bhagavad Gita Analysis",
    price: "4,200",
    rating: "9.5",
    status: "Exceptional",
    reviews: "2,105",
    image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=400",
  },
  {
    id: 6,
    title: "Yoga Sutras of Patanjali",
    price: "8,999",
    rating: "8.7",
    status: "Fabulous",
    reviews: "892",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
  },
];

const CourseCard = ({ course }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="w-full sm:w-1/2 md:w-1/4 flex-shrink-0 px-3 group/card mb-6">
      {/* Har card ka main WHITE DIV */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-white hover:shadow-md transition-shadow h-full flex flex-col">
        {/* Image Area */}
        <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-4">
          <img
            src={course.image}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
            alt={course.title}
          />
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-[#FFF8F0]/80 hover:bg-white transition-all duration-300 shadow-sm z-10"
          >
            <Heart
              size={18}
              className={`transition-colors duration-300 stroke-[2.5px] ${
                isLiked
                  ? "fill-red-500 text-red-500"
                  : "text-gray-500 hover:text-red-400"
              }`}
            />
          </button>
        </div>

        {/* Content Area Inside the Div */}
        <div className="flex flex-col flex-grow">
          <h3 className="font-bold text-gray-900 text-[15px] leading-snug line-clamp-1">
            {course.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1">Sanskrit Academy</p>

          <div className="flex items-center gap-2 mt-3">
            <span className="bg-[#6b1d14] text-white text-[11px] font-bold px-1.5 py-1 rounded-sm">
              {course.rating}
            </span>
            <span className="text-sm font-semibold text-gray-800">
              {course.status}
            </span>
            <span className="text-[11px] text-gray-400 font-medium">
              · {course.reviews}
            </span>
          </div>

          {/* Bottom Section: Price + Button */}
          <div className="mt-auto pt-4 space-y-3">
            <div className="flex justify-end">
              <p className="text-[11px] text-gray-500">
                Starting from{" "}
                <span className="text-base font-bold text-gray-900 ml-1">
                  ₹ {course.price}
                </span>
              </p>
            </div>

            {/* View Details Button added INSIDE the sub-div of each course */}
            <button className="w-full py-2.5 bg-[#6b1d14] border-2 border-[#6b1d14] text-white text-[13px] font-bold rounded-xl hover:bg-[#FFF8F0] hover:text-[#6b1d14] transition-all duration-300 transform active:scale-95">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CourseCarousel() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.offsetWidth;
      scrollRef.current.scrollBy({
        left: dir === "left" ? -containerWidth : containerWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-[#F3EAD3] w-full py-12 px-4 relative group overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-baseline mb-8 px-3">
          <h2 className="text-2xl font-extrabold text-[#2D2922] tracking-tight">
            Courses students Suggestion
          </h2>
        </div>

        {/* Nav Buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-6 top-[45%] -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-xl border border-gray-100 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
        >
          <ChevronLeft size={24} className="text-gray-800" />
        </button>

        <button
          onClick={() => scroll("right")}
          className="absolute right-6 top-[45%] -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-xl border border-gray-100 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
        >
          <ChevronRight size={24} className="text-gray-800" />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-hidden scroll-smooth -mx-3 pb-4"
        >
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
