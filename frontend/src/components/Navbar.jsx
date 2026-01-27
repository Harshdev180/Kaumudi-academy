import { useState } from "react";

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
        {["Courses", "Research", "About Us", "Resources", "Contact"].map(
          (item) => (
            <li
              key={item}
              style={{
                ...styles.menuItem,
                color:
                  hoveredItem === item ? "#4d261c" : styles.menuItem.color,
                borderBottom:
                  hoveredItem === item
                    ? "2px solid #6b3a2e"
                    : "2px solid transparent",
              }}
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {item}
            </li>
          )
        )}
      </ul>

      {/* BUTTON */}
      <button
        style={{
          ...styles.btn,
          background: btnHover ? "#4d261c" : styles.btn.background,
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
    background: "white",
    borderBottom: "1px solid #e6dccf",
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#74271E",
  },

  icon: {
    background: "#74271E",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "18px",
  },

  title: {
    fontWeight: "900",
    letterSpacing: "1px",
    fontSize: "25px",
  },

  subtitle: {
    fontSize: "11px",
    letterSpacing: "1.5px",
  },

  menu: {
    display: "flex",
    gap: "60px",
    listStyle: "none",
    fontSize: "16px",
    fontWeight: "900",
  },

  menuItem: {
    cursor: "pointer",
    color: "#6b3a2e",
    paddingBottom: "6px",
    transition: "all 0.2s ease",
  },

  btn: {
    background: "#74271E",
    color: "#fff",
    border: "none",
    padding: "13px 25px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "18px",
    transition: "all 0.2s ease",
  },
};
