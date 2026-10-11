import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { video } from "../lib/assets";

/** Exact background colour of the animated logo footage, so the video edge disappears. */
const VIDEO_BLUE = "#2a7fe4";
const LETTERS = "OUR COIN".split("");
/** Hard cap so a stalled network never traps anyone behind the preloader. */
const MAX_MS = 8000;

type Props = { onDone: () => void };

/**
 * Plays the animated Damian logo once (mandatory, not skippable), then lifts away like a curtain.
 * Exits when the clip has finished AND the page has loaded (or after MAX_MS).
 * Reduced-motion users see the final frame briefly instead of the clip.
 */
export function Preloader({ onDone }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [clipDone, setClipDone] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(document.readyState === "complete");

  // page load
  useEffect(() => {
    if (pageLoaded) return;
    const on = () => setPageLoaded(true);
    window.addEventListener("load", on, { once: true });
    return () => window.removeEventListener("load", on);
  }, [pageLoaded]);

  // lock scroll while the curtain is down
  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, []);

  // clip progress (or a short timer if reduced motion / autoplay is blocked)
  useEffect(() => {
    const v = ref.current;
    let raf = 0;
    let fallback: number | undefined;
    const start = performance.now();

    const runTimer = (ms: number) => {
      const tick = () => {
        const p = Math.min(1, (performance.now() - start) / ms);
        setProgress(p);
        if (p < 1) raf = requestAnimationFrame(tick);
        else setClipDone(true);
      };
      raf = requestAnimationFrame(tick);
    };

    if (reduce || !v) {
      runTimer(900);
    } else {
      const tick = () => {
        if (v.duration) setProgress(Math.min(1, v.currentTime / v.duration));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      v.play().catch(() => {
        cancelAnimationFrame(raf);
        runTimer(2200); // autoplay refused (e.g. low-power mode): show poster, keep moving
      });
      // if the clip never starts, don't hang
      fallback = window.setTimeout(() => setClipDone(true), MAX_MS - 1500);
    }
    const cap = window.setTimeout(() => setVisible(false), MAX_MS);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(fallback);
      window.clearTimeout(cap);
    };
  }, [reduce]);

  useEffect(() => {
    if (clipDone && pageLoaded) {
      const t = window.setTimeout(() => setVisible(false), reduce ? 0 : 350);
      return () => window.clearTimeout(t);
    }
  }, [clipDone, pageLoaded, reduce]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          key="preloader"
          role="status"
          aria-live="polite"
          aria-label="Loading OUR COIN"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: VIDEO_BLUE }}
          initial={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
          exit={{
            clipPath: "inset(0% 0% 100% 0% round 0 0 50% 50%)",
            transition: { duration: reduce ? 0.2 : 0.9, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          <motion.div
            className="relative aspect-square w-[min(84vw,58vh)]"
            exit={{ y: -60, scale: 0.92, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
          >
            {reduce ? (
              <img src={video.end} alt="" className="size-full object-contain [mask-image:linear-gradient(to_right,transparent,#000_20%,#000_80%,transparent)]" />
            ) : (
              <video
                ref={ref}
                className="size-full object-contain [mask-image:linear-gradient(to_right,transparent,#000_20%,#000_80%,transparent)]"
                muted
                playsInline
                autoPlay
                preload="auto"
                poster={video.poster}
                onEnded={() => setClipDone(true)}
                aria-hidden
              >
                <source src={video.webm} type="video/webm" />
                <source src={video.mp4} type="video/mp4" />
              </video>
            )}
          </motion.div>

          <div className="mt-2 flex flex-col items-center gap-4">
            <p className="display text-sticker flex text-[clamp(2.75rem,9vw,5.5rem)]" aria-hidden>
              {LETTERS.map((l, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={reduce ? false : { y: "110%", rotate: -12, opacity: 0 }}
                  animate={{ y: 0, rotate: 0, opacity: 1 }}
                  transition={{ delay: 0.35 + i * 0.06, type: "spring", stiffness: 420, damping: 18 }}
                >
                  {l === " " ? " " : l}
                </motion.span>
              ))}
            </p>
            <div className="h-3 w-52 overflow-hidden rounded-full border-[3px] border-ink bg-ink/30">
              <div
                className="h-full rounded-full bg-gold transition-[width] duration-150"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <span className="sr-only">{Math.round(progress * 100)}% loaded</span>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
