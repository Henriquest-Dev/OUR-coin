import type { ReactNode } from "react";
import { ChevronRight, Clock } from "lucide-react";

type Variant = "gold" | "cream" | "ink" | "ghost";

const styles: Record<Variant, string> = {
  gold: "bg-gold text-ink border-ink",
  cream: "bg-cream text-ink border-ink",
  ink: "bg-ink text-cream border-ink",
  ghost: "bg-transparent text-cream border-cream shadow-none",
};

type Props = {
  children: ReactNode;
  /** Destination. `null` renders a disabled "coming soon" control (never a dead link). */
  href: string | null;
  variant?: Variant;
  size?: "md" | "lg";
  external?: boolean;
  /** Label shown in place of the CTA while the link is unavailable. */
  pendingLabel?: string;
  className?: string;
  icon?: ReactNode;
};

/**
 * Tactile, sticker-style button: thick ink outline, hard offset shadow,
 * squishes down on press. Inspired by the chunky "Copy" button in the
 * style reference.
 */
export function Button({
  children,
  href,
  variant = "gold",
  size = "md",
  external,
  pendingLabel = "Link coming soon",
  className = "",
  icon,
}: Props) {
  const base =
    "group relative inline-flex select-none items-center justify-center gap-2 rounded-full border-[3px] font-display font-extrabold uppercase tracking-tight transition-[transform,box-shadow,background-color] duration-150 ease-out";
  const sz = size === "lg" ? "px-7 py-4 text-lg sm:text-xl" : "px-5 py-3 text-base";
  const shadow = variant === "ghost" ? "" : "shadow-[0_6px_0_0_var(--color-ink)]";

  if (!href) {
    return (
      <span
        role="link"
        aria-disabled="true"
        title={pendingLabel}
        className={`${base} ${sz} ${styles[variant]} ${shadow} cursor-not-allowed shadow-[0_4px_0_0_var(--color-ink)] saturate-[0.85] ${className}`}
      >
        <Clock aria-hidden className="size-[1.1em] shrink-0" strokeWidth={2.75} />
        <span className="flex flex-col items-start leading-none">
          <span>{children}</span>
          <span className="mt-1 font-sans text-[0.62em] font-semibold normal-case tracking-normal opacity-75">
            {pendingLabel}
          </span>
        </span>
      </span>
    );
  }

  const ext = external ?? /^https?:/.test(href);
  return (
    <a
      href={href}
      {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${base} ${sz} ${styles[variant]} ${shadow} hover:-translate-y-0.5 hover:shadow-[0_8px_0_0_var(--color-ink)] active:translate-y-[5px] active:shadow-[0_1px_0_0_var(--color-ink)] ${
        variant === "ghost" ? "hover:bg-cream/10 active:translate-y-0.5" : ""
      } ${className}`}
    >
      {icon}
      <span>{children}</span>
      <ChevronRight
        aria-hidden
        className="size-[1.15em] shrink-0 transition-transform duration-200 group-hover:translate-x-1"
        strokeWidth={3.25}
      />
      {ext && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  );
}
