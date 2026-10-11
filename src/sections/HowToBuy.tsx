import { ShieldAlert } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { site } from "../config/site";
import { damian, sticker } from "../lib/assets";
import { Button } from "../components/Button";
import { Container, Eyebrow, Floaty, Reveal, SplitHeadline } from "../components/ui";

const STEPS = [
  {
    title: "Set up a Solana wallet",
    body: "Install a reputable, compatible Solana wallet (for example Phantom or Solflare) from its official site or app store. Write your recovery phrase down offline.",
    img: sticker.sunglasses,
  },
  {
    title: "Get some SOL",
    body: "Add SOL to your wallet — enough for the amount you want to trade, plus network and platform fees.",
    img: sticker.coinFront,
  },
  {
    title: "Open the verified Pump.fun page",
    body: "Use only the official OUR COIN link published on this website and our verified channels. Bookmark it.",
    img: sticker.crownGold,
  },
  {
    title: "Check everything, then decide",
    body: "Compare the token address with the one on this site, review the risks and the transaction details before deciding whether to trade.",
    img: sticker.starDoodle,
  },
];

export function HowToBuy() {
  const reduce = useReducedMotion();
  return (
    <section id="buy" className="relative overflow-hidden bg-royal py-24 text-cream sm:py-32" aria-labelledby="buy-title">
      <div className="rays absolute inset-0 opacity-40" aria-hidden />
      <Floaty src={sticker.arrowLoop} className="top-28 right-[8%] hidden w-24 md:block" rotate={8} slow />
      <Container className="relative">
        <Eyebrow n="06">how to buy</Eyebrow>
        <SplitHeadline
          id="buy-title"
          text="Four steps to the throne room."
          highlight={["throne"]}
          className="mt-6 max-w-4xl text-[clamp(2.6rem,7vw,6rem)] drop-shadow-[0_5px_0_var(--color-ink)]"
        />

        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.li
              key={s.title}
              initial={reduce ? false : { opacity: 0, y: 50, rotate: i % 2 ? 3 : -3 }}
              whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 1 : -1 }}
              whileHover={reduce ? undefined : { rotate: 0, y: -6 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ type: "spring", stiffness: 220, damping: 20, delay: i * 0.08 }}
              className="chunk relative bg-cream p-6 pt-16 text-ink"
            >
              <span className="display text-sticker absolute -top-8 left-5 text-7xl">{i + 1}</span>
              <img src={s.img} alt="" aria-hidden loading="lazy" className="absolute top-4 right-4 h-12 w-auto" />
              <h3 className="display text-[1.75rem] leading-[0.95]">{s.title}</h3>
              <p className="mt-3 leading-snug text-ink/80">{s.body}</p>
            </motion.li>
          ))}
        </ol>

        <div className="mt-16 grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <Reveal>
            <div className="chunk flex flex-col gap-6 bg-gold p-6 text-ink sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <p className="display text-4xl sm:text-5xl">Ready when you are.</p>
                <p className="mt-2 max-w-md font-medium text-ink/80">
                  The button goes to the official OUR COIN page on Pump.fun — and only there.
                </p>
              </div>
              <Button href={site.token.pumpFunUrl} variant="ink" size="lg" pendingLabel="Official link not live yet">
                Buy Our Coin
              </Button>
            </div>
            <div className="mt-6 flex gap-3 rounded-2xl border-[3px] border-dashed border-cream/50 p-4 text-cream/90">
              <ShieldAlert aria-hidden className="mt-0.5 size-6 shrink-0 text-gold" strokeWidth={2.5} />
              <p className="leading-snug">
                <strong className="text-gold">Stay safe.</strong> This website never asks you to connect a wallet to browse,
                and nobody from OUR COIN will ever ask for your seed phrase or private key. Anyone who does is a scammer.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="relative mx-auto hidden lg:block">
            <div className="chunk relative overflow-hidden bg-flame pt-6 shadow-[0_10px_0_0_var(--color-ink)] rotate-2">
              <div className="rays absolute inset-0" aria-hidden />
              <img src={damian.pointing} alt="Damian Dupont pointing at you" loading="lazy" className="relative h-72 w-auto" />
            </div>
            <img src={sticker.arrowCurve} alt="" aria-hidden className="absolute -top-10 -left-16 w-24 -scale-x-100 rotate-12" />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
