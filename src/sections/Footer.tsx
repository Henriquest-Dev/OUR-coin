import { ArrowUp } from "lucide-react";
import { site } from "../config/site";
import { damian, sticker } from "../lib/assets";
import { NAV_LINKS } from "../components/Nav";
import { Container, CopyButton, Pending } from "../components/ui";

function FooterLink({ href, children }: { href: string | null; children: React.ReactNode }) {
  if (!href) return <span className="text-cream/50">{children} · soon</span>;
  const ext = /^https?:/.test(href);
  return (
    <a href={href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="font-semibold text-cream transition hover:text-gold">
      {children}
    </a>
  );
}

export function Footer() {
  const t = site.token;
  return (
    <footer className="relative bg-royal-deep text-cream" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">Footer</h2>
      <div className="relative border-y-[3px] border-ink bg-gold py-10 text-ink">
        <img
          src={damian.throne}
          alt=""
          aria-hidden
          loading="lazy"
          className="pointer-events-none absolute bottom-0 left-[52%] hidden h-56 w-auto -translate-x-1/2 lg:block xl:left-[58%]"
        />
        <Container className="relative flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <p className="display text-[clamp(2rem,5vw,3.5rem)]">Born to meme. Built to give.</p>
          <a
            href="#top"
            className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-cream px-5 py-3 font-display font-extrabold uppercase shadow-[0_5px_0_0_var(--color-ink)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
          >
            Back to the throne <ArrowUp aria-hidden className="size-5" strokeWidth={3} />
          </a>
        </Container>
      </div>

      <Container className="relative py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <img src={sticker.crownGold} alt="" className="h-9 w-auto" />
              <p className="display text-3xl">
                Our<span className="text-gold">Coin</span>
              </p>
            </div>
            <p className="mt-4 max-w-xs text-cream/75">
              Memes with personality. Community with purpose. Starring Damian Dupont, a 100% fictional king.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="font-display text-sm font-extrabold tracking-widest text-gold uppercase">Explore</p>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="font-display text-sm font-extrabold tracking-widest text-gold uppercase">Token</p>
            <ul className="mt-4 space-y-2 text-cream/85">
              <li>
                {t.name}
                {t.ticker ? ` · $${t.ticker}` : ""} · {t.chain}
              </li>
              <li>
                {t.address ? (
                  <span className="flex flex-col items-start gap-2">
                    <code className="font-mono text-xs break-all">{t.address}</code>
                    <CopyButton value={t.address} label="Copy address" />
                  </span>
                ) : (
                  <Pending tone="dark">Address to be announced</Pending>
                )}
              </li>
              <li>
                <FooterLink href={t.pumpFunUrl}>Official Pump.fun page</FooterLink>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-display text-sm font-extrabold tracking-widest text-gold uppercase">Community</p>
            <ul className="mt-4 space-y-2">
              <li><FooterLink href={site.socials.x}>X / Twitter</FooterLink></li>
              <li><FooterLink href={site.socials.telegram}>Telegram</FooterLink></li>
              {site.socials.other.map((o) => (
                <li key={o.url}><FooterLink href={o.url}>{o.label}</FooterLink></li>
              ))}
              {site.contactEmail && (
                <li><FooterLink href={`mailto:${site.contactEmail}`}>{site.contactEmail}</FooterLink></li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 grid gap-6 rounded-[1.75rem] border-[3px] border-cream/20 p-6 text-sm leading-relaxed text-cream/75 sm:p-8 lg:grid-cols-2">
          <div>
            <p className="font-display text-base font-extrabold text-gold uppercase">Financial risk notice</p>
            <p className="mt-2">
              OUR COIN is a meme token for entertainment and community purposes. It has no intrinsic value, carries no rights,
              and there is no expectation of profit or financial return. Crypto-assets are highly volatile and largely
              unregulated; you could lose all of the money you use. Nothing on this website is financial, investment, legal or
              tax advice. Check the rules that apply where you live and only trade what you can afford to lose.
            </p>
          </div>
          <div>
            <p className="font-display text-base font-extrabold text-gold uppercase">Project disclosures</p>
            <p className="mt-2">
              Buying OUR COIN is not a donation. Charitable contributions are intended to come from a disclosed portion of
              eligible project revenue only; the percentage, revenue sources, recipients and rules are to be announced and
              will be published before any definitive claims. Damian Dupont is a fictional character and does not manage any
              funds. This site never asks for wallet connections, seed phrases or private keys.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 text-sm text-cream/60 sm:flex-row">
          <p>© {new Date().getFullYear()} OUR COIN. All memes reserved.</p>
          <p className="marker text-base text-gold">long live the meme ♥</p>
        </div>
      </Container>
    </footer>
  );
}
