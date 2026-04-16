import { useState } from "react";
import { renderTokens, type PromptToken } from "./promptTokens";

interface TabImage {
  src: string;
  alt: string;
  caption: PromptToken[];
}

interface Tab {
  id: string;
  label: string;
  /** Frage-Headline */
  question: string;
  /** Promptformel mit farbigen Token-Platzhaltern */
  formula: PromptToken[];
  /** Referenzbild (Tokens) */
  reference: PromptToken[];
  /** 4 Beispielbilder mit Token-Captions */
  images: TabImage[];
}

interface FrameworkTabsProps {
  tabs: Tab[];
}

// PromptToken type re-export für bequemen Import in .astro
export type { PromptToken } from "./promptTokens";

export function FrameworkTabs({ tabs }: FrameworkTabsProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  if (!active) return null;

  return (
    <div className="my-8 border border-[#e5e5e5] bg-white rounded-[4px] overflow-hidden">
      {/* Tab Bar — sitzt am Container-Top */}
      <div
        role="tablist"
        aria-label="Vier Dimensionen des 4K Frameworks"
        className="flex flex-wrap gap-x-1 border-b border-[#e5e5e5] px-2 sm:px-3 bg-[#fafafa]"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => setActiveId(tab.id)}
              className={`px-3 sm:px-4 py-3 text-sm font-medium tracking-[0.01em] transition-colors duration-200 border-b-2 -mb-[1px] cursor-pointer ${
                isActive
                  ? "text-accent border-accent bg-white"
                  : "text-[#737373] border-transparent hover:text-dark"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active Panel */}
      <div
        role="tabpanel"
        id={`tabpanel-${active.id}`}
        aria-labelledby={`tab-${active.id}`}
        className="p-5 sm:p-7"
      >
        {/* Frage als Headline */}
        <p className="text-lg sm:text-xl font-medium text-dark leading-[1.35] mb-5">
          {active.question}
        </p>

        {/* Code-Block: Formel + Beispiel zusammen, farbige Tokens auf dark bg */}
        <div className="my-2 px-5 py-4 bg-[#151416] rounded-[4px] overflow-x-auto font-mono text-[0.85em] sm:text-[0.9em] leading-[1.7]">
          <p>
            <span className="text-[#737373] mr-3 select-none">Formel</span>
            {renderTokens(active.formula, true)}
          </p>
          <p>
            <span className="text-[#737373] mr-3 select-none">Beispiel</span>
            {renderTokens(active.reference, true)}
          </p>
        </div>

        {/* Bildgrid (2 Spalten mobile, 4 ab md) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {active.images.map((img) => (
            <figure key={img.src} className="m-0 flex flex-col">
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-auto block rounded-[3px] aspect-square object-cover"
              />
              <figcaption className="mt-2 font-mono text-[0.72em] leading-[1.45]">
                {renderTokens(img.caption)}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
