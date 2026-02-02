import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export default function Typewriter({
  text,
  speed = 60, // ms per character
  className = "",
  startDelay = 500, // ms
  onComplete,
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayIndex, setDisplayIndex] = useState(0);

  useEffect(() => {
    // Reset if text changes
    count.set(0);
    setDisplayIndex(0);

    const controls = animate(count, text.length, {
      type: "tween",
      duration: (text.length * speed) / 1000,
      ease: "linear",
      delay: startDelay / 1000,
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });

    const unsubscribe = rounded.on("change", (v) => {
      setDisplayIndex(v);
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [text, speed, startDelay, onComplete, count, rounded]);

  return (
    <span className={className}>
      {text.slice(0, displayIndex)}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        className="inline-block ml-[1px] text-[#d6b15c]"
      >
        |
      </motion.span>
    </span>
  );
}
