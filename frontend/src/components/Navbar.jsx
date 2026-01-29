import { useState } from "react";
import { motion } from "framer-motion";

const FONT_DISPLAY = "'Lexend', sans-serif";
const FONT_SERIF = "'Crimson Pro', serif";

export default function Navbar() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [btnHover, setBtnHover] = useState(false);

  return (
    <nav style={styles.nav}>
      {/* LEFT LOGO */}
      <div style={styles.left}>
        <div style={styles.icon}>🪔</div>
        <div>
          <div style={styles.title}>KAUMUDI</div>
          <div style={styles.subtitle}>SANSKRIT ACADEMY</div>
        </div>
      </div>

      {/* MENU */}
      <ul style={styles.menu}>
        {["Courses", "Home", "About Us", "Resources", "Contact"].map((item) => (
          <li
            key={item}
            style={{
              ...styles.menuItem,
              color: hoveredItem === item ? "#c9a84e" : styles.menuItem.color,
            }}
            onMouseEnter={() => setHoveredItem(item)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {item}

            {/* FRAMER MOTION UNDERLINE */}
            <motion.div
              style={styles.activeBar}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: hoveredItem === item ? 1 : 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              transformOrigin="center"
            />
          </li>
        ))}
      </ul>

      {/* BUTTON */}
      <button
        style={{
          ...styles.btn,
          background: btnHover ? "#c9a84e" : styles.btn.background,
          transform: btnHover ? "translateY(-1px)" : "translateY(0)",
        }}
        onMouseEnter={() => setBtnHover(true)}
        onMouseLeave={() => setBtnHover(false)}
      >
        Student Portal
      </button>
    </nav>
  );
}

/* ================= STYLES ================= */

const styles = {
  nav: {
    height: "80px",
    padding: "0 260px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#74271E",
    borderBottom: "1px solid #dccbb4",
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#c9a84e",
  },

  icon: {
    background: "#c9a84e",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "18px",
  },

  title: {
    fontWeight: "900",
    letterSpacing: "1px",
    fontSize: "25px",
    fontfamily: FONT_SERIF,
  },

  subtitle: {
    fontSize: "13px",
    letterSpacing: "1.5px",
    fontfamily: FONT_SERIF,
  },

  menu: {
    display: "flex",
    gap: "60px",
    listStyle: "none",
    fontWeight: "900",
  },

  menuItem: {
    position: "relative",
    cursor: "pointer",
    color: "#e6d0bd",
    paddingBottom: "8px",
    fontfamily: FONT_SERIF,
    fontSize: "15px",
    textDecoration: "none",
  },

  activeBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: "-6px",
    height: "2px",
    backgroundColor: "#c9a84e",
    borderRadius: "2px",
  },

  btn: {
    background: "#c9a84e",
    color: "#74271E",
    border: "none",
    padding: "13px 25px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "18px",
    transition: "all 0.2s ease",
    fontfamily: FONT_SERIF,
  },
};
