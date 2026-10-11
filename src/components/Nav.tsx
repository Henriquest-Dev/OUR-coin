import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { site } from "../config/site";
import { damian, sticker } from "../lib/assets";
import { Button } from "./Button";

export const NAV_LINKS = [
  { href: "#damian", label: "Damian" },
  { href: "#mission", label: "Mission" },
  { href: "#giving", label: "Giving" },
  { href: "#impact", label: "Impact" },
  { href: "#buy", label: "How to buy" },
  { href: "#token", label: "Token" },
  { href: "#faq", label: "FAQ" },
];

export function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="#top" className={`group flex items-center gap-2 ${className}`} aria-label="OUR COIN — back to top">
      <img src={sticker.crownGold} alt="" className="h-8 w-auto transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
      <span className="display text-[1.7rem] leading-none text-cream">
        Our<span className="text-gold">Coin</span>
      </span>
    </a>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>("a,button");
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      toggleRef.current?.focus();
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <a
        href="#main"
        className="sr-only rounded-full bg-gold px-4 py-2 font-bold text-ink focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[70]"
      >
        Skip to content
      </a>
      <nav
        aria-label="Main"
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border-[3px] px-4 py-2 transition-all duration-300 sm:px-5 ${
          scrolled ? "border-ink bg-royal-deep/90 shadow-[0_5px_0_0_var(--color-ink)] backdrop-blur-md" : "border-transparent bg-transparent"
        }`}
      >
        <Logo />
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3 py-2 font-display text-[0.95rem] font-bold tracking-tight text-cream uppercase transition hover:bg-cream hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <Button href={site.token.pumpFunUrl} pendingLabel="Soon on Pump.fun" className="!py-2 !text-sm">
              Buy Our Coin
            </Button>
          </div>
          <button
            ref={toggleRef}
            type="button"
            className="grid size-12 place-items-center rounded-full border-[3px] border-ink bg-gold text-ink shadow-[0_4px_0_0_var(--color-ink)] active:translate-y-1 active:shadow-none lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X strokeWidth={3} /> : <Menu strokeWidth={3} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 -z-10 flex flex-col overflow-y-auto bg-ink px-6 pt-28 pb-10 lg:hidden"
            initial={{ clipPath: "circle(0% at 92% 6%)" }}
            animate={{ clipPath: "circle(150% at 92% 6%)" }}
            exit={{ clipPath: "circle(0% at 92% 6%)" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="display block py-1 text-[clamp(2.5rem,11vw,4rem)] text-cream transition hover:text-gold"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-8">
              <Button href={site.token.pumpFunUrl} size="lg" pendingLabel="Soon on Pump.fun">
                Buy Our Coin
              </Button>
            </div>
            <img src={damian.pointing} alt="" className="pointer-events-none absolute right-0 bottom-0 w-44 opacity-90" />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
