import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export default function Typewriter({
  text,
  speed = 60,
  className = "",
  startDelay = 500,
  onComplete,
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayIndex, setDisplayIndex] = useState(0);

  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;

    hasStarted.current = true;

    count.set(0);
    setDisplayIndex(0);

    const controls = animate(count, text.length, {
      type: "tween",
      duration: (text.length * speed) / 1000,
      ease: "linear",
      delay: startDelay / 1000,
      onComplete: () => {
        onComplete?.();
      },
    });

    const unsubscribe = rounded.on("change", (v) => {
      setDisplayIndex(v);
    });

    return () => {
      // ✅ reset so second StrictMode mount can run
      hasStarted.current = false;
      controls.stop();
      unsubscribe();
    };
  }, []);

  return <span className={className}>{text.slice(0, displayIndex)}</span>;
}
