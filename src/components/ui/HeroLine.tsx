import { useState, useEffect, type ReactNode } from "react";

interface HeroLineProps {
  children: ReactNode;
  delay?: number;
}

export function HeroLine({ children, delay = 0 }: HeroLineProps) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <span style={{ display: "block", overflow: "hidden", paddingBottom: "0.1em" }}>
      <span
        style={{
          display: "block",
          opacity: vis ? 1 : 0,
          transform: vis ? "translateY(0)" : "translateY(100%)",
          transition: "opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {children}
      </span>
    </span>
  );
}
