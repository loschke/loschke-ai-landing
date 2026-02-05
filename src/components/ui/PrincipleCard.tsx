import { useState, type ReactNode } from "react";
import { Reveal } from "./Reveal";

interface PrincipleCardProps {
  num: string;
  title: string;
  core: string;
  children: ReactNode;
  delay?: number;
}

export function PrincipleCard({
  num,
  title,
  core,
  children,
  delay = 0,
}: PrincipleCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Reveal delay={delay}>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="py-10 md:py-12 border-t border-[#e5e5e5] cursor-default transition-all duration-400 ease-out"
        style={{
          paddingLeft: isHovered ? "12px" : "0",
        }}
      >
        <div className="flex gap-4 md:gap-6 items-baseline">
          {/* Number - prominent, always accent colored */}
          <span
            className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[-0.02em] flex-shrink-0 w-12 md:w-16 text-accent transition-transform duration-300"
            style={{
              transform: isHovered ? "scale(1.1)" : "scale(1)",
            }}
          >
            {num}
          </span>

          {/* Content */}
          <div className="flex-1 max-w-[640px]">
            {/* Title */}
            <h3
              className="text-2xl sm:text-3xl md:text-[clamp(24px,3vw,32px)] font-black tracking-[-0.02em] leading-[1.1] mb-2 transition-colors duration-300"
              style={{
                color: isHovered ? "#FC2D01" : "#151416",
              }}
            >
              {title}
            </h3>

            {/* Core Statement */}
            <p className="text-sm font-medium text-accent mb-4 tracking-[0.01em]">
              {core}
            </p>

            {/* Description */}
            <div className="text-base sm:text-[17px] font-light leading-[1.7] text-[#525252]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
