import type { ReactNode } from "react";

interface AvatarIntroProps {
  className?: string;
}

export function AvatarIntro({ className = "" }: AvatarIntroProps) {
  return (
    <a 
      href="/" 
      className={`flex items-center gap-3 no-underline text-dark hover:text-accent transition-colors duration-250 ${className}`}
    >
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
         <img 
            src="/signet-loschke-highlight.png" 
            alt="Rico Loschke" 
            className="w-full h-full object-cover" 
         />
      </div>
      <span className="font-sans font-bold text-lg tracking-tight">
        Hi, ich bin Rico
      </span>
    </a>
  );
}
