import { useEffect, useRef, useState } from "react";

export type VideoSpec = {
  src: string;
  poster: string;
  width: number;
  height: number;
};

function PlayIcon({ playing }: { playing: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      {playing ? (
        <>
          <rect x="3.5" y="2.5" width="3" height="11" rx="1" />
          <rect x="9.5" y="2.5" width="3" height="11" rx="1" />
        </>
      ) : (
        <path d="M4.5 2.8v10.4a.6.6 0 0 0 .9.5l8.2-5.2a.6.6 0 0 0 0-1L5.4 2.3a.6.6 0 0 0-.9.5Z" />
      )}
    </svg>
  );
}

function SoundIcon({ muted }: { muted: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 6v4h2.7L8.5 12.8V3.2L5.2 6H2.500Z" fill="currentColor" />
      {muted ? (
        <path d="m11 6 3.5 4m0-4L11 10" />
      ) : (
        <path d="M11 5.8a3 3 0 0 1 0 4.4M12.8 4a5.5 5.5 0 0 1 0 8" />
      )}
    </svg>
  );
}

export default function ProjectVideo({ video, label }: { video: VideoSpec; label: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useRef(false);
  const userPaused = useRef(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const frame = frameRef.current;
    const el = videoRef.current;
    if (!frame || !el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (!userPaused.current) el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      userPaused.current = false;
      el.play().catch(() => {});
    } else {
      userPaused.current = true;
      el.pause();
    }
  };

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  };

  return (
    <div
      ref={frameRef}
      className="project-video"
      style={{ aspectRatio: `${video.width} / ${video.height}` }}
    >
      {failed ? (
        <img className="is-loaded" src={video.poster} alt={label} />
      ) : (
        <video
          ref={videoRef}
          className={ready ? "is-loaded" : ""}
          src={video.src}
          poster={video.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label={label}
          onCanPlay={() => setReady(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setFailed(true)}
        />
      )}
      {!failed && (
        <div className="video-controls">
          <button type="button" onClick={togglePlay} aria-label={playing ? "Pause video" : "Play video"}>
            <PlayIcon playing={playing} />
          </button>
          <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute video" : "Mute video"}>
            <SoundIcon muted={muted} />
          </button>
        </div>
      )}
    </div>
  );
}
