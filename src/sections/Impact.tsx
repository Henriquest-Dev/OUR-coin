import { ExternalLink } from "lucide-react";
import { site } from "../config/site";
import { damian, sticker } from "../lib/assets";
import { Button } from "../components/Button";
import { Container, Eyebrow, Floaty, Reveal, SplitHeadline } from "../components/ui";

export function Impact() {
  const g = site.giving;
  const launched = g.donations.length > 0;
  const metrics = [
    { label: "Total verified donations", value: g.totalVerifiedDonations ?? "—", img: sticker.coinStack },
    { label: "Organisations supported", value: g.organisations.length ? String(g.organisations.length) : "—", img: sticker.handshake },
    { label: "Completed initiatives", value: g.completedInitiatives ? String(g.completedInitiatives) : "—", img: sticker.crownJewel },
    { label: "Published transactions", value: launched ? String(g.donations.length) : "—", img: sticker.globeHeart },
  ];

  return (
    <section id="impact" className="relative overflow-hidden bg-ink py-24 text-cream sm:py-32" aria-labelledby="impact-title">
      <Floaty src={sticker.sparkle} className="top-24 right-[12%] w-10" />
      <Floaty src={sticker.crownSketch2} className="bottom-20 left-[4%] hidden w-24 opacity-80 md:block" rotate={-10} slow />
      <Container className="relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow n="05">the impact ledger</Eyebrow>
            <SplitHeadline
              id="impact-title"
              text="Count it. Check it. Publish it."
              highlight={["publish"]}
              className="mt-6 max-w-4xl text-[clamp(2.6rem,7vw,6rem)]"
            />
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border-[3px] border-gold px-4 py-2 font-display text-sm font-extrabold tracking-wider text-gold uppercase">
            <span className={`size-2.5 rounded-full ${launched ? "bg-[#3ddc84]" : "animate-pulse bg-gold"}`} aria-hidden />
            {launched ? "Live data" : "Launch state · no data yet"}
          </span>
        </div>

        <Reveal>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/80">
            This dashboard only shows numbers backed by public transactions and receipts. Until the first verified donation
            happens, it stays honestly empty — no placeholder heroics, no made-up stats.
          </p>
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <Reveal as="li" key={m.label} delay={i * 0.07}>
              <div className="group relative h-full overflow-hidden rounded-[1.75rem] border-[3px] border-cream/15 bg-royal-night p-6 transition-colors hover:border-gold">
                <img
                  src={m.img}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="absolute -right-3 -bottom-3 h-24 w-auto opacity-25 transition-all duration-500 group-hover:scale-110 group-hover:opacity-60"
                />
                <p className="text-sm font-bold tracking-widest text-cream/60 uppercase">{m.label}</p>
                <p className="display mt-4 text-6xl text-gold">{m.value}</p>
                {m.value === "—" && <p className="mt-2 text-sm text-cream/60">Awaiting first verified report</p>}
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-8">
          <div className="overflow-hidden rounded-[1.75rem] border-[3px] border-cream/15 bg-royal-night">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-[3px] border-cream/10 px-6 py-4">
              <h3 className="display text-2xl">Public transaction history</h3>
              {g.latestReportUrl && (
                <a href={g.latestReportUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-gold underline">
                  Latest report <ExternalLink aria-hidden className="size-4" />
                </a>
              )}
            </div>
            {launched ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[40rem] text-left">
                  <thead className="text-xs tracking-widest text-cream/55 uppercase">
                    <tr>
                      <th scope="col" className="px-6 py-3">Date</th>
                      <th scope="col" className="px-6 py-3">Recipient</th>
                      <th scope="col" className="px-6 py-3">Amount</th>
                      <th scope="col" className="px-6 py-3">Transaction</th>
                      <th scope="col" className="px-6 py-3">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream/10">
                    {g.donations.map((d) => (
                      <tr key={d.txUrl}>
                        <td className="px-6 py-4 font-mono text-sm">{d.date}</td>
                        <td className="px-6 py-4 font-semibold">{d.recipient}</td>
                        <td className="px-6 py-4 font-display font-bold text-gold">{d.amount}</td>
                        <td className="px-6 py-4">
                          <a href={d.txUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline">
                            View <ExternalLink aria-hidden className="size-3.5" />
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          {d.receiptUrl ? (
                            <a href={d.receiptUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline">
                              Proof <ExternalLink aria-hidden className="size-3.5" />
                            </a>
                          ) : (
                            <span className="text-cream/50">Pending verification</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid items-center gap-6 px-6 py-8 sm:grid-cols-[auto_1fr] sm:px-8">
                <img src={damian.thinking} alt="Damian Dupont thinking" loading="lazy" className="mx-auto h-40 w-auto" />
                <div>
                  <p className="display text-3xl text-gold">Nothing here yet. On purpose.</p>
                  <p className="mt-2 max-w-xl leading-relaxed text-cream/75">
                    No donations have been made or verified yet, and we won’t pretend otherwise. The first verified transfer
                    will appear here with its date, recipient, on-chain transaction link and proof of receipt.
                  </p>
                  <div className="mt-5">
                    <Button href="#giving" variant="ghost">
                      See how giving will work
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
