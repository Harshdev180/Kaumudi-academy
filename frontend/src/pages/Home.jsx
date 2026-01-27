import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import heroImg from "../assets/img.jpg";

/* ================= THEME COLORS ================= */
const BG = "#f2f1ee";
const MAROON = "#74271E";
const GOLD = "#d6b15c";

export default function Home() {
  const [hoverPrimary, setHoverPrimary] = useState(false);
  const [hoverSecondary, setHoverSecondary] = useState(false);
  const scrollRef = useRef(null);

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
              of <span style={{ color: GOLD }}>Sanskrit</span>
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
          <span>‹ ›</span>
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
            <p style={styles.courseDesc}>Journey through poetic works of Kalidasa and others.</p>
            <strong style={styles.courseLink}>LEARN MORE →</strong>
          </div>

          <div style={styles.courseCard}>
            <div
              style={{
                ...styles.courseImage,
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d)",
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

    <div style={styles.missionFeatures}>
      <div style={styles.featureItem}>
        <div style={styles.icon}>📜</div>
        <h4>Scholarly Heritage</h4>
        <p>
          Preserving centuries of linguistic excellence through verified
          oral and written lineages.
        </p>
      </div>

      <div style={styles.featureItem}>
        <div style={styles.icon}>🎓</div>
        <h4>Authentic Pedagogy</h4>
        <p>
          Traditional methods tailored for modern cognitive learning styles.
        </p>
      </div>
    </div>
  </div>

  <div style={styles.missionRight}>
    <div style={styles.imageFrame}>
      <img
        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
        alt="Gurukul Path"
        style={styles.missionImage}
      />
    </div>
  </div>
</section>

    </>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    padding: "36px",
    background: BG,
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
  },

  line: {
    width: "56px",
    height: "4px",
    background: GOLD,
    marginBottom: "22px",
  },

  heading: {
    fontSize: "88px",
    fontWeight: "800",
    lineHeight: "1.12",
  },

  text: {
    fontSize: "18px",
    marginTop: "32px",
    maxWidth: "520px",
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
  },

  secondary: {
    background: "rgba(255,255,255,0.18)",
    border: "1.5px solid rgba(255,255,255,0.6)",
    color: "#fff",
    padding: "18px 34px",
    borderRadius: "10px",
    cursor: "pointer",
  },

  courseScrollWrapper: {
    height: "64px",
    overflow: "hidden",
    background: "#f3f0e7",
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
    color: "#785c54",
  },

  exploreSection: {
    padding: "80px",
    backgroundColor: "#f2f1ee",
  },

  exploreHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "28px",
    fontWeight: 600,
    color: "#74271E",
    marginLeft: "180px",
    
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
  background: "#F5EFE6",
  padding: "100px 90px",
  display: "flex",
  gap: "80px",
},

missionLeft: {
  flex: 1,
},

missionTag: {
  fontSize: "24px",
  letterSpacing: "4px",
  fontWeight: "700",
  color: "#d6b15c",
  marginLeft: "180px",
},

missionHeading: {
  fontSize: "70px",
  lineHeight: "1.1",
  fontWeight: "900",
  color: "#74271E",
  margin: "22px 0 26px",
  marginLeft: "180px",
  
},

missionParagraph: {
  fontSize: "25px",
  lineHeight: "1.7",
  maxWidth: "560px",
  color: "#7a4a3b",
  marginBottom: "46px",
  marginLeft: "180px",
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
  fontSize: "25px",
  fontWeight: "700",
  color: "#74271E",
  marginBottom: "10px",
},

courseDesc: {
  fontSize: "18px",
  lineHeight: "1.6",
  color: "#74271E",
  marginBottom: "22px",
},

courseLink: {
  fontSize: "13px",
  fontWeight: "900",
  letterSpacing: "0.5px",
  color: "#74271E",
  cursor: "pointer",
  textTransform: "uppercase",
},
};
