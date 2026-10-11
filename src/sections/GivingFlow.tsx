import { motion, useReducedMotion } from "motion/react";
import { ArrowLeftRight, Landmark } from "lucide-react";
import { PENDING, site, TBA } from "../config/site";
import { sticker } from "../lib/assets";
import { Container, CopyButton, Eyebrow, Pending, Reveal, SplitHeadline } from "../components/ui";

const STEPS = [
  { img: sticker.megaphone, title: "Community activity", body: "Memes, raids, culture. The energy that keeps the project alive." },
  { img: sticker.moneyBag, title: "Eligible project revenue", body: "Only revenue the project itself earns from published, eligible sources." },
  { img: sticker.crownGold, title: "Published allocation", body: "A disclosed share of that revenue is set aside — the rules are public first." },
  { img: sticker.handshake, title: "Verified donations", body: "Funds go to approved organisations, each with an on-chain reference." },
  { img: sticker.globeHeart, title: "Public reporting", body: "Receipts and reports published on a fixed, announced schedule." },
];

function Value({ value, fallback = TBA }: { value: string | null; fallback?: string }) {
  return value ? <span className="font-display font-bold break-all">{value}</span> : <Pending>{fallback}</Pending>;
}

export function GivingFlow() {
  const reduce = useReducedMotion();
  const g = site.giving;
  const rows: { label: string; node: React.ReactNode }[] = [
    { label: "Charitable allocation percentage", node: <Value value={g.allocation} /> },
    {
      label: "Eligible revenue sources",
      node: g.eligibleRevenueSources.length ? (
        <span className="font-display font-bold">{g.eligibleRevenueSources.join(" · ")}</span>
      ) : (
        <Pending />
      ),
    },
    {
      label: "Treasury wallet address",
      node: g.treasuryWallet ? (
        <span className="flex flex-wrap items-center gap-3">
          <code className="font-mono text-sm break-all">{g.treasuryWallet}</code>
          <CopyButton value={g.treasuryWallet} />
        </span>
      ) : (
        <Pending />
      ),
    },
    {
      label: "Beneficiary organisations",
      node: g.organisations.length ? (
        <span className="font-display font-bold">{g.organisations.map((o) => o.name).join(" · ")}</span>
      ) : (
        <Pending />
      ),
    },
    {
      label: "Donation transaction references",
      node: g.donations.length ? <a href="#impact" className="font-bold underline">See the impact ledger</a> : <Pending>{PENDING}</Pending>,
    },
    {
      label: "Proof of receipt",
      node: g.donations.some((d) => d.receiptUrl) ? <a href="#impact" className="font-bold underline">See the impact ledger</a> : <Pending>{PENDING}</Pending>,
    },
    { label: "Reporting schedule", node: <Value value={g.reportingSchedule} /> },
  ];

  return (
    <section id="giving" className="fur relative overflow-hidden py-24 sm:py-32" aria-labelledby="giving-title">
      <Container>
        <Eyebrow n="04" tone="flame">how the giving works</Eyebrow>
        <SplitHeadline
          id="giving-title"
          text="From meme energy to real receipts."
          highlight={["receipts"]}
          className="mt-6 max-w-4xl text-[clamp(2.6rem,7vw,6rem)]"
        />
        <Reveal>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/80">
            Five steps, no magic. Here’s how a meme coin community can fund real-world good without pretending every trade
            is charity.
          </p>
        </Reveal>

        {/* chevron flow */}
        <ol className="mt-14 grid gap-4 [--chev:polygon(0_0,calc(100%-28px)_0,100%_50%,calc(100%-28px)_100%,0_100%,28px_50%)] [--chev-first:polygon(0_0,calc(100%-28px)_0,100%_50%,calc(100%-28px)_100%,0_100%)] md:grid-cols-5 md:gap-0">
          {STEPS.map((s, i) => (
            <motion.li
              key={s.title}
              className={`relative ${i ? "md:-ml-[22px]" : ""}`}
              initial={reduce ? false : { opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* outer = ink outline, inner = fill; both share the chevron shape on md+ */}
              <div className={`h-full rounded-3xl bg-ink p-[3px] md:rounded-none ${i === 0 ? "md:[clip-path:var(--chev-first)]" : "md:[clip-path:var(--chev)]"}`}>
                <div
                  className={`flex h-full gap-4 rounded-[1.35rem] p-5 md:flex-col md:rounded-none md:pr-10 ${i === 0 ? "md:pl-6 md:[clip-path:var(--chev-first)]" : "md:pl-11 md:[clip-path:var(--chev)]"} ${
                    i % 2 ? "bg-gold" : "bg-cream"
                  }`}
                >
                  <span className="font-display text-sm font-extrabold text-flame">0{i + 1}</span>
                  <img src={s.img} alt="" aria-hidden loading="lazy" className="h-14 w-14 shrink-0 object-contain md:h-16 md:w-auto md:self-start" />
                  <div>
                    <h3 className="display text-[1.45rem] leading-[0.95] lg:text-[1.6rem]">{s.title}</h3>
                    <p className="mt-2 text-[0.95rem] leading-snug text-ink/80">{s.body}</p>
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </ol>

        {/* trading vs revenue */}
        <Reveal className="mt-16">
          <div className="chunk grid overflow-hidden bg-cream md:grid-cols-[1fr_auto_1fr]">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl border-[3px] border-ink bg-royal text-cream">
                  <ArrowLeftRight aria-hidden strokeWidth={2.75} />
                </span>
                <h3 className="display text-3xl">Token trading</h3>
              </div>
              <p className="mt-3 leading-relaxed text-ink/80">
                Buying and selling OUR COIN happens between traders on the market. <strong>It is not a donation.</strong> The
                price you pay, the trading volume and the market value are not transferred to charity.
              </p>
            </div>
            <div className="flex items-center justify-center border-y-[3px] border-ink bg-ink px-6 py-3 md:border-x-[3px] md:border-y-0">
              <span className="display text-3xl text-gold">≠</span>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl border-[3px] border-ink bg-gold">
                  <Landmark aria-hidden strokeWidth={2.75} />
                </span>
                <h3 className="display text-3xl">Project revenue</h3>
              </div>
              <p className="mt-3 leading-relaxed text-ink/80">
                Income the project itself earns from eligible sources, which will be listed publicly. A disclosed share of{" "}
                <em>this</em> is what funds charitable giving.
              </p>
            </div>
          </div>
        </Reveal>

        {/* disclosure sheet */}
        <Reveal className="mt-10">
          <div className="chunk bg-cream p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="display text-3xl">The disclosure sheet</h3>
              <p className="text-sm font-semibold text-ink/60">Filled in only with approved, verifiable information.</p>
            </div>
            <dl className="mt-6 divide-y-2 divide-dashed divide-ink/20">
              {rows.map((r) => (
                <div key={r.label} className="grid gap-2 py-3 sm:grid-cols-[18rem_1fr] sm:items-center">
                  <dt className="font-semibold text-ink/70">{r.label}</dt>
                  <dd>{r.node}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
