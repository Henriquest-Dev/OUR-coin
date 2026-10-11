import { Send } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { site } from "../config/site";
import { scenes, sticker } from "../lib/assets";
import { Button } from "../components/Button";
import { Container, Eyebrow, Floaty, Reveal, SplitHeadline } from "../components/ui";

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-[1.05em] fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Community() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rot = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -6, reduce ? 0 : 6]);
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 60, reduce ? 0 : -40]);

  return (
    <section id="community" ref={ref} className="relative overflow-hidden bg-gold py-24 sm:py-32" aria-labelledby="community-title">
      <div className="rays absolute inset-0 opacity-60 [filter:invert(1)]" aria-hidden />
      <Floaty src={sticker.coinTilt} className="top-16 left-[6%] w-16" rotate={-18} />
      <Floaty src={sticker.burst} className="top-24 right-[10%] w-20" rotate={8} delay={1} />
      <Floaty src={sticker.bolt} className="bottom-24 left-[44%] hidden w-10 lg:block" delay={0.4} />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Eyebrow n="08" tone="ink">the community</Eyebrow>
            <SplitHeadline
              id="community-title"
              text="The meme is ours. The mission is bigger."
              className="mt-6 text-[clamp(2.8rem,7.5vw,6.5rem)] text-ink"
            />
            <Reveal>
              <p className="mt-6 max-w-xl text-xl leading-snug font-semibold text-ink/85">
                No velvet rope. No dress code (Damian disagrees). Bring your best memes, your worst puns and your good
                intentions — the court is open.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href={site.socials.x} variant="ink" size="lg" icon={<XIcon />} pendingLabel="Account coming soon">
                  Follow on X
                </Button>
                <Button href={site.socials.telegram} variant="cream" size="lg" icon={<Send aria-hidden className="size-5" strokeWidth={2.75} />} pendingLabel="Group coming soon">
                  Join Telegram
                </Button>
                {site.socials.other.map((o) => (
                  <Button key={o.url} href={o.url} variant="cream" size="lg">
                    {o.label}
                  </Button>
                ))}
              </div>
              <p className="mt-6 text-sm font-semibold text-ink/70">
                Only trust links listed on this website. Admins will never DM you first.
              </p>
            </Reveal>
          </div>

          <motion.div style={{ rotate: rot, y }} className="relative mx-auto w-full max-w-[17rem] sm:max-w-sm">
            <div className="chunk overflow-hidden bg-royal shadow-[0_12px_0_0_var(--color-ink)]">
              <img
                src={scenes.standingTall.src}
                srcSet={scenes.standingTall.srcSet}
                sizes="(min-width: 1024px) 24rem, 80vw"
                alt="Damian Dupont standing tall with arms crossed in his spotted fur coat"
                loading="lazy"
                className="aspect-[2/3] w-full object-cover"
              />
            </div>
            <img src={sticker.megaphone} alt="" aria-hidden loading="lazy" className="animate-wiggle absolute -bottom-8 -left-8 w-28 drop-shadow-[0_5px_0_var(--color-ink)] sm:w-32" />
            <img src={sticker.betterWorld} alt="" aria-hidden className="animate-wiggle absolute -top-6 -right-6 w-32 drop-shadow-[0_3px_0_var(--color-ink)]" />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
