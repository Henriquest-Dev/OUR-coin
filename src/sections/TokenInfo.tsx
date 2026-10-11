import { ExternalLink } from "lucide-react";
import { site } from "../config/site";
import { sticker } from "../lib/assets";
import { Container, CopyButton, Eyebrow, Pending, Reveal, SplitHeadline } from "../components/ui";

export function TokenInfo() {
  const t = site.token;
  const rows: [string, React.ReactNode][] = [
    ["Token name", <span className="font-display text-xl font-bold">{t.name}</span>],
    ["Ticker", t.ticker ? <span className="font-display text-xl font-bold">${t.ticker}</span> : <Pending />],
    ["Blockchain", <span className="font-display text-xl font-bold">{t.chain}</span>],
    ["Token supply", t.supply ? <span className="font-display text-xl font-bold">{t.supply}</span> : <Pending>To be confirmed</Pending>],
    [
      "Official trading link",
      t.pumpFunUrl ? (
        <a href={t.pumpFunUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold break-all underline">
          {t.pumpFunUrl.replace(/^https?:\/\//, "")} <ExternalLink aria-hidden className="size-4 shrink-0" />
        </a>
      ) : (
        <Pending />
      ),
    ],
    [
      "Creator wallet",
      t.creatorWallet ? <code className="font-mono text-sm break-all">{t.creatorWallet}</code> : <Pending>Pending verification</Pending>,
    ],
    [
      "Treasury wallet",
      site.giving.treasuryWallet ? (
        <code className="font-mono text-sm break-all">{site.giving.treasuryWallet}</code>
      ) : (
        <Pending>Pending verification</Pending>
      ),
    ],
  ];

  return (
    <section id="token" className="fur relative overflow-hidden py-24 sm:py-32" aria-labelledby="token-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow n="07" tone="flame">token information</Eyebrow>
            <SplitHeadline id="token-title" text="The fine print, but royal." highlight={["royal"]} className="mt-6 text-[clamp(2.6rem,6vw,5rem)]" />
            <Reveal>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/80">
                Only trust the address shown here and on our verified channels. Copycat tokens love a famous face — check
                every character before you trade.
              </p>
              <div className="relative mt-10 hidden h-56 lg:block" aria-hidden>
                <img src={sticker.coinFront} alt="" className="animate-float absolute top-0 left-6 w-40" />
                <img src={sticker.coinTilt} alt="" className="animate-float-slow absolute top-16 left-44 w-28" style={{ animationDelay: "1s" }} />
                <img src={sticker.ourCoin} alt="" className="absolute top-2 left-72 w-28 rotate-6" />
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="chunk overflow-hidden bg-cream shadow-[0_10px_0_0_var(--color-ink)]">
              {/* contract address */}
              <div className="border-b-[3px] border-ink bg-ink p-6 text-cream sm:p-8">
                <p className="text-sm font-bold tracking-widest text-cream/60 uppercase">Verified token address</p>
                {t.address ? (
                  <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <code className="min-w-0 flex-1 rounded-2xl border-[3px] border-cream/20 bg-royal-night px-4 py-3 font-mono text-sm break-all sm:text-base">
                      {t.address}
                    </code>
                    <CopyButton value={t.address} />
                  </div>
                ) : (
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="display text-3xl text-gold">Not published yet</p>
                    <Pending tone="dark">Will appear here at launch</Pending>
                  </div>
                )}
                {t.explorerUrl && (
                  <a href={t.explorerUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-gold underline">
                    View on explorer <ExternalLink aria-hidden className="size-4" />
                  </a>
                )}
              </div>
              <dl className="divide-y-2 divide-dashed divide-ink/20 px-6 sm:px-8">
                {rows.map(([k, v]) => (
                  <div key={k} className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:items-center">
                    <dt className="font-semibold text-ink/65">{k}</dt>
                    <dd className="min-w-0">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="border-t-[3px] border-ink bg-cream-deep px-6 py-5 text-sm leading-relaxed text-ink/75 sm:px-8">
                <strong>Disclosures.</strong> No tokenomics, liquidity locks, burns, ownership renunciation or guarantees are
                claimed unless they are published here with verifiable on-chain proof. OUR COIN is a meme token with no
                intrinsic value or expectation of financial return.
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
