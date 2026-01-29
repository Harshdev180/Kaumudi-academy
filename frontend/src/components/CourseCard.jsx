import { useNavigate } from "react-router-dom";

export default function CourseCard({ title, desc }) {
  const navigate = useNavigate();

  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <p>{desc}</p>

      <button style={styles.link} onClick={() => navigate("/coursedetail")}>
        Learn More →
      </button>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "left",
  },
  link: {
    display: "inline-block",
    marginTop: "10px",
    color: "#6b3a2e",
    fontWeight: "bold",
  },
};
