import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import heroImg from "../assets/wheel.jpg";

/* ================= THEME COLORS ================= */
const BG = "#f1e4c8";
const MAROON = "#74271E";
const GOLD = "#d6b15c";

const FONT_DISPLAY = "'Lexend', sans-serif";
const FONT_SERIF = "'Crimson Pro', serif";

export default function Home() {
  const [hoverPrimary, setHoverPrimary] = useState(false);
  const [hoverSecondary, setHoverSecondary] = useState(false);
  const scrollRef = useRef(null);
  const [courseIndex, setCourseIndex] = useState(0);
  /* ================= FONTS ================= */



  

  /* ================= AUTO SCROLL TEXT ================= */
  useEffect(() => {
    let x = window.innerWidth;
    let animationId;
    const speed = 0.35;

    const move = () => {
      if (scrollRef.current) {
        x -= speed;
        if (x <= -scrollRef.current.scrollWidth / 2) {
          x = window.innerWidth;
        }
        scrollRef.current.style.transform = `translateX(${x}px)`;
      }
      animationId = requestAnimationFrame(move);
    };

    animationId = requestAnimationFrame(move);
    return () => cancelAnimationFrame(animationId);
  }, []);
  
const testimonials = [
  {
    name: "Michael Brown",
    role: "Business Owner",
    text: "Solid craftsmanship. Will order again for my office.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
  },
  {
    name: "Donald Jackman",
    role: "Content Creator",
    text: "The chair quality is excellent and delivery was quick. Great value.",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
    rating: 5,
  },
  {
    name: "Richard Nelson",
    role: "Instagram Influencer",
    text: "Loved the sofa design. Cushioning could be a bit softer.",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
    rating: 4,
  },
  {
    name: "Sophia Lee",
    role: "Interior Designer",
    text: "Elegant designs and premium feel. Clients loved it.",
    image: "https://randomuser.me/api/portraits/women/47.jpg",
    rating: 5,
  },
  {
    name: "James Carter",
    role: "Entrepreneur",
    text: "Very sturdy furniture. Packaging was excellent.",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    rating: 4,
  },
  {
    name: "Ava Wilson",
    role: "Architect",
    text: "Minimalistic and classy. Fits modern interiors perfectly.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 5,
  },
];

const [testimonialIndex, setTestimonialIndex] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setTestimonialIndex((prev) =>
      prev + 3 >= testimonials.length ? 0 : prev + 3
    );
  }, 4000);

  return () => clearInterval(interval);
}, []);

  return (
    <>
      <Navbar />

      {/* ================= HERO ================= */}
      <section style={styles.page}>
        <div
          style={{
            ...styles.hero,
            background: `
              linear-gradient(
                90deg,
                rgba(118, 71, 59, 0.88) 0%,
                rgba(110, 51, 36, 0.75) 48%,
                rgba(215, 67, 30, 0.35) 100%
              ),
              url(${heroImg}) center/cover no-repeat
            `,
          }}
        >
          <div style={styles.content}>
            <div style={styles.line}></div>

            <h1 style={styles.heading}>
              Reviving the <br />
              Timeless Wisdom <br />
              of <span style={{ color: GOLD, fontFamily: FONT_SERIF }}>
  Sanskrit
</span>

            </h1>

            <p style={styles.text}>
              Immerse yourself in the profound heritage of classical Sanskrit
              through our curated traditional and modern learning programs.
            </p>

            <div style={styles.actions}>
              <button
                style={{
                  ...styles.primary,
                  background: hoverPrimary ? "#c9a84e" : GOLD,
                }}
                onMouseEnter={() => setHoverPrimary(true)}
                onMouseLeave={() => setHoverPrimary(false)}
              >
                Explore Courses
              </button>

              <button
                style={{
                  ...styles.secondary,
                  background: hoverSecondary
                    ? "rgba(255,255,255,0.28)"
                    : styles.secondary.background,
                }}
                onMouseEnter={() => setHoverSecondary(true)}
                onMouseLeave={() => setHoverSecondary(false)}
              >
                Contact Academy
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SCROLL TEXT ================= */}
      <div style={styles.courseScrollWrapper}>
        <div ref={scrollRef} style={styles.scrollTrack}>
          {Array(8)
            .fill("ज्ञानप्रदीपः — Illuminating minds through Sanskrit wisdom 📜")
            .map((text, i) => (
              <span key={i}>{text}</span>
            ))}
        </div>
      </div>

      {/* ================= EXPLORE COURSES ================= */}
      <section style={styles.exploreSection}>
        <div style={styles.exploreHeader}>
          <h2>Explore Our Courses</h2>
        </div>

        <div style={styles.courseCards}>
          <div style={styles.courseCard}>
            <div
              style={{
                ...styles.courseImage,
                backgroundImage:
                  "url(https://thumbs.dreamstime.com/b/antique-literature-collection-old-fashioned-wisdom-preserved-generative-ai-antique-literature-collection-old-fashioned-wisdom-274867858.jpg)",
              }}
            />
            <h3 style={styles.courseTitle}>Vyakarana (Grammar)</h3>
            <p style={styles.courseDesc}>Master the intricate structure of the Sanskrit language.</p>
            <strong style={styles.courseLink}>LEARN MORE →</strong>
          </div>

          <div style={styles.courseCard}>
            <div
              style={{
                ...styles.courseImage,
                backgroundImage:
                  "url(https://tse2.mm.bing.net/th/id/OIP.aO6k2XyBjXEcWju-JEOo_QHaE7?pid=Api&P=0&h=180)",
              }}
            />
            <h3 style={styles.courseTitle}>Literature & Kavya</h3>
            <p style={styles.courseDesc}>Journey through poetic works of Kalidasa swamy and others.</p>
            <strong style={styles.courseLink}>LEARN MORE →</strong>
          </div>

          <div style={styles.courseCard}>
            <div
              style={{
                ...styles.courseImage,
                backgroundImage:
                  "url(https://i.pinimg.com/736x/aa/99/48/aa994847ffa5d9e4dbfc0fd50384cff2.jpg)",
              }}
            />
            <h3 style={styles.courseTitle}>Spoken Sanskrit</h3>
            <p style={styles.courseDesc}> Acquire modern fluency and conversational skills for daily life.</p>
            <strong style={styles.courseLink}>LEARN MORE →</strong>
          </div>
        </div>
      </section>
       

      {/* ================= OUR MISSION ================= */}
<section style={styles.missionWrapper}>
  <div style={styles.missionLeft}>
    <span style={styles.missionTag}>OUR MISSION</span>

    <h1 style={styles.missionHeading}>
      A Bridge Between <br />
      Ancient Gurukuls <br />
      and Digital Learning
    </h1>

    <p style={styles.missionParagraph}>
      Kaumudi Sanskrit Academy was founded to preserve the meticulous scholarly
      traditions of the past while making them accessible to the global
      student of today.
    </p>

    {/* ===== Mission Feature Grid ===== */}
<div style={styles.missionFeaturesGrid}>
  {/* Scholarly Heritage */}
  <div style={styles.featureBox}>
    <svg viewBox="0 0 24 24" style={styles.featureIcon}>
      <path d="M4 4h12v2H6v12H4z" />
      <path d="M8 6h12v14H8z" />
    </svg>
    <h4 style={styles.featureTitle}>Scholarly Heritage</h4>
    <p style={styles.featureDesc}>
      Preserving centuries of linguistic excellence through verified oral and
      written lineages.
    </p>
  </div>

  {/* Authentic Pedagogy */}
  <div style={styles.featureBox}>
    <svg viewBox="0 0 24 24" style={styles.featureIcon}>
      <path d="M12 3 1 9l11 6 9-4.91V17h2V9z" />
      <path d="M5 13v4c0 1.66 3.58 3 7 3s7-1.34 7-3v-4" />
    </svg>
    <h4 style={styles.featureTitle}>Authentic Pedagogy</h4>
    <p style={styles.featureDesc}>
      Traditional methods tailored for modern cognitive learning styles.
    </p>
  </div>

  {/* Global Community */}
  <div style={styles.featureBox}>
    <svg viewBox="0 0 24 24" style={styles.featureIcon}>
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm7.93 9H16.9a15.5 15.5 0 0 0-1.6-6.17A8.06 8.06 0 0 1 19.93 11ZM12 4c1.2 1.5 2.1 3.85 2.42 7H9.58C9.9 7.85 10.8 5.5 12 4Zm-3.3.83A15.5 15.5 0 0 0 7.1 11H4.07A8.06 8.06 0 0 1 8.7 4.83ZM4.07 13H7.1a15.5 15.5 0 0 0 1.6 6.17A8.06 8.06 0 0 1 4.07 13ZM12 20c-1.2-1.5-2.1-3.85-2.42-7h4.84C14.1 16.15 13.2 18.5 12 20Zm3.3-.83A15.5 15.5 0 0 0 16.9 13h3.03a8.06 8.06 0 0 1-4.63 6.17Z" />
    </svg>
    <h4 style={styles.featureTitle}>Global Community</h4>
    <p style={styles.featureDesc}>
      Connecting Sanskrit enthusiasts across 50+ countries via digital
      platforms.
    </p>
  </div>

  {/* Rich Archive */}
  <div style={styles.featureBox}>
    <svg viewBox="0 0 24 24" style={styles.featureIcon}>
      <path d="M4 4h12v14H4z" />
      <path d="M8 8h8v2H8zm0 4h8v2H8z" />
      <path d="M18 6h2v14H8v-2h10z" />
    </svg>
    <h4 style={styles.featureTitle}>Rich Archive</h4>
    <p style={styles.featureDesc}>
      Access to rare manuscripts and curated digital study materials.
    </p>
  </div>
</div>

  </div>

  <div style={styles.missionRight}>
    <div style={styles.imageFrame}>
      <img
        src="https://i.pinimg.com/1200x/19/6c/f4/196cf4706012f8407a08c0cf7db51339.jpg"
        alt="Gurukul Path"
        style={styles.missionImage}
      />
    </div>
  </div>
  
</section>
{/* ================= TAILORED LEARNING PATHS ================= */}
<section style={styles.learningWrapper}>
  <h2 style={styles.learningTitle}>Tailored Learning Paths</h2>
  <p style={styles.learningSubtitle}>
    Choose the modality that fits your lifestyle, without compromising on quality.
  </p>

  <div style={styles.learningCards}>
    {/* Online */}
    <div style={styles.onlineCard}>
      <h3 style={styles.learningCardTitle}>Online Global Academy</h3>

      <ul style={styles.learningList}>
        <li>Live interactive webinars with master scholars.</li>
        <li>Lifetime access to recorded session archives.</li>
        <li>Self-paced digital learning materials.</li>
        <li>Global peer community for collaborative study.</li>
      </ul>

      <a
  href="/courses"
  style={{
    ...styles.learningLightBtn,
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#e6dccf";
    e.currentTarget.style.transform = "translateY(-2px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#efe7e2";
    e.currentTarget.style.transform = "translateY(0)";
  }}
>
  Browse Online Courses
</a>

    </div>

    {/* Gurukul */}
    <div style={styles.gurukulCard}>
      <h3 style={styles.learningCardTitleDark}>Offline Gurukul Session</h3>

      <ul style={styles.learningListDark}>
        <li>Traditional classroom setting with direct mentorship.</li>
        <li>Weekly chanting and pronunciation workshops.</li>
        <li>Access to physical library of rare texts.</li>
        <li>Immersive cultural events and guest lectures.</li>
      </ul>

      <a
  href="/apply-gurukul"
  style={{
    ...styles.learningGoldBtn,
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#c9a84e";
    e.currentTarget.style.transform = "translateY(-2px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#d6b15c";
    e.currentTarget.style.transform = "translateY(0)";
  }}
>
  Apply for Gurukul Session
</a>

    </div>
  </div>
</section>
{/* ================= TESTIMONIALS ================= */}
<section style={styles.testimonialWrapper}>
  <span style={styles.testimonialTag}>TESTIMONIALS</span>
  <h2 style={styles.testimonialTitle}>What Our Students Say</h2>
  <p style={styles.testimonialSubtitle}>
    Real experiences from students who love our courses.
  </p>

  <div style={styles.testimonialGrid}>
    {testimonials
      .slice(testimonialIndex, testimonialIndex + 3)
      .map((item, i) => (
        <div key={i} style={styles.testimonialCard}>
          <img
            src={item.image}
            alt={item.name}
            style={styles.testimonialAvatar}
          />

          <h4 style={styles.testimonialName}>{item.name}</h4>
          <span style={styles.testimonialRole}>{item.role}</span>

          <p style={styles.testimonialText}>{item.text}</p>

          <div style={styles.testimonialStars}>
            {"★".repeat(item.rating)}
            {"☆".repeat(5 - item.rating)}
          </div>
        </div>
      ))}
  </div>
</section>



{/* ================= FOOTER ================= */}
<footer style={styles.footer}>
  <div style={styles.footerGrid}>
    <div>
      <h4 style={styles.footerTitle}>KAUMUDI</h4>
      <p style={styles.footerText}>
        Dedicated to the revival and preservation of Sanskrit scholarly traditions
        through authentic teaching methods.
      </p>
    </div>

    <div>
      <h4 style={styles.footerTitle}>Quick Links</h4>
      <a href="/courses" style={styles.footerLink}>Course Catalog</a>
      <a href="/workshops" style={styles.footerLink}>Upcoming Workshops</a>
      <a href="/research" style={styles.footerLink}>Research Papers</a>
      <a href="/faculty" style={styles.footerLink}>Academy Faculty</a>
    </div>

    <div>
      <h4 style={styles.footerTitle}>Resources</h4>
      <a href="/resources/vocabulary" style={styles.footerLink}>Free Vocabulary Lists</a>
      <a href="/resources/manuscripts" style={styles.footerLink}>Manuscript Digital Archive</a>
      <a href="/resources/tools" style={styles.footerLink}>Grammar Tools</a>
      <a href="/blog" style={styles.footerLink}>Blog & News</a>
    </div>

    <div>
      <h4 style={styles.footerTitle}>Contact Us</h4>
      <p style={styles.footerText}>
        108 Vidya Vihar, Sanskrit Marg<br />
        Varanasi, Uttar Pradesh, India
      </p>
      <a href="mailto:contact@kaumudi.edu.in" style={styles.footerLink}>
        contact@kaumudi.edu.in
      </a>
    </div>
  </div>

  <div style={styles.footerBottom}>
    © 2024 Kaumudi Sanskrit Academy. All Wisdom Reserved.
  </div>
</footer>


    </>
    
  );
  
}

/* ================= STYLES ================= */
const styles = {
  page: {
    padding: "36px",
    background: BG,
    fontFamily: FONT_DISPLAY, 
  },

  hero: {
    minHeight: "700px",
    maxWidth: "1400px",
    margin: "0 auto",
    borderRadius: "28px",
    overflow: "hidden",
    boxShadow: "0 14px 32px rgba(0,0,0,0.18)",
  },

  content: {
    padding: "76px",
    maxWidth: "650px",
    color: "#fff",
    fontFamily: FONT_SERIF,
  },

  line: {
    width: "56px",
    height: "4px",
    background: GOLD,
    marginBottom: "22px",
    fontFamily: FONT_SERIF,

  },

  heading: {
  fontSize: "75px",
  fontWeight: "800",
  lineHeight: "1.12",
  fontFamily: FONT_DISPLAY,
},

  text: {
    fontSize: "18px",
    marginTop: "32px",
    maxWidth: "520px",
    fontFamily: FONT_SERIF,
    
  },

  actions: {
    marginTop: "60px",
    display: "flex",
    gap: "18px",
    
  },

  primary: {
    background: GOLD,
    color: MAROON,
    padding: "18px 34px",
    borderRadius: "10px",
    fontWeight: 900,
    border: "none",
    cursor: "pointer",
    fontFamily: FONT_SERIF,
    fontSize: "20px",
  },

  secondary: {
    background: "rgba(255,255,255,0.18)",
    border: "1.5px solid rgba(255,255,255,0.6)",
    color: "#fff",
    padding: "18px 34px",
    borderRadius: "10px",
    cursor: "pointer",
    fontFamily: FONT_SERIF,
    fontSize: "20px",
  },

  courseScrollWrapper: {
    height: "64px",
    overflow: "hidden",
    background: "#74271E",
    display: "flex",
    alignItems: "center",
    borderTop: "1px solid #927341",
    borderBottom: "1px solid #927341",
  },

  scrollTrack: {
    display: "inline-flex",
    gap: "64px",
    whiteSpace: "nowrap",
    fontWeight: 700,
    fontStyle: "italic",
    color: "white",
    fontFamily: FONT_SERIF,
  },

  exploreSection: {
    padding: "80px",
    backgroundColor: "#f1e4c8",
  },

  exploreHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "28px",
    fontWeight: 600,
    color: "#74271E",
    marginLeft: "180px",
    fontFamily: FONT_SERIF,
    
  },

  courseCards: {
    display: "flex",
    gap: "28px",
    marginTop: "36px",
    marginLeft: "180px",
    marginRight: "160px",
  },

  courseCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "22px",
    flex: 1,
    boxShadow: "0 10px 26px rgba(0,0,0,0.08)",
    minHeight: "420px",
  },

  courseCardDark: {
    background: MAROON,
    color: "#fff",
    borderRadius: "16px",
    padding: "22px",
    flex: 1,
    boxShadow: "0 16px 32px rgba(0,0,0,0.3)",
    fontFamily: FONT_SERIF,
    
  },

  courseImage: {
    height: "170px",
    borderRadius: "12px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    marginBottom: "16px",
    minHeight: "210px",
  },

  /* ================= MISSION SECTION ================= */

missionWrapper: {
  background: "#F1e4c8",
  padding: "100px 90px",
  display: "flex",
  gap: "80px",
},

missionLeft: {
  flex: 1,
},

missionTag: {
  fontSize: "28px",
  letterSpacing: "4px",
  fontWeight: "700",
  color: "#d6b15c",
  marginLeft: "180px",
  fontFamily: FONT_SERIF,
},

missionHeading: {
  fontSize: "70px",
  lineHeight: "1.1",
  fontWeight: "900",
  color: "#74271E",
  margin: "22px 0 26px",
  marginLeft: "180px",
  fontFamily: FONT_DISPLAY,
},

missionParagraph: {
  fontSize: "22px",
  lineHeight: "1.7",
  maxWidth: "560px",
  color: "#7a4a3b",
  marginBottom: "46px",
  marginLeft: "180px",
  fontFamily: FONT_SERIF,
},

missionFeatures: {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "42px",
  maxWidth: "580px",
  marginLeft: "180px",
},

featureItem: {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
},

icon: {
  fontSize: "26px",
  color: "#641c14",
},

/* ================= IMAGE ================= */

missionRight: {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
},

imageFrame: {
  padding: "10px",
  borderRadius: "28px",
  background: "#e6d6b8",
},

missionImage: {
  width: "100%",
  maxWidth: "520px",
  height: "auto",
  borderRadius: "22px",
  display: "block",
},

  courseTitle: {
  fontSize: "28px",
  fontWeight: "700",
  color: "#74271E",
  marginBottom: "10px",
  fontFamily: FONT_SERIF,
},

courseDesc: {
  fontSize: "19px",
  lineHeight: "1.6",
  color: "#74271E",
  marginBottom: "22px",
  fontFamily: FONT_SERIF,
},

courseLink: {
  fontSize: "16px",
  fontWeight: "900",
  letterSpacing: "0.5px",
  color: "#74271E",
  cursor: "pointer",
  textTransform: "uppercase",
  fontFamily: FONT_SERIF,
},
missionFeaturesGrid: {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "56px 80px",
  maxWidth: "760px",
  marginLeft: "180px",
  marginTop: "10px",
},

featureBox: {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
},

featureIcon: {
  width: "36px",
  height: "36px",
  fill: "#74271E",   // exact maroon from image
},

featureTitle: {
  fontSize: "24px",
  fontWeight: "800",
  color: "#74271E",
  fontFamily: FONT_SERIF,
},

featureDesc: {
  fontSize: "17px",
  lineHeight: "1.7",
  color: "#8a5f52",
  maxWidth: "330px",
  fontFamily: FONT_SERIF,
},
/* ================= LEARNING PATHS ================= */

learningWrapper: {
  padding: "120px 90px",
  background: "#f1e4c8",
  textAlign: "center",
},

learningTitle: {
  fontSize: "50px",
  fontWeight: "900",
  color: "#74271E",
  fontFamily: FONT_SERIF,
},

learningSubtitle: {
  fontSize: "18px",
  color: "#7b5a4c",
  marginTop: "8px",
  fontFamily: FONT_SERIF,
  marginBottom: "60px",
},

learningCards: {
  display: "flex",
  justifyContent: "center",
  gap: "40px",
  
},

onlineCard: {
  background: "#ffffff",
  padding: "36px",
  width: "420px",
  borderRadius: "16px",
  textAlign: "left",
  boxShadow: "0 18px 40px rgba(59, 54, 54, 0.42)",
  minHeight: "500px",
},

gurukulCard: {
  background: "#74271E",
  padding: "36px",
  width: "420px",
  borderRadius: "16px",
  textAlign: "left",
  boxShadow: "0 18px 40px rgba(59, 54, 54, 0.42)",
},

learningCardTitle: {
  fontSize: "27px",
  fontWeight: "800",
  color: "#74271E",
  marginBottom: "16px",
  marginTop: "20px",
  fontFamily: FONT_SERIF,
  
},

learningCardTitleDark: {
  fontSize: "27px",
  fontWeight: "800",
  color: "#d6b15c",
  marginBottom: "16px",
  marginTop: "20px",
  fontFamily: FONT_SERIF,
},

learningList: {
  paddingLeft: "18px",
  lineHeight: "1.8",
  color: "#6f4d40",
  marginTop: "50px",
  fontFamily: FONT_SERIF,
  fontSize: "18px",
},

learningListDark: {
  paddingLeft: "18px",
  lineHeight: "1.8",fontSize: "18px",
  color: "#f5e9d1",
  marginTop: "50px",
  fontFamily: FONT_SERIF,
  fontSize: "18px",
},

learningLightBtn: {
  display: "block",
  marginTop: "50px",
  width: "100%",
  padding: "15px",
  borderRadius: "8px",
  background: "#efe7e2",
  color: "#74271E",
  fontWeight: "700",
  textAlign: "center",
  textDecoration: "none",
  cursor: "pointer",
  transition: "all 0.25s ease",   // 👈 ADD
  fontFamily: FONT_SERIF,
  fontSize: "18px",
},

learningGoldBtn: {
  display: "block",
  marginTop: "50px",
  width: "100%",
  padding: "15px",
  borderRadius: "8px",
  background: "#d6b15c",
  color: "#74271E",
  fontWeight: "800",
  textAlign: "center",
  textDecoration: "none",
  cursor: "pointer",
  transition: "all 0.25s ease",
  fontFamily: FONT_SERIF,
  fontSize: "18px",
},

/* ================= FOOTER ================= */

footer: {
  background: "#74271E",
  padding: "80px 90px 40px",
  color: "#f4e9dc",
  fontFamily: FONT_SERIF,
},

footerGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "50px",
  marginBottom: "40px",
},

footerTitle: {
  color: "#d6b15c",
  fontWeight: "900",
  marginBottom: "14px",
  fontSize: "24px",
  fontFamily: FONT_SERIF,
},

footerText: {
  fontSize: "16px",
  lineHeight: "1.7",
  color: "#e6d0bd",
  fontFamily: FONT_SERIF,
},

footerLink: {
  display: "block",
  fontSize: "16px",
  lineHeight: "1.9",
  color: "#e6d0bd",
  textDecoration: "none",
  cursor: "pointer",
  fontFamily: FONT_SERIF,
},

footerBottom: {
  borderTop: "1px solid rgba(255,255,255,0.2)",
  paddingTop: "20px",
  fontSize: "15px",
  textAlign: "center",
  color: "#d2b9a5",
  fontFamily: FONT_SERIF,
},
/* ================= TESTIMONIALS ================= */

testimonialWrapper: {
  padding: "120px 90px",
  background: "#F1e4c8",
  textAlign: "center",
},

testimonialTag: {
  fontSize: "13px",
  letterSpacing: "3px",
  color: "#d6b15c",
  fontWeight: "700",
  fontFamily: FONT_SERIF,
},

testimonialTitle: {
  fontSize: "46px",
  fontWeight: "900",
  color: "#74271E",
  marginTop: "12px",
  fontFamily: FONT_DISPLAY,
},

testimonialSubtitle: {
  fontSize: "16px",
  color: "#74271E",
  marginTop: "10px",
  marginBottom: "70px",
  fontFamily: FONT_SERIF,
},

testimonialGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "40px",
  maxWidth: "1200px",
  margin: "0 auto",
},

testimonialCard: {
  background: "#f4efdf",
  borderRadius: "18px",
  padding: "50px 36px",
  boxShadow: "0 14px 34px rgba(0,0,0,0.15)",
  height: "500px",
},

testimonialAvatar: {
  width: "90px",
  height: "90px",
  borderRadius: "50%",
  objectFit: "cover",
  marginBottom: "20px",
  marginTop: "30px",
},

testimonialName: {
  fontSize: "20px",
  fontWeight: "800",
  color: "#74271E",
  marginTop: "50px",
  fontFamily: FONT_SERIF,
},

testimonialRole: {
  fontSize: "14px",
  color: "#6f6f6f",
  display: "block",
  marginBottom: "18px",
  fontFamily: FONT_SERIF,
},

testimonialText: {
  fontSize: "15px",
  lineHeight: "1.8",
  color: "#4b4b4b",
  marginBottom: "26px",
  fontFamily: FONT_SERIF,
},

testimonialStars: {
  fontSize: "20px",
  color: "#f03e12",
  
},
text: {
  fontSize: "18px",
  marginTop: "32px",
  maxWidth: "520px",
  fontFamily: FONT_SERIF,
},

};
