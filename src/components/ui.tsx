import { useState, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, Copy, Hourglass } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fades + lifts its children into view once. */
export function Reveal({
  children,
  delay = 0,
  y = 36,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}

/** Headline whose words pop up one by one. */
export function SplitHeadline({
  text,
  className = "",
  as: Tag = "h2",
  highlight = [],
  id,
}: {
  id?: string;
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  /** words (case-insensitive) rendered as gold stickers */
  highlight?: string[];
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const hl = highlight.map((h) => h.toLowerCase());
  return (
    <Tag id={id} className={`display ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
          <motion.span
            className={`inline-block ${hl.includes(w.toLowerCase().replace(/[^a-z]/g, "")) ? "text-sticker" : ""}`}
            initial={reduce ? false : { y: "105%", rotate: 6 }}
            whileInView={{ y: 0, rotate: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 0.75, delay: i * 0.06, ease: EASE }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
}

/** Hand-written section eyebrow, e.g. "02 — meet the king". */
export function Eyebrow({ n, children, tone = "gold" }: { n: string; children: ReactNode; tone?: "gold" | "ink" | "flame" }) {
  const color = tone === "gold" ? "text-gold" : tone === "flame" ? "text-flame" : "text-ink";
  return (
    <p className={`marker flex items-center gap-3 text-lg sm:text-xl ${color}`}>
      <span className="grid size-9 place-items-center rounded-full border-[3px] border-current font-display text-sm font-extrabold">
        {n}
      </span>
      <span className="-rotate-2">{children}</span>
    </p>
  );
}

/** Decorative floating sticker (purely visual, hidden from assistive tech). */
export function Floaty({
  src,
  className = "",
  rotate = 0,
  delay = 0,
  slow = false,
  style,
}: {
  src: string;
  className?: string;
  rotate?: number;
  delay?: number;
  slow?: boolean;
  style?: CSSProperties;
}) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      draggable={false}
      className={`pointer-events-none absolute select-none ${slow ? "animate-float-slow" : "animate-float"} ${className}`}
      style={{ ["--r" as string]: `${rotate}deg`, animationDelay: `${delay}s`, ...style }}
    />
  );
}

/** Honest launch-state marker for anything not yet confirmed. */
export function Pending({ children = "To be announced", tone = "light" }: { children?: ReactNode; tone?: "light" | "dark" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border-2 border-dashed px-3 py-1 text-sm font-semibold ${
        tone === "light" ? "border-ink/40 bg-ink/5 text-ink/75" : "border-cream/50 bg-cream/10 text-cream/85"
      }`}
    >
      <Hourglass aria-hidden className="size-3.5" strokeWidth={2.5} />
      {children}
    </span>
  );
}

/** Tactile copy-to-clipboard button with a "Copied!" state. */
export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // fallback for older browsers / insecure origins
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex shrink-0 items-center gap-2 rounded-2xl border-[3px] border-ink bg-gold px-4 py-2.5 font-display font-extrabold text-ink uppercase shadow-[0_5px_0_0_var(--color-ink)] transition-[transform,box-shadow] duration-100 hover:-translate-y-0.5 hover:shadow-[0_7px_0_0_var(--color-ink)] active:translate-y-[4px] active:shadow-[0_1px_0_0_var(--color-ink)]"
    >
      {copied ? <Check aria-hidden className="size-5" strokeWidth={3} /> : <Copy aria-hidden className="size-5" strokeWidth={2.75} />}
      <span aria-live="polite">{copied ? "Copied!" : label}</span>
    </button>
  );
}

/** Infinite ticker tape. */
export function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  const row = [...items, ...items];
  return (
    <div className={`overflow-hidden border-y-[3px] border-ink ${className}`} aria-hidden>
      <div className="animate-marquee flex w-max items-center gap-8 py-3 will-change-transform">
        {row.map((t, i) => (
          <span key={i} className="display flex items-center gap-8 text-2xl sm:text-3xl">
            {t}
            <img src="/assets/stickers/crown-gold.webp" alt="" className="h-7 w-auto" loading="lazy" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 ${className}`}>{children}</div>;
}
