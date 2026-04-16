import type { ReactNode } from "react";

export type TokenType =
  | "medium"
  | "subject"
  | "action"
  | "place"
  | "composition"
  | "creative"
  | "neutral";

export interface PromptToken {
  text: string;
  type: TokenType;
}

// Farben für hellen Hintergrund (Captions unter Bildern)
export const COLOR_LIGHT: Record<TokenType, string> = {
  medium: "text-[#DC2626]",
  subject: "text-[#0F766E]",
  action: "text-[#2563EB]",
  place: "text-[#DB2777]",
  composition: "text-[#D97706]",
  creative: "text-[#9333EA]",
  neutral: "text-[#525252]",
};

// Farben für dunklen Hintergrund (Code-Blocks)
export const COLOR_DARK: Record<TokenType, string> = {
  medium: "text-[#FB7185]",
  subject: "text-[#5EEAD4]",
  action: "text-[#60A5FA]",
  place: "text-[#F472B6]",
  composition: "text-[#FBBF24]",
  creative: "text-[#C084FC]",
  neutral: "text-[#D4D4D4]",
};

export function renderTokens(
  tokens: PromptToken[],
  onDark = false
): ReactNode {
  const map = onDark ? COLOR_DARK : COLOR_LIGHT;
  return tokens.map((tok, i) => (
    <span key={i} className={map[tok.type]}>
      {tok.text}
    </span>
  ));
}
