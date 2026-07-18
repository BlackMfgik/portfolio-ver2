"use client";

import {
  useState,
  useEffect,
  useRef,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import Link from "next/link";
import BlackHoleText from "@/components/BlackHoleText";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Work" },
];

const tracks = [
  {
    artist: "\u0445\u0435\u0439\u0442\u0441\u043f\u0456\u0447",
    title:
      "\u0446\u0435 \u043d\u0435 \u0441\u0438\u043b\u044c\u043d\u043e \u0440\u0430\u0434\u0438\u043a\u0430\u043b\u044c\u043d\u043e",
    url: "https://music.youtube.com/watch?v=EankhQJqe5c",
    src: "/audio/track-01.mp3",
    coverSrc: "/ascii-track-cover.png",
    duration: 180,
  },
  {
    artist: "\u0414\u041a \u0415\u043d\u0435\u0440\u0433\u0435\u0442\u0438\u043a",
    title: "2\u04452",
    url: "",
    src: "/audio/track-02.mp3",
    coverSrc: "/ascii-track-cover-02.png",
    duration: 180,
  },
];

const VOLUME_STORAGE_KEY = "portfolio-mini-player-volume";

interface NavProps {
  isMusicPlaying: boolean;
  onMusicPlayingChange: (isPlaying: boolean) => void;
  onTrackCoverChange: (coverSrc: string) => void;
}

function formatTrackTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

export default function Nav({
  isMusicPlaying,
  onMusicPlayingChange,
  onTrackCoverChange,
}: NavProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [volumeOpen, setVolumeOpen] = useState(false);
  const [volume, setVolume] = useState(70);
  const [volumeReady, setVolumeReady] = useState(false);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [trackProgress, setTrackProgress] = useState(0);
  const [trackDuration, setTrackDuration] = useState(tracks[0].duration);

  const activeTrack = tracks[activeTrackIndex];
  const volumeMode = volume === 0 ? "muted" : volume < 50 ? "low" : "high";
  const volumeLevelStyle = { "--volume-level": `${volume}%` } as CSSProperties;
  const duration = trackDuration || activeTrack.duration;
  const trackProgressPercent = Math.min(
    100,
    (trackProgress / duration) * 100,
  );
  const trackProgressStyle = {
    "--track-progress": `${trackProgressPercent}%`,
  } as CSSProperties;

  const seekTrackTo = (time: number, playAfterSeek = false) => {
    const audio = audioRef.current;
    const nextTime = Math.min(duration, Math.max(0, time));

    setTrackProgress(nextTime);

    if (audio && Number.isFinite(nextTime)) {
      audio.currentTime = nextTime;

      if (playAfterSeek) {
        onMusicPlayingChange(true);
        audio.play().catch(() => {
          onMusicPlayingChange(false);
        });
      }
    }
  };

  const goToTrack = (index: number) => {
    const nextIndex = (index + tracks.length) % tracks.length;
    const audio = audioRef.current;

    setActiveTrackIndex(nextIndex);
    setTrackProgress(0);
    setTrackDuration(tracks[nextIndex].duration);

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const handlePreviousTrack = () => {
    if (trackProgress > 3 || tracks.length === 1) {
      seekTrackTo(0, isMusicPlaying);
      return;
    }

    goToTrack(activeTrackIndex - 1);
  };

  const handleNextTrack = () => {
    goToTrack(activeTrackIndex + 1);
  };

  const handleProgressChange = (event: ChangeEvent<HTMLInputElement>) => {
    seekTrackTo(Number(event.currentTarget.value), playerOpen);
  };

  const handleProgressKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const seekKeys: Record<string, number> = {
      ArrowLeft: -5,
      ArrowRight: 5,
      PageDown: -15,
      PageUp: 15,
    };

    if (event.key === "Home") {
      event.preventDefault();
      seekTrackTo(0, isMusicPlaying);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      seekTrackTo(duration, isMusicPlaying);
      return;
    }

    const step = seekKeys[event.key];
    if (step) {
      event.preventDefault();
      seekTrackTo(trackProgress + step, isMusicPlaying);
    }
  };

  const setVolumeFromPointer = (clientY: number, element: HTMLDivElement) => {
    const rect = element.getBoundingClientRect();
    const nextVolume = Math.round(((rect.bottom - clientY) / rect.height) * 100);
    setVolume(Math.min(100, Math.max(0, nextVolume)));
  };

  const handleVolumePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setVolumeFromPointer(event.clientY, event.currentTarget);
  };

  const handleVolumePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.buttons !== 1) return;
    setVolumeFromPointer(event.clientY, event.currentTarget);
  };

  const handleVolumeKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const volumeKeys: Record<string, number> = {
      ArrowDown: -5,
      ArrowLeft: -5,
      ArrowRight: 5,
      ArrowUp: 5,
    };

    if (event.key === "Home") {
      event.preventDefault();
      setVolume(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      setVolume(100);
      return;
    }

    const step = volumeKeys[event.key];
    if (step) {
      event.preventDefault();
      setVolume((value) => Math.min(100, Math.max(0, value + step)));
    }
  };

  const renderMiniPlayer = (className = "") => (
    <div
      className={`mini-player ${playerOpen ? "is-open" : ""} ${
        volumeOpen ? "is-volume-open" : ""
      } ${className}`}
    >
      <button
        type="button"
        onClick={() => {
          if (!playerOpen) {
            setPlayerOpen(true);
            return;
          }

          onMusicPlayingChange(!isMusicPlaying);
        }}
        aria-label={
          playerOpen
            ? isMusicPlaying
              ? "Pause track"
              : "Play track"
            : "Open music player"
        }
        aria-expanded={playerOpen}
        className={`mini-player-toggle ${isMusicPlaying ? "is-playing" : ""}`}
      >
        <span className="mini-player-closed-label">
          <BlackHoleText text="some music?" />
        </span>
        <span className="mini-player-play-icon" aria-hidden="true" />
      </button>

      <div className="mini-player-body" aria-hidden={!playerOpen}>
        <div className="mini-player-track">
          <div className="mini-player-track-info">
            <div
              className="mini-player-track-text"
              title={`${activeTrack.artist} - ${activeTrack.title}`}
            >
              <span className="mini-player-track-artist">
                {activeTrack.artist}
              </span>
              <span className="mini-player-track-title">
                {activeTrack.title}
              </span>
            </div>
            <span className="mini-player-track-time">
              {formatTrackTime(trackProgress)}
            </span>
          </div>
          <div className="mini-player-progress-row">
            <button
              type="button"
              className="mini-player-track-skip"
              aria-label="Previous track"
              onClick={handlePreviousTrack}
              tabIndex={playerOpen ? 0 : -1}
            >
              <span
                className="mini-player-track-skip-icon mini-player-track-skip-prev"
                aria-hidden="true"
              />
            </button>
            <div
              className="mini-player-progress"
              style={trackProgressStyle}
            >
              <span />
              <input
                className="mini-player-progress-input"
                type="range"
                min={0}
                max={Math.max(0.01, duration)}
                step={0.01}
                value={Math.min(trackProgress, duration)}
                aria-label="Track progress"
                aria-valuetext={`${formatTrackTime(trackProgress)} of ${formatTrackTime(
                  duration,
                )}`}
                tabIndex={playerOpen ? 0 : -1}
                onChange={handleProgressChange}
                onKeyDown={handleProgressKeyDown}
              />
            </div>
            <button
              type="button"
              className="mini-player-track-skip"
              aria-label="Next track"
              onClick={handleNextTrack}
              tabIndex={playerOpen ? 0 : -1}
            >
              <span
                className="mini-player-track-skip-icon mini-player-track-skip-next"
                aria-hidden="true"
              />
            </button>
          </div>
          <audio
            ref={audioRef}
            className="mini-player-audio"
            preload="metadata"
            src={activeTrack.src}
            onLoadedMetadata={(event) => {
              const nextDuration = event.currentTarget.duration;
              if (Number.isFinite(nextDuration)) {
                setTrackDuration(nextDuration);
              }
            }}
            onTimeUpdate={(event) => {
              setTrackProgress(event.currentTarget.currentTime);
            }}
            onEnded={() => {
              setTrackProgress(0);
              onMusicPlayingChange(false);
            }}
          />
        </div>

        <div className="mini-player-volume-wrap">
          <button
            type="button"
            className={`mini-player-volume mini-player-volume-${volumeMode}`}
            aria-label={`Volume ${volume}%`}
            aria-expanded={volumeOpen}
            onClick={() => setVolumeOpen((value) => !value)}
            tabIndex={playerOpen ? 0 : -1}
          >
            <svg
              className="mini-player-volume-icon"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <path
                className="mini-player-volume-speaker"
                d="M5 13.5h6.4L19 7.5v17l-7.6-6H5z"
              />
              <path
                className="mini-player-volume-wave mini-player-volume-wave-low"
                d="M22.2 12.4a6.3 6.3 0 0 1 0 7.2"
              />
              <path
                className="mini-player-volume-wave mini-player-volume-wave-high"
                d="M25.5 9.5a11.5 11.5 0 0 1 0 13"
              />
              <path
                className="mini-player-volume-mute"
                d="M22.4 12.2 28 19.8M28 12.2l-5.6 7.6"
              />
            </svg>
          </button>

          <div className="mini-player-volume-slider" aria-hidden={!volumeOpen}>
            <div
              className="mini-player-volume-control"
              role="slider"
              aria-label="Volume level"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={volume}
              tabIndex={playerOpen && volumeOpen ? 0 : -1}
              style={volumeLevelStyle}
              onPointerDown={handleVolumePointerDown}
              onPointerMove={handleVolumePointerMove}
              onKeyDown={handleVolumeKeyDown}
            >
              <span className="mini-player-volume-track" />
              <span className="mini-player-volume-thumb" />
            </div>
          </div>
        </div>

        <button
          type="button"
          className="mini-player-close"
          aria-label="Hide music player"
          onClick={() => {
            setPlayerOpen(false);
            setTrackProgress(0);
            onMusicPlayingChange(false);
          }}
          tabIndex={playerOpen ? 0 : -1}
        >
          <BlackHoleText text="hide" />
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 900) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    onTrackCoverChange(activeTrack.coverSrc);
  }, [activeTrack.coverSrc, onTrackCoverChange]);

  useEffect(() => {
    try {
      const savedVolume = window.localStorage.getItem(VOLUME_STORAGE_KEY);
      const parsedVolume = savedVolume === null ? NaN : Number(savedVolume);

      if (Number.isFinite(parsedVolume)) {
        setVolume(Math.min(100, Math.max(0, parsedVolume)));
      }
    } finally {
      setVolumeReady(true);
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!volumeOpen) return;

    const closeVolumeOnOutsideClick = (event: globalThis.PointerEvent) => {
      const target = event.target;

      if (target instanceof Element && target.closest(".mini-player-volume-wrap")) {
        return;
      }

      setVolumeOpen(false);
    };

    document.addEventListener("pointerdown", closeVolumeOnOutsideClick, true);
    return () => {
      document.removeEventListener("pointerdown", closeVolumeOnOutsideClick, true);
    };
  }, [volumeOpen]);

  useEffect(() => {
    if (!playerOpen) {
      setVolumeOpen(false);
      setTrackProgress(0);
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      onMusicPlayingChange(false);
    }
  }, [onMusicPlayingChange, playerOpen]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume / 100;

    if (volumeReady) {
      window.localStorage.setItem(VOLUME_STORAGE_KEY, String(volume));
    }
  }, [volume, volumeReady]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!playerOpen || !isMusicPlaying) {
      audio.pause();
      return;
    }

    audio.play().catch(() => {
      onMusicPlayingChange(false);
    });
  }, [activeTrack.src, isMusicPlaying, onMusicPlayingChange, playerOpen]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !playerOpen || !isMusicPlaying) return;

    let rafId: number;
    const syncProgress = () => {
      setTrackProgress(audio.currentTime);
      rafId = requestAnimationFrame(syncProgress);
    };

    rafId = requestAnimationFrame(syncProgress);
    return () => cancelAnimationFrame(rafId);
  }, [isMusicPlaying, playerOpen]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] px-10 py-7 flex justify-between items-center font-mono text-[10px] tracking-[3px] uppercase text-txt-muted max-[900px]:px-5 max-[900px]:py-5"
        style={{
          background: "linear-gradient(to bottom, #0a0a0a 50%, transparent)",
        }}
      >
        <Link href="#hero" className="nav-link">
          <BlackHoleText text={"!A\u00f8kigahara"} />
        </Link>

        <div className="flex items-center gap-9 max-[900px]:hidden">
          {navLinks.map(({ href, label }) => (
            <Link key={label} href={href} className="nav-link">
              <BlackHoleText text={label} />
            </Link>
          ))}
          {renderMiniPlayer()}
          <div className="w-12 h-px bg-current opacity-25" />
          <Link href="#contact" className="nav-link">
            <BlackHoleText text="Contact" />
          </Link>
        </div>

        <div className="hidden max-[900px]:flex items-center gap-3">
          {renderMiniPlayer("mini-player-mobile")}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="flex flex-col justify-center items-end gap-1.5 w-10 h-10 bg-transparent border-0 p-1"
          >
            <span
              className={`block h-px bg-txt-muted transition-all duration-300 ${menuOpen ? "w-6 rotate-45 translate-y-[7px]" : "w-6"}`}
            />
            <span
              className={`block h-px bg-txt-muted transition-all duration-300 ${menuOpen ? "w-6 -rotate-45 -translate-y-[3px]" : "w-4"}`}
            />
          </button>
        </div>
      </nav>

      <div
        className={`fixed top-0 left-0 right-0 bottom-0 z-[90] flex-col justify-center items-center transition-opacity duration-300 pt-20 ${
          menuOpen
            ? "flex opacity-100 pointer-events-auto"
            : "hidden opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(10,10,10,0.97)" }}
      >
        {[...navLinks, { href: "#contact", label: "Contact" }].map(
          ({ href, label }, i) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`font-mono text-[11px] tracking-[5px] uppercase text-txt-muted no-underline py-7 w-full text-center border-b border-line hover:text-txt hover:bg-surface transition-colors duration-200 ${
                i === 0 ? "border-t border-line" : ""
              }`}
            >
              <BlackHoleText text={label} />
            </Link>
          ),
        )}
      </div>
    </>
  );
}
