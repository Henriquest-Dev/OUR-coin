import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { site } from "../config/site";
import { damian } from "../lib/assets";
import { Container, Eyebrow, Reveal, SplitHeadline } from "../components/ui";

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "What is OUR COIN?",
    a: "OUR COIN is a community-driven meme coin on Solana, fronted by the fictional mascot Damian Dupont. It’s built around internet culture — with the stated ambition of directing a disclosed share of eligible project revenue to charitable causes.",
  },
  {
    q: "Who is Damian Dupont?",
    a: "Damian is a fictional character: the loud, stylish, unexpectedly generous face of the project. He is not a real person, does not manage any money and does not give financial advice (he can barely manage his coat).",
  },
  {
    q: "How do I buy the token?",
    a: (
      <>
        Set up a compatible Solana wallet, add SOL for the trade and fees, then open the official OUR COIN page on Pump.fun
        using only the link on this website. Check the token address against the one in the <a href="#token" className="font-bold underline">Token</a>{" "}
        section before doing anything. The full walkthrough is in <a href="#buy" className="font-bold underline">How to buy</a>.
      </>
    ),
  },
  {
    q: "Does buying OUR COIN count as a donation?",
    a: "No. Buying or selling the token is a trade between market participants, not a donation, and it is not tax-deductible. The price you pay, trading volume and market value are not transferred to charity.",
  },
  {
    q: "How will charitable contributions be funded?",
    a: "From a clearly disclosed portion of eligible project revenue. The exact percentage, which revenue sources count, the recipients and the distribution rules will be approved and published before any definitive claims are made. Until then they are marked “To be announced”.",
  },
  {
    q: "Where can I verify donations?",
    a: (
      <>
        In the <a href="#impact" className="font-bold underline">Impact ledger</a> on this page. Each verified donation is
        meant to be listed with its date, recipient, on-chain transaction link and proof of receipt. Right now it’s empty —
        because no donations have been made yet.
      </>
    ),
  },
  {
    q: "What are the risks of trading a meme coin?",
    a: "Meme coins are extremely volatile and speculative. Prices can drop to zero, liquidity can disappear, scams and copycat tokens are common, and transactions on a blockchain are irreversible. Only use money you can afford to lose entirely, do your own research and consider independent professional advice. Nothing on this site is financial advice.",
  },
  {
    q: "How can organisations apply for support?",
    a: site.giving.applicationUrl ? (
      <>
        Charities and community initiatives can apply through the{" "}
        <a href={site.giving.applicationUrl} target="_blank" rel="noopener noreferrer" className="font-bold underline">
          official application form
        </a>
        .
      </>
    ) : (
      "The application process, eligibility criteria and selection rules will be published here before the first allocation. Follow our verified channels so you don’t miss it."
    ),
  },
];

function Item({ q, a, open, onToggle }: { q: string; a: React.ReactNode; open: boolean; onToggle: () => void }) {
  const id = useId();
  return (
    <li className={`chunk overflow-hidden transition-colors duration-300 ${open ? "bg-gold" : "bg-cream"}`}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-7"
        >
          <span className="display text-[1.5rem] leading-[1] sm:text-[1.9rem]">{q}</span>
          <span
            className={`grid size-10 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-cream transition-transform duration-300 ${open ? "rotate-45" : ""}`}
          >
            <Plus aria-hidden strokeWidth={3} className="size-5" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-5 pb-6 text-lg leading-relaxed text-ink/85 sm:px-7">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="fur relative overflow-hidden py-24 sm:py-32" aria-labelledby="faq-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow n="09" tone="flame">questions, answered</Eyebrow>
            <SplitHeadline id="faq-title" text="Ask the king." highlight={["king"]} className="mt-6 text-[clamp(2.8rem,7vw,6rem)]" />
            <Reveal>
              <p className="mt-6 max-w-sm text-lg text-ink/75">Straight answers. No price predictions. No “trust me bro”.</p>
              <div className="chunk relative mt-10 hidden w-80 overflow-hidden bg-royal pt-6 lg:block -rotate-2">
                <div className="rays absolute inset-0" aria-hidden />
                <img src={damian.shrug} alt="Damian Dupont shrugging" loading="lazy" className="relative mx-auto w-[92%]" />
              </div>
            </Reveal>
          </div>
          <ul className="flex flex-col gap-4">
            {FAQS.map((f, i) => (
              <Item key={f.q} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
