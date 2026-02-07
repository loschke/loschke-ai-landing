import { useState } from "react";
import { Reveal } from "@components/ui/Reveal";

/* ─── Types ─── */
interface Article {
  slug: string;
  title: string;
  excerpt?: string;
  category: string;
  categoryLabel: string;
  categoryIcon: string;
  readTime?: string;
  featured: boolean;
  tags: string[];
  hasAudio: boolean;
  pubDate?: string;
}

/* ─── Quarter Helper ─── */
function formatQuarter(isoDate?: string): string | null {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  const quarter = Math.ceil((date.getMonth() + 1) / 3);
  return `Q${quarter} ${date.getFullYear()}`;
}

interface BlogContentProps {
  articles: Article[];
}

/* ─── Category definitions ─── */
const categories = [
  { id: "all", icon: "✦", label: "Alle" },
  { id: "vision", icon: "◎", label: "Visionen" },
  { id: "takes", icon: "◆", label: "Takes" },
  { id: "experiments", icon: "▲", label: "Experimente" },
  { id: "building", icon: "◻", label: "Building" },
  { id: "personal", icon: "●", label: "Persönlich" },
];

/* ─── Category Filter Pill ─── */
function CategoryPill({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium border cursor-pointer font-sans transition-all duration-250 ${
        active
          ? "bg-dark text-white border-dark"
          : "bg-transparent text-dark border-[#e5e5e5] hover:bg-[#f5f5f5]"
      }`}
    >
      <span
        className={`text-[10px] transition-colors duration-250 ${
          active ? "text-accent" : "text-[#a3a3a3]"
        }`}
      >
        {icon}
      </span>
      {label}
    </button>
  );
}

/* ─── Audio Indicator ─── */
function AudioIndicator() {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#737373] group-hover:text-accent transition-colors duration-250"
      title="Audio-Zusammenfassung verfügbar"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="text-current"
      >
        <circle
          cx="7"
          cy="7"
          r="6"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <path d="M5.5 4.5L10 7L5.5 9.5V4.5Z" fill="currentColor" />
      </svg>
      Audio
    </span>
  );
}

/* ─── Tag Pill ─── */
function TagPill({ label }: { label: string }) {
  return (
    <span className="inline-block px-2.5 py-1 text-[11px] font-medium text-[#737373] bg-[#f5f5f5] group-hover:bg-[#ebebeb] transition-colors duration-250">
      {label}
    </span>
  );
}

/* ─── Featured Article Card ─── */
function FeaturedCard({ article }: { article: Article }) {
  const quarter = formatQuarter(article.pubDate);
  return (
    <Reveal>
      <a
        href={`/blog/${article.slug}`}
        className="block group py-10 md:py-14 border-t-2 border-accent transition-[padding] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:pl-4"
      >
        {/* Category + Quarter + Audio */}
        <div className="flex flex-wrap gap-3 items-center mb-5">
          <span className="text-[10px] text-accent tracking-[0.05em]">
            {article.categoryIcon}
          </span>
          <span className="text-[11px] font-medium text-accent tracking-[0.02em] uppercase">
            Featured
          </span>
          {quarter && (
            <>
              <span className="text-[11px] text-[#d4d4d4]">·</span>
              <span className="text-[11px] text-[#a3a3a3]">{quarter}</span>
            </>
          )}
          {article.hasAudio && (
            <>
              <span className="text-[11px] text-[#d4d4d4]">·</span>
              <AudioIndicator />
            </>
          )}
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl md:text-[clamp(34px,4.5vw,52px)] font-black tracking-[-0.025em] leading-[1.05] mb-5 max-w-[720px] transition-colors duration-300 group-hover:text-accent">
          {article.title}
        </h2>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-base sm:text-lg font-light leading-[1.75] text-[#525252] max-w-[600px] mb-6">
            {article.excerpt}
          </p>
        )}

        {/* Tags + Read Time */}
        <div className="flex flex-wrap items-center gap-2">
          {article.tags.slice(0, 3).map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
          {article.readTime && (
            <>
              <span className="text-[11px] text-[#d4d4d4] mx-1">·</span>
              <span className="text-[11px] text-[#a3a3a3]">
                {article.readTime} Lesezeit
              </span>
            </>
          )}
        </div>
      </a>
    </Reveal>
  );
}

/* ─── Regular Article Card ─── */
function ArticleCard({
  article,
  delay = 0,
}: {
  article: Article;
  delay?: number;
}) {
  const quarter = formatQuarter(article.pubDate);
  return (
    <Reveal delay={delay}>
      <a
        href={`/blog/${article.slug}`}
        className="block group py-8 md:py-10 border-t border-[#e5e5e5] transition-[padding] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:pl-3"
      >
        {/* Category + Quarter + Audio Row */}
        <div className="flex flex-wrap gap-2 items-center mb-3">
          <span className="text-xs text-accent">
            {article.categoryIcon}
          </span>
          <span className="text-xs sm:text-sm font-medium text-[#a3a3a3] tracking-[0.02em]">
            {article.categoryLabel}
          </span>
          {quarter && (
            <>
              <span className="text-[11px] text-[#d4d4d4]">·</span>
              <span className="text-[11px] text-[#a3a3a3]">{quarter}</span>
            </>
          )}
          {article.hasAudio && (
            <>
              <span className="text-[11px] text-[#d4d4d4]">·</span>
              <AudioIndicator />
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl md:text-[clamp(22px,3vw,28px)] font-black tracking-[-0.015em] leading-[1.1] mb-3 max-w-[680px] transition-colors duration-300 group-hover:text-accent">
          {article.title}
        </h3>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-base sm:text-lg font-light leading-[1.75] text-[#525252] max-w-full md:max-w-[560px] mb-4">
            {article.excerpt}
          </p>
        )}

        {/* Tags + Read Time */}
        <div className="flex flex-wrap items-center gap-2">
          {article.tags.slice(0, 3).map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
          {article.readTime && (
            <>
              {article.tags.length > 0 && (
                <span className="text-[11px] text-[#d4d4d4] mx-1">·</span>
              )}
              <span className="text-[11px] text-[#a3a3a3]">
                {article.readTime}
              </span>
            </>
          )}
        </div>
      </a>
    </Reveal>
  );
}

/* ─── Main Blog Content Component ─── */
export function BlogContent({ articles }: BlogContentProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredArticles =
    activeCategory === "all"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  const featuredArticle = filteredArticles.find((a) => a.featured);
  const regularArticles = filteredArticles.filter((a) => !a.featured);

  return (
    <div id="artikel">
      {/* ═══ ARTICLES SECTION ═══ */}
      <section className="py-8 md:py-12 lg:py-16 px-6 sm:px-10 md:px-16 lg:px-20 border-t border-[#e5e5e5]">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(100px,240px)_1fr] gap-6 md:gap-12 lg:gap-15 items-start">
          {/* Label: hidden on mobile, visible on md+ */}
          <Reveal>
            <p className="hidden md:block text-xs sm:text-sm font-medium text-[#737373] tracking-[0.08em] uppercase md:sticky md:top-[98px]">
              {filteredArticles.length}{" "}
              {filteredArticles.length === 1 ? "Artikel" : "Artikel"}
            </p>
          </Reveal>
          <div>
            {/* ═══ CATEGORY FILTER — aligned with articles column ═══ */}
            <div className="flex flex-wrap gap-2 pb-8 md:pb-10">
              {categories.map((cat) => (
                <CategoryPill
                  key={cat.id}
                  icon={cat.icon}
                  label={cat.label}
                  active={activeCategory === cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                />
              ))}
            </div>

            {/* Featured first */}
            {featuredArticle && <FeaturedCard article={featuredArticle} />}

            {/* Regular articles */}
            {regularArticles.map((article, i) => (
              <ArticleCard
                key={article.slug}
                article={article}
                delay={i * 0.06}
              />
            ))}

            {/* Bottom border */}
            {(regularArticles.length > 0 || featuredArticle) && (
              <div className="border-t border-[#e5e5e5]" />
            )}

            {/* Empty state */}
            {regularArticles.length === 0 && !featuredArticle && (
              <Reveal>
                <div className="py-16 text-center">
                  <p className="text-base sm:text-lg font-light text-[#a3a3a3]">
                    Keine Artikel in dieser Kategorie.
                  </p>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
