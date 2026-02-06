import { useState, useEffect } from "react";

interface TocItem {
  id: string;
  label: string;
  level: number; // 1 = h2, 2 = h3
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = items
        .map((item) => document.getElementById(item.id))
        .filter(Boolean);

      let current = "";
      for (const section of sections) {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 150) {
            current = section.id;
          }
        }
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav>
      <p className="text-[11px] font-medium text-[#a3a3a3] tracking-[0.1em] uppercase mb-4">
        Inhalt
      </p>
      <div className="space-y-0">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block py-2 text-[13px] no-underline transition-colors duration-200 ${
              item.level === 2
                ? "pl-4 text-[12px] border-l border-[#e5e5e5]"
                : "pl-0"
            } ${
              activeId === item.id
                ? "font-medium text-accent"
                : "font-normal text-[#737373] hover:text-dark"
            }`}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
