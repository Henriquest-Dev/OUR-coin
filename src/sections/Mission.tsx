import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { BadgeCheck, FileText, Receipt } from "lucide-react";
import { site, TBA } from "../config/site";
import { damian, sticker } from "../lib/assets";
import { Container, Eyebrow, Floaty, Pending, Reveal, SplitHeadline } from "../components/ui";

const PRINCIPLES = [
  {
    icon: FileText,
    title: "Disclosed before it’s claimed",
    body: "The exact percentage, eligible revenue sources, recipients and distribution rules get approved and published first. No vibes-based numbers.",
  },
  {
    icon: BadgeCheck,
    title: "Revenue, not your purchase",
    body: "Buying OUR COIN is not a donation. Giving is funded from a disclosed share of eligible project revenue — never from the price you pay for a token.",
  },
  {
    icon: Receipt,
    title: "Receipts or it didn’t happen",
    body: "Every donation is meant to be published with its transaction reference and proof of receipt from the organisation that got it.",
  },
];

export function Mission() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 80, reduce ? 0 : -80]);

  return (
    <section id="mission" ref={ref} className="relative overflow-hidden bg-royal py-24 text-cream sm:py-32" aria-labelledby="mission-title">
      <div className="rays absolute inset-0 opacity-50" aria-hidden />
      <Container className="relative">
        <Eyebrow n="03">more than a meme</Eyebrow>
        <SplitHeadline
          id="mission-title"
          text="The internet made memes valuable. Let’s make them mean something."
          highlight={["mean", "something"]}
          className="mt-6 max-w-5xl text-[clamp(2.6rem,7vw,6rem)] drop-shadow-[0_5px_0_var(--color-ink)]"
        />

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div style={{ y }} className="relative mx-auto w-full max-w-md">
            <div className="chunk relative overflow-hidden bg-royal-deep pt-10 shadow-[0_10px_0_0_var(--color-ink)] -rotate-2">
              <div className="rays absolute inset-0" aria-hidden />
              <img
                src={damian.heart}
                alt="Damian Dupont hugging a big red heart"
                loading="lazy"
                className="relative mx-auto block w-[92%]"
              />
            </div>
            <Floaty src={sticker.heart} className="top-0 left-2 w-12" rotate={-12} />
            <Floaty src={sticker.globeHeart} className="top-[8%] right-0 w-16" rotate={10} delay={1} />
            <Floaty src={sticker.handshake} className="bottom-6 -left-4 w-20" rotate={-6} delay={0.5} slow />
            <Floaty src={sticker.globe} className="right-2 bottom-12 w-14" delay={1.6} />
          </motion.div>

          <div>
            <Reveal>
              <p className="text-xl leading-snug font-semibold sm:text-2xl">
                OUR COIN aims to allocate a substantial, clearly disclosed portion of eligible project revenue to charitable
                organisations and community initiatives.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-cream/85">
                Same memes. Same chaos. But with a plan for where some of the project’s money actually goes — written down,
                published, and checkable by anyone. We’d rather under-promise and over-receipt.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="font-display text-sm font-extrabold tracking-widest uppercase">Charitable allocation</span>
                {site.giving.allocation ? (
                  <span className="rounded-full border-[3px] border-ink bg-gold px-4 py-1 font-display font-extrabold text-ink">
                    {site.giving.allocation}
                  </span>
                ) : (
                  <Pending tone="dark">{TBA}</Pending>
                )}
              </div>
            </Reveal>

            <ul className="mt-10 grid gap-4">
              {PRINCIPLES.map((p, i) => (
                <Reveal as="li" key={p.title} delay={i * 0.08}>
                  <div className="chunk flex gap-4 bg-cream p-5 text-ink">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl border-[3px] border-ink bg-gold">
                      <p.icon aria-hidden strokeWidth={2.5} />
                    </span>
                    <div>
                      <h3 className="display text-2xl">{p.title}</h3>
                      <p className="mt-1 leading-snug text-ink/80">{p.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
