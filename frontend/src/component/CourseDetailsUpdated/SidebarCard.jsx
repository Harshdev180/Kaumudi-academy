// import React, { useState, useEffect } from "react";
// import { CheckCircle, Flame } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/useAuthHook";

// // courseFullData prop add kiya gaya hai
// const SidebarCard = ({ price, courseData }) => {
//   const navigate = useNavigate();
//   const { isAuthenticated } = useAuth();
//   const [leftSeats, setLeftSeats] = useState(0);
//   const totalSeats = 25;
//   const targetLeft = 4;
//   const [visibleFeatures, setVisibleFeatures] = useState(0);

//   // Format price properly from backend
//   const formatPrice = (p) => {
//     if (!p) return "0";
//     const numPrice =
//       typeof p === "string" ? parseInt(p.replace(/[^0-9]/g, "")) || 0 : p;
//     return numPrice.toLocaleString("en-IN");
//   };

//   const features = [
//     "120+ Hours of Live Instruction",
//     "Certificate of Completion",
//     "Access to Library & Recordings",
//     "Lifetime Discussion Forum Access",
//     "Expert Scholars with Proven Pedagogy & Wisdom",
//   ];

//   useEffect(() => {
//     if (leftSeats < targetLeft) {
//       const timer = setTimeout(() => setLeftSeats((prev) => prev + 1), 150);
//       return () => clearTimeout(timer);
//     }
//   }, [leftSeats]);

//   useEffect(() => {
//     if (visibleFeatures < features.length) {
//       const timer = setTimeout(
//         () => setVisibleFeatures((prev) => prev + 1),
//         500,
//       );
//       return () => clearTimeout(timer);
//     }
//   }, [visibleFeatures]);

//   const progressPercent = ((totalSeats - targetLeft) / totalSeats) * 100;

//   return (
//     <div className="sticky top-10 bg-white rounded-[24px] overflow-hidden shadow-xl border border-gray-100 max-w-[380px] min-h-[850px] flex flex-col">
//       <div className="relative bg-[#74271E] p-8 text-white text-center flex-none">
//         <div
//           className="absolute top-0 right-0 w-25 h-10 bg-[#d6b15c]"
//           style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
//         ></div>
//         <p className="text-[12px] uppercase tracking-[0.25em] font-bold text-stone-300 mb-2">
//           Full Course Fee
//         </p>
//         <div className="flex items-center justify-center gap-3 mt-4">
//           <span className="text-4xl font-extrabold tracking-tight">
//             ₹{formatPrice(price)}
//           </span>
//           <span className="text-xl line-through text-stone-400 font-medium">
//             ₹24,000
//           </span>
//         </div>
//         <div className="mt-6 inline-block bg-[#d6b15c] text-[#3D1A16] text-[11px] font-bold px-6 py-2 rounded-full shadow-md">
//           EMI STARTS AT ₹1,500/MO
//         </div>
//       </div>

//       <div className="p-8 flex-grow flex flex-col justify-between space-y-6">
//         <div className="space-y-10">
//           <div className="space-y-4">
//             <div className="flex justify-between items-start">
//               <div className="flex gap-2">
//                 <Flame size={22} className="text-[#d6b15c] fill-[#d6b15c]" />
//                 <span className="text-[#631D11] font-bold text-[15px] leading-tight">
//                   Limited Seats
//                   <br />
//                   Remaining
//                 </span>
//               </div>
//               <span className="font-extrabold text-[#631D11] text-right text-[15px]">
//                 {leftSeats} / {totalSeats}
//                 <br />
//                 <span className="font-medium text-[12px] text-gray-500 uppercase tracking-wide">
//                   left
//                 </span>
//               </span>
//             </div>
//             <div className="w-full bg-[#F3F0E9] h-3.5 rounded-full overflow-hidden">
//               <div
//                 className="bg-[#d6b15c] h-full rounded-full shadow-inner transition-all duration-1000"
//                 style={{ width: `${leftSeats > 0 ? progressPercent : 0}%` }}
//               ></div>
//             </div>
//           </div>

//           <ul className="space-y-8">
//             {features.map((item, i) => (
//               <li
//                 key={i}
//                 className={`flex gap-7 items-start leading-snug transition-all duration-500 ${i < visibleFeatures ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
//               >
//                 <CheckCircle
//                   size={24}
//                   className={`text-[#d6b15c] shrink-0 transition-transform duration-500 ${i < visibleFeatures ? "scale-100" : "scale-0"}`}
//                   fill="#B18E401A"
//                   strokeWidth={2.5}
//                 />
//                 <span className="text-[#7A5C58] font-bold text-[18px]">
//                   {item}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Buttons Section with Spacing and Data Passing */}
//         <div className="flex flex-col space-y-6 mt-auto">
//           <Link
//             to="/courseBuy"
//             className="w-full"
//             state={{
//               courseId: courseData?._id || courseData?.id || null,
//               courseName: courseData?.title,
//               price: courseData?.price,
//               duration: courseData?.duration,
//               level: courseData?.level,
//               language: courseData?.language,
//               mode: "Live Online",
//             }}
//           >
//             <div className="flex justify-center w-full">
//               <button className="w-[80%] bg-[#631D11] text-white px-8 py-3 rounded-2xl font-bold text-xl hover:text-[#631D11] hover:bg-[#d6b15c] transition-all flex items-center justify-center gap-2 shadow-lg">
//                 Enroll Now <span className="text-2xl">→</span>
//               </button>
//             </div>
//           </Link>

//           {/* Inquiry Link with State Data */}

//           <Link
//             to="/inquiry"
//             className="w-full"
//             state={{
//               // courseData se title, duration aur language uthayega
//               courseName: courseData?.title || "Sanskrit for Beginners",
//               duration: courseData?.duration || "6 Months",
//               language: courseData?.language || "Sanskrit/Hindi",
//               level: courseData?.level || "Beginner",
//             }}
//           >
//             <div className="flex justify-center w-full">
//               <button className="w-[80%] bg-[#631D11] text-white px-8 py-3 rounded-2xl font-bold text-xl hover:text-[#631D11] hover:bg-[#d6b15c] transition-all flex items-center justify-center gap-2 shadow-lg">
//                 Inquiry <span className="text-2xl">→</span>
//               </button>
//             </div>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };a

// export default SidebarCard;
import React, { useState, useEffect } from "react";
import { CheckCircle, Flame } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuthHook";
import { getMyEnrollments } from "../../lib/api";

const SidebarCard = ({ price, courseData }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [leftSeats, setLeftSeats] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);
  const totalSeats = 25;
  const targetLeft = 4;
  const [visibleFeatures, setVisibleFeatures] = useState(0);

  const courseId = courseData?._id || courseData?.id;

  // Check if already enrolled
  // useEffect(() => {
  //   if (!isAuthenticated || !courseId) return;

  //   const check = async () => {
  //     try {
  //       setCheckingEnrollment(true);
  //       const res = await getMyEnrollments();
  //       const enrollments = res?.data || res?.enrollments || res || [];
  //       const enrolled = enrollments.some(
  //         (e) => (e.course?._id || e.course || e.courseId) === courseId,
  //       );
  //       setIsEnrolled(enrolled);
  //     } catch (err) {
  //       console.error("Enrollment check failed", err);
  //     } finally {
  //       setCheckingEnrollment(false);
  //     }
  //   };

  //   check();
  // }, [isAuthenticated, courseId]);
  useEffect(() => {
    if (!isAuthenticated || !courseId) return;

    const check = async () => {
      try {
        setCheckingEnrollment(true);

        const res = await getMyEnrollments();
        console.log("swarup das check", res);
        const enrollments = res?.data || res?.enrollments || res || [];

        const enrolled = enrollments.some((e) => {
          const enrolledCourseId =
            e?.course?._id || e?.courseId || e?.course || null;

          return enrolledCourseId?.toString() === courseId?.toString();
        });

        setIsEnrolled(enrolled);
      } catch (err) {
        console.error("Enrollment check failed", err);
      } finally {
        setCheckingEnrollment(false);
      }
    };

    check();
  }, [isAuthenticated, courseId]);

  const formatPrice = (p) => {
    if (!p) return "0";
    const numPrice =
      typeof p === "string" ? parseInt(p.replace(/[^0-9]/g, "")) || 0 : p;
    return numPrice.toLocaleString("en-IN");
  };

  const features = [
    "120+ Hours of Live Instruction",
    "Certificate of Completion",
    "Access to Library & Recordings",
    "Lifetime Discussion Forum Access",
    "Expert Scholars with Proven Pedagogy & Wisdom",
  ];

  useEffect(() => {
    if (leftSeats < targetLeft) {
      const timer = setTimeout(() => setLeftSeats((prev) => prev + 1), 150);
      return () => clearTimeout(timer);
    }
  }, [leftSeats]);

  useEffect(() => {
    if (visibleFeatures < features.length) {
      const timer = setTimeout(
        () => setVisibleFeatures((prev) => prev + 1),
        500,
      );
      return () => clearTimeout(timer);
    }
  }, [visibleFeatures]);

  const progressPercent = ((totalSeats - targetLeft) / totalSeats) * 100;

  const enrollState = !isAuthenticated
    ? "guest"
    : checkingEnrollment
      ? "checking"
      : isEnrolled
        ? "enrolled"
        : "available";

  return (
    <div className="sticky top-10 bg-white rounded-[24px] overflow-hidden shadow-xl border border-gray-100 max-w-[380px] min-h-[650px] flex flex-col">
      <div className="relative bg-[#74271E] p-8 text-white text-center flex-none">
        <div
          className="absolute top-0 right-0 w-25 h-10 bg-[#d6b15c]"
          style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
        ></div>
        <p className="text-[12px] uppercase tracking-[0.25em] font-bold text-stone-300 mb-2">
          Full Course Fee
        </p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <span className="text-4xl font-extrabold tracking-tight">
            ₹{formatPrice(price)}
          </span>
          <span className="text-xl line-through text-stone-400 font-medium">
            ₹{formatPrice(price * 3)}
          </span>
        </div>
        <div className="mt-6 inline-block bg-[#d6b15c] text-[#3D1A16] text-[11px] font-bold px-6 py-2 rounded-full shadow-md">
          MONTHLY EMI STARTS
        </div>
      </div>

      <div className="p-8 flex-grow flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          {/* <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-2">
                <Flame size={22} className="text-[#d6b15c] fill-[#d6b15c]" />
                <span className="text-[#631D11] font-bold text-[15px] leading-tight">
                  Limited Seats
                  <br />
                  Remaining
                </span>
              </div>
              <span className="font-extrabold text-[#631D11] text-right text-[15px]">
                {leftSeats} / {totalSeats}
                <br />
                <span className="font-medium text-[12px] text-gray-500 uppercase tracking-wide">
                  left
                </span>
              </span>
            </div>
            <div className="w-full bg-[#F3F0E9] h-3.5 rounded-full overflow-hidden">
              <div
                className="bg-[#d6b15c] h-full rounded-full shadow-inner transition-all duration-1000"
                style={{ width: `${leftSeats > 0 ? progressPercent : 0}%` }}
              ></div>
            </div>
          </div> */}

          <ul className="space-y-6">
            {features.map((item, i) => (
              <li
                key={i}
                className={`flex gap-7 items-start leading-snug transition-all duration-500 ${i < visibleFeatures
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4"
                  }`}
              >
                <CheckCircle
                  size={24}
                  className={`text-[#d6b15c] shrink-0 transition-transform duration-500 ${i < visibleFeatures ? "scale-100" : "scale-0"
                    }`}
                  fill="#B18E401A"
                  strokeWidth={2.5}
                />
                <span className="text-[#7A5C58] font-bold text-[18px]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex flex-col space-y-6 ">
          {/* ENROLL BUTTON */}
          {enrollState === "enrolled" ? (
            <div className="flex justify-center w-full">
              <div className="w-[80%] bg-green-600 text-white px-8 py-3 rounded-2xl font-bold text-xl flex items-center justify-center gap-2 shadow-lg cursor-default">
                <CheckCircle size={22} /> Already Purchased
              </div>
            </div>
          ) : enrollState === "checking" ? (
            <div className="flex justify-center w-full">
              <div className="w-[80%] bg-gray-300 text-gray-600 px-8 py-3 rounded-2xl font-bold text-xl flex items-center justify-center gap-2">
                Checking...
              </div>
            </div>
          ) : (
            <Link
              to={isAuthenticated ? "/courseBuy" : "/login"}
              className="w-full"
              state={
                isAuthenticated
                  ? {
                    courseId,
                    courseName: courseData?.title,
                    price: courseData?.price,
                    startDate: courseData?.startDate,
                    endDate: courseData?.endDate,
                    level: courseData?.level,
                    language: courseData?.language,
                    mode: "Live Online",
                  }
                  : { from: `/coursedetail/${courseId}` }
              }
            >
              <div className="flex justify-center w-full">
                <button className="w-[80%] bg-[#631D11] text-white px-8 py-3 rounded-2xl font-bold text-xl hover:text-[#631D11] hover:bg-[#d6b15c] transition-all flex items-center justify-center gap-2 shadow-lg">
                  {isAuthenticated ? "Enroll Now" : "Enroll Now"}{" "}
                  <span className="text-2xl">→</span>
                </button>
              </div>
            </Link>
          )}

          {/* INQUIRY BUTTON */}
          <Link
            to="/inquiry"
            className="w-full"
            state={{
              courseName: courseData?.title || "Sanskrit for Beginners",
              duration: courseData?.duration || "6 Months",
              language: courseData?.language || "Sanskrit/Hindi",
              level: courseData?.level || "Prathama (Beginner)",
            }}
          >
            <div className="flex justify-center w-full">
              <button className="w-[80%] bg-[#631D11] text-white px-8 py-3 rounded-2xl font-bold text-xl hover:text-[#631D11] hover:bg-[#d6b15c] transition-all flex items-center justify-center gap-2 shadow-lg">
                Inquiry <span className="text-2xl">→</span>
              </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SidebarCard;
