import { useEffect, useState } from 'react';

const ACCENT = '#FC2D01';

interface Annotation {
  blockIndex: number;
  blockType: string;
  sectionTitle: string;
  blockPreview: string;
  comment: string;
}

interface Props {
  postSlug: string;
}

// Activated by appending ?review=true to the article URL.
// Markdoc renders the article as continuous HTML, so unlike the lesson variant
// (lernen-diy, SSR block attributes) this layer tags the blocks itself: direct
// children of [data-article-body] get data-block-* attributes on activation.
// Saving: dev server POSTs to /__review which writes .reviews/<slug>.json into
// the repo; production builds fall back to a JSON download (demo-safe, no server).
export function ReviewLayer({ postSlug }: Props) {
  const [active, setActive] = useState(false);
  const [annotations, setAnnotations] = useState<Record<string, Annotation>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [saveState, setSaveState] = useState<'idle' | 'saved' | 'error'>('idle');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setActive(params.get('review') === 'true');
  }, []);

  useEffect(() => {
    if (!active) return;
    const container = document.querySelector('[data-article-body]');
    if (!container) return;
    const BLOCK_TAGS = new Set(['P', 'H2', 'H3', 'UL', 'OL', 'TABLE', 'BLOCKQUOTE', 'PRE']);
    // Markdoc wraps the rendered content in its own <article>; descend through
    // single-child wrappers until the actual block elements are the children.
    let host: Element = container;
    while (host.children.length === 1 && !BLOCK_TAGS.has(host.children[0].tagName)) {
      host = host.children[0];
    }
    let index = 0;
    let section = '';
    Array.from(host.children).forEach((el) => {
      if (!(el instanceof HTMLElement) || !BLOCK_TAGS.has(el.tagName)) return;
      if (el.tagName === 'H2') section = el.textContent?.trim() ?? '';
      el.dataset.blockId = `b${index}`;
      el.dataset.blockIndex = String(index);
      el.dataset.blockType = el.tagName.toLowerCase();
      el.dataset.blockPreview = (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 90);
      el.dataset.blockSection = section;
      index++;
    });

    // Titel+Teaser (ArticleHeader) und Zusammenfassung (SummaryAudioBox) sind
    // eigene Review-Einheiten außerhalb des Markdoc-Bodys; negative Indizes
    // sortieren sie im Export vor die Artikel-Blöcke.
    const EXTRA_INDEX: Record<string, number> = { 'titel-teaser': -2, 'zusammenfassung': -1 };
    document.querySelectorAll<HTMLElement>('[data-review-block]').forEach((el) => {
      const kind = el.dataset.reviewBlock!;
      el.dataset.blockId = `x-${kind}`;
      el.dataset.blockIndex = String(EXTRA_INDEX[kind] ?? -9);
      el.dataset.blockType = kind;
      el.dataset.blockPreview = (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 90);
      el.dataset.blockSection = '';
    });
  }, [active]);

  useEffect(() => {
    if (!active) return;
    document.body.dataset.reviewMode = 'true';

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      if (target.closest('[data-review-ui]')) return;
      if (target.closest('a, button, textarea, input')) return;
      const block = target.closest<HTMLElement>('[data-block-id]');
      if (!block) return;
      e.preventDefault();
      setEditingId(block.dataset.blockId!);
    };

    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      delete document.body.dataset.reviewMode;
    };
  }, [active]);

  useEffect(() => {
    if (editingId === null) return;
    setDraft(annotations[editingId]?.comment ?? '');
  }, [editingId, annotations]);

  useEffect(() => {
    if (!active) return;
    document.querySelectorAll<HTMLElement>('[data-block-id]').forEach((el) => {
      const id = el.dataset.blockId!;
      if (annotations[id]) el.dataset.annotated = 'true';
      else delete el.dataset.annotated;
    });
  }, [annotations, active]);

  if (!active) return null;

  const editingEl = editingId ? document.querySelector<HTMLElement>(`[data-block-id="${editingId}"]`) : null;
  const editingPreview = editingEl?.dataset.blockPreview ?? '';
  const editingType = editingEl?.dataset.blockType ?? '';
  const editingSection = editingEl?.dataset.blockSection ?? '';
  const editingIndex = Number(editingEl?.dataset.blockIndex ?? 0);

  const save = () => {
    if (!editingId) return;
    if (!draft.trim()) {
      setEditingId(null);
      return;
    }
    setAnnotations((prev) => ({
      ...prev,
      [editingId]: {
        blockIndex: editingIndex,
        blockType: editingType,
        sectionTitle: editingSection,
        blockPreview: editingPreview,
        comment: draft.trim(),
      },
    }));
    setEditingId(null);
  };

  const remove = () => {
    if (!editingId) return;
    setAnnotations((prev) => {
      const { [editingId]: _drop, ...rest } = prev;
      return rest;
    });
    setEditingId(null);
  };

  const exportAnnotations = async () => {
    const data = {
      post: postSlug,
      reviewedAt: new Date().toISOString(),
      annotations: Object.values(annotations).sort((a, b) => a.blockIndex - b.blockIndex),
    };

    if (import.meta.env.DEV) {
      try {
        const res = await fetch('/__review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(await res.text());
        setSaveState('saved');
      } catch {
        setSaveState('error');
      }
      setTimeout(() => setSaveState('idle'), 2500);
      return;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `review-${postSlug}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const count = Object.keys(annotations).length;
  const exportLabel = saveState === 'saved'
    ? 'Gespeichert ✓'
    : saveState === 'error'
      ? 'Fehler beim Speichern'
      : import.meta.env.DEV
        ? 'An Claude übergeben'
        : 'Export JSON';

  return (
    <>
      <style>{`
        body[data-review-mode] [data-block-id] {
          cursor: pointer;
          border-radius: 4px;
        }
        body[data-review-mode] [data-block-id]:hover {
          outline: 2px dashed ${ACCENT}73;
          outline-offset: 4px;
        }
        body[data-review-mode] [data-block-id][data-annotated] {
          outline: 2px solid ${ACCENT};
          outline-offset: 4px;
          background-color: ${ACCENT}0a;
        }
      `}</style>

      <div
        data-review-ui
        className="fixed bottom-4 right-4 z-40 flex items-center gap-3 bg-white border rounded-full shadow-lg px-4 py-2"
        style={{ borderColor: ACCENT }}
      >
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: ACCENT }}>
          Review
        </span>
        <span className="text-xs text-gray-600">
          {count} {count === 1 ? 'Annotation' : 'Annotations'}
        </span>
        {count > 0 && (
          <button
            type="button"
            onClick={exportAnnotations}
            className="text-xs font-medium text-white rounded-full px-3 py-1 cursor-pointer"
            style={{ backgroundColor: saveState === 'error' ? '#dc2626' : ACCENT }}
          >
            {exportLabel}
          </button>
        )}
      </div>

      {editingId && (
        <div
          data-review-ui
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onClick={() => setEditingId(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl border border-gray-200 p-5 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
              {editingType}
              {editingSection ? ` · ${editingSection}` : ''}
            </div>
            <div className="text-sm font-medium text-gray-900 mb-3 line-clamp-2">{editingPreview}</div>
            <textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) save();
                if (e.key === 'Escape') setEditingId(null);
              }}
              placeholder="Was soll an diesem Block geändert werden?"
              rows={4}
              className="w-full resize-none rounded border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none"
            />
            <div className="flex justify-between items-center mt-3">
              {annotations[editingId] ? (
                <button
                  type="button"
                  onClick={remove}
                  className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                >
                  Entfernen
                </button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer px-3 py-1"
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  onClick={save}
                  className="text-xs font-medium text-white rounded px-3 py-1 cursor-pointer"
                  style={{ backgroundColor: ACCENT }}
                >
                  Speichern <span className="text-[10px] opacity-70 ml-1">⌘↵</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
