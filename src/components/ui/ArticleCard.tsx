import { Reveal } from "./Reveal";

interface ArticleCardProps {
  date: string;
  title: string;
  desc: string;
  href?: string;
  delay?: number;
}

export function ArticleCard({ date, title, desc, href = "#", delay = 0 }: ArticleCardProps) {
  return (
    <Reveal delay={delay}>
      <a
        href={href}
        className="block group py-6 border-t border-[#e5e5e5] transition-[padding] duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] hover:pl-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 mb-1.5">
          <time className="text-xs sm:text-sm text-[#737373] font-medium shrink-0">
            {date}
          </time>
          <h3 className="text-base sm:text-lg font-black tracking-[-0.01em] transition-colors duration-250 m-0 group-hover:text-accent">
            {title}
          </h3>
        </div>
        <p className="text-base sm:text-lg font-light leading-[1.75] text-[#525252] max-w-full md:max-w-[560px]">
          {desc}
        </p>
      </a>
    </Reveal>
  );
}
