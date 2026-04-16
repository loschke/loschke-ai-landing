import { renderTokens, type PromptToken } from "./promptTokens";

interface ExampleImage {
  src: string;
  alt: string;
  caption: PromptToken[];
}

interface PromptExampleProps {
  /** Optional: Headline über dem Block */
  question?: string;
  /** Promptformel mit farbigen Tokens */
  formula: PromptToken[];
  /** Bilder mit Token-Captions */
  images: ExampleImage[];
}

// PromptToken Re-Export für bequemen Import in .astro
export type { PromptToken } from "./promptTokens";

export function PromptExample({
  question,
  formula,
  images,
}: PromptExampleProps) {
  return (
    <div className="my-8 border border-[#e5e5e5] bg-white rounded-[4px] overflow-hidden">
      <div className="p-5 sm:p-7">
        {question && (
          <p className="text-lg sm:text-xl font-medium text-dark leading-[1.35] mb-5">
            {question}
          </p>
        )}

        {/* Code-Block: Formel mit farbigen Tokens auf dark bg */}
        <div className="my-2 px-5 py-4 bg-[#151416] rounded-[4px] overflow-x-auto font-mono text-[0.85em] sm:text-[0.9em] leading-[1.7]">
          <p>
            <span className="text-[#737373] mr-3 select-none">Formel</span>
            {renderTokens(formula, true)}
          </p>
        </div>

        {/* Bildgrid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {images.map((img) => (
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
