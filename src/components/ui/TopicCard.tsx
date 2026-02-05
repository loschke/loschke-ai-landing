import { useState, type ReactNode } from "react";
import { Reveal } from "./Reveal";

interface TopicCardProps {
  num: string;
  level: string;
  title: string;
  children: ReactNode;
  forWhom: string;
  formats: string;
  delay?: number;
}

export function TopicCard({
  num,
  level,
  title,
  children,
  forWhom,
  formats,
  delay = 0,
}: TopicCardProps) {
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
        {/* Level - full width above */}
        <p className="text-xs sm:text-sm font-medium text-[#737373] tracking-[0.08em] uppercase mb-3">
          {level}
        </p>

        <div className="flex gap-4 md:gap-6 items-start">
          {/* Number - aligned with title */}
          <span
            className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[-0.02em] flex-shrink-0 w-12 md:w-16 text-accent transition-transform duration-300 leading-[1.1]"
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
              className="text-xl sm:text-2xl md:text-[clamp(24px,3vw,32px)] font-black tracking-[-0.02em] leading-[1.1] mb-3 transition-colors duration-300"
              style={{
                color: isHovered ? "#FC2D01" : "#151416",
              }}
            >
              {title}
            </h3>

            {/* Description */}
            <div className="text-base sm:text-[17px] font-light leading-[1.7] text-[#525252] mb-4">
              {children}
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <p className="text-[#737373]">
                <span className="font-medium text-dark">Für:</span> {forWhom}
              </p>
              <p className="text-[#737373]">
                <span className="font-medium text-dark">Format:</span> {formats}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
