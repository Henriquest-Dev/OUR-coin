import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { site } from "../config/site";
import { scenes, sticker } from "../lib/assets";
import { Button } from "../components/Button";
import { Floaty, Marquee } from "../components/ui";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 40 },
          animate: ready ? { opacity: 1, y: 0 } : {},
          transition: { duration: 0.9, delay, ease: EASE },
        };

  return (
    <>
      <section
        id="top"
        ref={ref}
        className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-royal pt-28 sm:pt-32"
        aria-labelledby="hero-title"
      >
        <div className="rays absolute inset-0 -z-10 opacity-70" aria-hidden />

        {/* floating decoration */}
        <div aria-hidden className="absolute inset-0 -z-10">
          <Floaty src={sticker.crownSketch} className="top-[18%] left-[4%] w-16 sm:w-24" rotate={-14} />
          <Floaty src={sticker.crownSketch2} className="top-[14%] right-[5%] w-20 sm:w-28" rotate={12} delay={1.2} slow />
          <Floaty src={sticker.coinTilt} className="top-[46%] left-[6%] hidden w-20 md:block" rotate={-20} delay={0.6} />
          <Floaty src={sticker.coinTilt2} className="top-[40%] right-[7%] hidden w-16 md:block" rotate={18} delay={2} slow />
          <Floaty src={sticker.sparkle} className="top-[34%] left-[3%] w-8 sm:top-[30%] sm:left-[22%] sm:w-10" delay={0.3} />
          <Floaty src={sticker.sparkleSmall} className="top-[26%] right-[24%] w-6" delay={1.6} />
          <Floaty src={sticker.starDoodle} className="top-[58%] right-[18%] hidden w-10 sm:block" rotate={10} delay={0.9} />
        </div>

        <motion.div style={{ y: textY, opacity: fade }} className="relative z-10 mx-auto w-full max-w-6xl px-4 text-center sm:px-6">
          <motion.p {...enter(0.05)} className="marker mb-4 text-lg text-gold sm:text-2xl">
            <span className="inline-block -rotate-2">Memes with personality. Community with purpose.</span>
          </motion.p>

          <motion.h1
            id="hero-title"
            {...enter(0.15)}
            className="display text-[clamp(3.1rem,11.5vw,9.5rem)] text-cream drop-shadow-[0_6px_0_var(--color-ink)]"
          >
            The king of memes
            <br />
            has a{" "}
            <span className="relative inline-block text-gold">
              heart
              <img
                src={sticker.heart}
                alt=""
                aria-hidden
                className="animate-wiggle absolute -top-[0.28em] -right-[0.42em] h-[0.62em] w-auto"
              />
            </span>
            .
          </motion.h1>

          <motion.p
            {...enter(0.3)}
            className="mx-auto mt-6 max-w-2xl text-lg leading-snug font-medium text-cream/95 sm:text-xl"
          >
            Meet <strong className="font-extrabold text-gold">OUR COIN</strong>. A community-driven meme coin with a bigger
            ambition: turning internet energy into real-world good.
          </motion.p>

          <motion.div {...enter(0.45)} className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href={site.token.pumpFunUrl} size="lg" pendingLabel="Soon on Pump.fun">
              Buy Our Coin
            </Button>
            <Button href="#mission" variant="cream" size="lg">
              Discover our mission
            </Button>
          </motion.div>
        </motion.div>

        {/* Damian on his pile of coins — the supplied full illustration */}
        <motion.div style={{ y: sceneY }} className="relative mt-auto w-full">
          <motion.picture
            initial={reduce ? false : { opacity: 0, y: 120, scale: 1.04 }}
            animate={ready ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.1, ease: EASE }}
            className="block"
          >
            <source media="(min-width: 768px)" srcSet={scenes.recliningWide.srcSet} sizes="100vw" />
            <img
              src={scenes.recliningSquare.src}
              srcSet={scenes.recliningSquare.srcSet}
              sizes="100vw"
              alt="Damian Dupont, the OUR COIN mascot, reclining on a mountain of gold crown coins"
              fetchPriority="high"
              className="mx-auto -mt-6 block aspect-square w-full max-w-[34rem] object-cover md:mt-[-4vw] md:aspect-[2056/765] md:max-w-none"
            />
          </motion.picture>
        </motion.div>
      </section>

      <div className="pointer-events-none relative z-10 -my-6 overflow-hidden py-6">
        <Marquee
          className="-ml-[5%] w-[110%] -rotate-1 bg-gold text-ink"
          items={["Born to meme", "Built to give", "Too much personality", "Community with purpose", "Long live the meme"]}
        />
      </div>
    </>
  );
}
