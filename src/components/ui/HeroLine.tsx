import { useState, useEffect, type ReactNode } from "react";

interface HeroLineProps {
  children: ReactNode;
  delay?: number;
}

export function HeroLine({ children, delay = 0 }: HeroLineProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const t = setTimeout(() => setVis(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  // Server-side (SSR) and before hydration: content is fully visible for crawlers
  // Client-side after hydration: animate in via timer
  const isVisible = !isMounted || vis;

  return (
    <span style={{ display: "block", overflow: "hidden", paddingBottom: "0.1em" }}>
      <span
        style={{
          display: "block",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(100%)",
          transition: isMounted
            ? "opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)"
            : "none",
        }}
      >
        {children}
      </span>
    </span>
  );
}
