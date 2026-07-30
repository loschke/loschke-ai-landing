import { useState, useRef, useEffect } from "react";
import { renderSimpleMarkdown } from "@utils/markdown";

interface SummaryAudioBoxProps {
  summary?: string;
  audioSrc?: string;
}

/* ─── Audio Player ─── */
function AudioPlayer({ src }: { src: string }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  // Genau ein stiller Lade-Neustart, danach nicht weiter versuchen.
  const reloadedRef = useRef(false);

  const speeds = [0.75, 1, 1.25, 1.5, 2];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Das Audio-Element steht im vom Server gelieferten HTML und laedt seine
  // Metadaten, bevor React diese Insel hydriert. `loadedmetadata` ist dann
  // schon durch und erreicht keinen React-Handler mehr, die Dauer blieb auf
  // 0:00 stehen. Deshalb hier direkt am Element ablesen und zusaetzlich
  // lauschen. Play/Pause kommt ebenfalls vom Element, nicht aus geratenem
  // State, damit der Button nie etwas anderes anzeigt als tatsaechlich laeuft.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const syncDuration = () => {
      if (Number.isFinite(el.duration)) setDuration(el.duration);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    // Mehrere Events, weil die Reihenfolge je nach Cache-Zustand und
    // Seitenwechsel variiert. Eines davon greift immer.
    const durationEvents = [
      "loadedmetadata",
      "durationchange",
      "loadeddata",
      "canplay",
    ] as const;

    syncDuration();
    for (const ev of durationEvents) el.addEventListener(ev, syncDuration);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);

    // Zweiter Fall, der nur bei Client-Navigation auftritt: Der Astro
    // ClientRouter parst die Zielseite in einem inaktiven Dokument und tauscht
    // die Elemente dann ein. Ein Audio-Element von dort hat seinen Ladevorgang
    // nie sauber gestartet, es hat error gesetzt oder keinen Netz-Zustand.
    // Ein load() setzt es zurueck und laedt regulaer. Gleiches Muster wie im
    // PodcastPlayer von lernen.diy, wo derselbe Fehler zuerst auftrat.
    if (
      el.error ||
      el.networkState === HTMLMediaElement.NETWORK_NO_SOURCE ||
      el.networkState === HTMLMediaElement.NETWORK_EMPTY
    ) {
      reloadedRef.current = true;
      el.load();
    }

    return () => {
      for (const ev of durationEvents) el.removeEventListener(ev, syncDuration);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, []);

  // Das error-Event kann erst nach dem Mount eintreffen, dann greift die
  // Pruefung oben nicht mehr. Deshalb hier noch einmal still neu laden.
  const handleError = () => {
    const el = audioRef.current;
    if (el && !reloadedRef.current) {
      reloadedRef.current = true;
      el.load();
    }
  };

  const togglePlay = async () => {
    const el = audioRef.current;
    if (!el) return;

    if (el.paused) {
      try {
        if (el.readyState === 0) el.load();
        await el.play();
      } catch (err) {
        // Abgelehntes play() nicht verschlucken, sonst zeigt der Button
        // "laeuft" an, waehrend nichts zu hoeren ist.
        setPlaying(false);
        if (err instanceof Error && err.name === "AbortError") return;
        console.error("Audio konnte nicht gestartet werden:", err);
      }
    } else {
      el.pause();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      );
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (audioRef.current) {
      audioRef.current.currentTime = percent * audioRef.current.duration;
    }
  };

  const cycleSpeed = () => {
    const currentIndex = speeds.indexOf(speed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];
    setSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onError={handleError}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
          setCurrentTime(0);
        }}
      />

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-dark border-none cursor-pointer flex items-center justify-center shrink-0 transition-colors duration-250 hover:bg-accent"
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="2" y="1" width="3" height="12" fill="#fff" />
            <rect x="9" y="1" width="3" height="12" fill="#fff" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 1L13 7L3 13V1Z" fill="#fff" />
          </svg>
        )}
      </button>

      {/* Progress Section */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2 gap-2">
          <span className="text-[11px] sm:text-xs font-medium text-dark truncate">
            Audio-Zusammenfassung
          </span>
          <span className="text-[10px] sm:text-[11px] text-[#a3a3a3] tabular-nums shrink-0">
            {formatTime(currentTime)} / {formatTime(duration || 0)}
          </span>
        </div>
        <div
          onClick={handleSeek}
          className="h-1 bg-[#e5e5e5] cursor-pointer relative"
        >
          <div
            className="absolute left-0 top-0 bottom-0 bg-accent"
            style={{
              width: `${progress}%`,
              transition: "width 0.1s linear",
            }}
          />
        </div>
      </div>

      {/* Speed Control */}
      <button
        onClick={cycleSpeed}
        className="px-2.5 py-1.5 bg-transparent border border-[#e5e5e5] text-[11px] font-medium text-[#737373] cursor-pointer font-sans tabular-nums shrink-0 transition-all duration-200 hover:border-dark hover:text-dark"
      >
        {speed}×
      </button>
    </div>
  );
}

/* ─── Combined Summary + Audio Box (Variante B1) ─── */
export function SummaryAudioBox({ summary, audioSrc }: SummaryAudioBoxProps) {
  const summaryHtml = summary ? renderSimpleMarkdown(summary) : "";

  return (
    <div className="bg-[#fafafa] border border-[#e5e5e5] mb-10 overflow-hidden">
      {/* Summary Section */}
      {summaryHtml && (
        <div className="px-6 md:px-7 pt-6 pb-5">
          <span className="text-[11px] font-medium text-[#a3a3a3] tracking-[0.1em] uppercase block mb-3">
            Kurzfassung
          </span>
          <div
            className="summary-content text-[15px] font-light leading-[1.7] text-[#404040] [&_strong]:font-semibold [&_strong]:text-dark [&_a]:text-accent [&_a]:no-underline hover:[&_a]:border-b hover:[&_a]:border-accent [&_ul]:list-none [&_ul]:pl-0 [&_ul]:mt-3 [&_li]:pl-5 [&_li]:relative [&_li]:mb-2 [&_li]:text-[15px] [&_li]:font-light [&_li]:leading-[1.6] [&_p]:mb-3 last:[&_p]:mb-0"
            dangerouslySetInnerHTML={{ __html: summaryHtml }}
          />
        </div>
      )}

      {/* Audio Section */}
      {audioSrc && (
        <div
          className={`px-6 md:px-7 py-4 ${summaryHtml ? "border-t border-[#e5e5e5]" : ""}`}
        >
          <AudioPlayer src={audioSrc} />
        </div>
      )}
    </div>
  );
}
