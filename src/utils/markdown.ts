/**
 * Lightweight Markdown-to-HTML renderer for the Summary field.
 * Supports: **bold**, *italic*, [links](url), - unordered lists, paragraphs.
 * Not a full Markdown parser — intentionally minimal for GEO summary content.
 */
export function renderSimpleMarkdown(input: string): string {
  if (!input) return '';

  // Pre-process: unfold YAML >- folded list items
  // "- **A** text - **B** text" → separate lines
  const normalized = input.replace(/ - (?=\*\*)/g, '\n- ');

  const lines = normalized.split('\n');
  const blocks: string[] = [];
  let currentList: string[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push(`<ul>${currentList.join('')}</ul>`);
      currentList = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // Empty line — flush any open list
    if (!trimmed) {
      flushList();
      continue;
    }

    // List item: starts with - or *
    if (/^[-*]\s+/.test(trimmed)) {
      const content = trimmed.replace(/^[-*]\s+/, '');
      currentList.push(`<li>${inlineFormat(content)}</li>`);
      continue;
    }

    // Regular text line — flush list first, then wrap in <p>
    flushList();
    blocks.push(`<p>${inlineFormat(trimmed)}</p>`);
  }

  // Flush remaining list
  flushList();

  return blocks.join('');
}

/** Inline formatting: bold, italic, links */
function inlineFormat(text: string): string {
  return text
    // Links: [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Bold: **text** or __text__
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    // Italic: *text* or _text_
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/(?<!\w)_([^_]+)_(?!\w)/g, '<em>$1</em>');
}
