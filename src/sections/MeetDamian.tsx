import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { damian, scenes, sticker } from "../lib/assets";
import { Container, Eyebrow, Floaty, Reveal, SplitHeadline } from "../components/ui";

const ID_FIELDS = [
  ["Name", "Damian Dupont"],
  ["Title", "Self-crowned King of the Timeline"],
  ["Dress code", "Fur coat. Every season."],
  ["Sunglasses", "On. Indoors. At night."],
  ["Known for", "Generosity nobody saw coming"],
  ["Status", "100% fictional · 0% boring"],
] as const;

const MOODS = [
  { img: damian.celebrating, name: "Make it rain", line: "When the community shows up for each other." },
  { img: damian.coffee, name: "Morning royalty", line: "The memes don't post themselves." },
  { img: damian.heart, name: "Soft side", line: "Big heart. Bigger coat. Don't tell anyone." },
  { img: damian.shrug, name: "No promises", line: "Financial advice? Never met her." },
  { img: damian.thinking, name: "Deep thoughts", line: "Calculating the maximum possible drip." },
  { img: damian.laughing, name: "Comedy king", line: "Laughing at his own meme. Again." },
  { img: damian.pointing, name: "Yes, you", line: "There's room at the court. Pull up." },
  { img: damian.coin, name: "Shiny thing", line: "Mine? No. Ours. That's the whole point." },
] as const;

function MoodCard({ img, name, line, i }: (typeof MOODS)[number] & { i: number }) {
  const [said, setSaid] = useState(false);
  const reduce = useReducedMotion();
  const tilt = i % 2 ? 2 : -2;
  return (
    <motion.li
      className="w-[72vw] max-w-[17rem] shrink-0 snap-center sm:w-auto sm:max-w-none"
      initial={reduce ? false : { opacity: 0, y: 40, rotate: tilt * 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      whileHover={reduce ? undefined : { rotate: 0, y: -8, scale: 1.03 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: (i % 4) * 0.06 }}
    >
      <button
        type="button"
        onClick={() => setSaid((s) => !s)}
        aria-pressed={said}
        className="chunk group relative block w-full overflow-hidden bg-royal text-left"
      >
        <span className="rays absolute inset-0 opacity-60" aria-hidden />
        <img
          src={img}
          alt={`Damian Dupont — ${name}`}
          loading="lazy"
          decoding="async"
          className="relative mx-auto block h-56 w-auto object-contain object-bottom pt-4 transition-transform duration-300 group-hover:scale-105 sm:h-60"
        />
        <span className="relative block border-t-[3px] border-ink bg-cream px-4 py-3">
          <span className="display block text-2xl">{name}</span>
          <span className="mt-0.5 block text-sm font-medium text-ink/70">Tap for his take</span>
        </span>
        {/* speech bubble */}
        <span
          className={`absolute top-3 left-3 right-3 rounded-2xl border-[3px] border-ink bg-cream px-3 py-2 text-[0.95rem] leading-tight font-bold shadow-[0_4px_0_0_var(--color-ink)] transition-all duration-300 ${
            said ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-2 scale-90 opacity-0 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100"
          }`}
        >
          “{line}”
          <span className="absolute -bottom-[11px] left-8 size-4 rotate-45 border-r-[3px] border-b-[3px] border-ink bg-cream" />
        </span>
      </button>
    </motion.li>
  );
}

export function MeetDamian() {
  return (
    <section id="damian" className="fur relative overflow-hidden pt-28 pb-24 sm:pt-36" aria-labelledby="damian-title">
      <Floaty src={sticker.crownSketch} className="top-16 right-[6%] w-20 opacity-90 sm:w-28" rotate={10} />
      <Floaty src={sticker.sunglasses} className="top-[38%] left-[2%] hidden w-20 lg:block" rotate={-14} delay={1} slow />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <Eyebrow n="02" tone="flame">meet the face of the movement</Eyebrow>
            <SplitHeadline
              id="damian-title"
              text="Meet Damian Dupont."
              highlight={["dupont"]}
              className="mt-5 text-[clamp(3rem,8vw,6.5rem)] text-ink"
            />
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-xl leading-snug font-semibold sm:text-2xl">
                Too much personality for one timeline. Too much ambition for just another meme.
              </p>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/80">
                He wears a fur coat in July, sunglasses at midnight and a crown he gave himself. He talks like he owns the
                internet — and then quietly asks how he can help. Damian is the loud, lovable face of OUR COIN: proof that a
                meme can have swagger <em>and</em> a conscience.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="relative">
            <div className="chunk relative overflow-hidden bg-royal shadow-[0_10px_0_0_var(--color-ink)] lg:rotate-2">
              <img
                src={scenes.portraitWide.src}
                srcSet={scenes.portraitWide.srcSet}
                sizes="(min-width: 1024px) 45vw, 92vw"
                alt="Close-up portrait of Damian Dupont in crown, sunglasses and fur coat"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover object-[62%_50%]"
              />
            </div>
            <img
              src={sticker.goodMemes}
              alt=""
              aria-hidden
              className="animate-wiggle absolute -bottom-8 -left-4 w-28 drop-shadow-[0_4px_0_var(--color-ink)] sm:w-36"
            />
            <span className="marker absolute -top-5 right-4 rotate-3 rounded-xl border-[3px] border-ink bg-gold px-3 py-1 text-ink shadow-[0_4px_0_0_var(--color-ink)]">
              Fictional. Fabulous.
            </span>
          </Reveal>
        </div>

        {/* Royal ID card */}
        <Reveal className="mt-20">
          <div className="chunk mx-auto grid max-w-4xl overflow-hidden bg-cream sm:grid-cols-[14rem_1fr]">
            <div className="relative flex items-end justify-center border-b-[3px] border-ink bg-flame sm:border-r-[3px] sm:border-b-0">
              <span className="rays absolute inset-0" aria-hidden />
              <img src={damian.standing} alt="Damian Dupont standing with arms crossed" loading="lazy" className="relative h-64 w-auto pt-4" />
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <p className="display text-3xl">Royal ID</p>
                <img src={sticker.crownJewel} alt="" aria-hidden className="h-10 w-auto" />
              </div>
              <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {ID_FIELDS.map(([k, v]) => (
                  <div key={k} className="border-b-2 border-dashed border-ink/25 pb-2">
                    <dt className="text-xs font-bold tracking-widest text-ink/55 uppercase">{k}</dt>
                    <dd className="font-display text-lg font-bold">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-sm leading-relaxed text-ink/65">
                Damian Dupont is a fictional character and mascot. He is not a real person, he doesn’t trade, and he does not
                manage, hold or distribute any funds.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Moods */}
        <div className="mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SplitHeadline as="h3" text="The many moods of Damian" className="text-[clamp(2.2rem,5vw,4rem)]" />
            <p className="marker text-lg text-flame">hover or tap a card ↓</p>
          </div>
          <ul className="-mx-4 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pt-2 pb-6 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {MOODS.map((m, i) => (
              <MoodCard key={m.name} {...m} i={i} />
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
