# OUR COIN — website

Memes with personality. Community with purpose. A one-page site for the OUR COIN meme coin (Solana), starring the fictional mascot **Damian Dupont**.

Stack: React 19 · TypeScript · Tailwind CSS 4 · Motion (Framer Motion) · Lucide icons · Vite.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build into dist/
npm run preview   # serve dist/ locally
```

## Deploy

### GitHub Pages (already set up)

`.github/workflows/deploy.yml` builds the site and publishes `dist/` on every push to `main` (and to the working branch).

One-time setting: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
Do **not** use "Deploy from a branch": that serves the un-built source code and the page stays blank blue.

The site is served from `https://<owner>.github.io/<repo>/`. The workflow passes that sub-path to Vite through `BASE_PATH`, so every asset URL is prefixed correctly.

### Other hosts

`dist/` is a fully static site. Vercel, Netlify and Cloudflare Pages all work: build command `npm run build`, output directory `dist`. On a root domain no `BASE_PATH` is needed.

Before going live, replace `https://ourcoin.example` with the real domain in `index.html` (canonical + Open Graph tags) and in `src/config/site.ts`.

## Where to put official information

**Everything official lives in [`src/config/site.ts`](src/config/site.ts).** Leave a value as `null` (or an empty list) and the site shows "To be announced" or "Pending verification", and the related buttons show as disabled "coming soon" controls. No link on the site is ever broken.

| Setting | Controls |
| --- | --- |
| `token.address` | Token address + copy button (Token section, footer) |
| `token.pumpFunUrl` | Every **Buy Our Coin** button |
| `token.ticker`, `supply`, `explorerUrl`, `creatorWallet` | Token information |
| `giving.allocation`, `eligibleRevenueSources`, `reportingSchedule` | Mission + disclosure sheet |
| `giving.treasuryWallet` | Disclosure sheet, Token section |
| `giving.organisations`, `donations`, `totalVerifiedDonations`, `completedInitiatives`, `latestReportUrl` | Impact dashboard / ledger |
| `giving.applicationUrl` | FAQ: "How can organisations apply" |
| `socials.x`, `socials.telegram`, `socials.other` | Community section + footer |

Only enter information that has been verified and approved for publication. The impact dashboard only shows numbers you put there. It never makes up data.

## Project structure

```
art/source/            original artwork + videos (the inputs)
scripts/
  build_assets.py      cuts the asset grid into transparent pieces, exports scenes, icons, OG image
  asset-boxes.json     crop boxes for every piece of the grid
  build_video.sh       encodes the animated logo for the preloader (MP4 + WebM + posters)
public/
  assets/damian/       12 cut-out Damian poses (webp, transparent)
  assets/stickers/     coins, crowns, doodles, icons, text stickers (webp, transparent)
  assets/scenes/       the full illustrations, responsive sizes
  assets/video/        preloader clip
  og-image.jpg, favicons, manifest
src/
  config/site.ts       ← all official links / addresses / disclosures
  lib/assets.ts        asset registry
  components/          Preloader, Nav, Button, shared UI (Reveal, SplitHeadline, CopyButton, Pending, Marquee…)
  sections/            Hero, MeetDamian, Mission, GivingFlow, Impact, HowToBuy, TokenInfo, Community, Faq, Footer
  index.css            design tokens (colours sampled from the artwork), type, textures
```

To rebuild the artwork (needs Python 3 with Pillow, numpy, scipy and PyTorch (CPU), plus ffmpeg):

```bash
# 1. 4x upscale of the asset grid (Real-ESRGAN x4plus anime 6B, CPU, ~4 min)
curl -LO https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.2.4/RealESRGAN_x4plus_anime_6B.pth
python3 scripts/upscale_esrgan.py RealESRGAN_x4plus_anime_6B.pth <grid-with-separator-removed.png> /tmp/grid_x4.png
# 2. transfer the original paper grain back, then cut every piece (cached in art/derived/)
python3 scripts/build_assets.py --grain /tmp/grid_x4.png
# 3. preloader clip
./scripts/build_video.sh
```

Cut-outs are keyed in 4x space: the background colour is sampled from each crop's border, only blue regions
connected to the border (or enclosed gaps) are removed, so blue *inside* an object (globe oceans, reflections)
is kept. Edges are soft-matted, de-spilled and exported at 2x the sheet resolution.

## Design notes

- **Palette** is sampled from the illustrations: royal blue `#2d8afc`, crown gold, trouser flame orange, fur-coat cream, vest navy (used as the ink colour), hair green.
- **House shape:** chunky ink outlines with hard offset shadows, like stickers. Buttons squish down when pressed (taken from the tactile "Copy" button in the style reference). The giving flow uses outlined chevrons. Cream sections carry a faint pattern of Damian's coat spots.
- **Type:** Bricolage Grotesque (condensed and heavy for display, normal for body) plus Permanent Marker for hand-written notes. Both are self-hosted.
- **Motion:** mandatory animated-logo intro (no skip; falls back automatically if the video can’t play), preloader curtain, staggered hero entrance, parallax on the illustrations, word-by-word headline reveals, floating stickers, spring hover/tap on cards, marquee. `prefers-reduced-motion` is respected throughout. The preloader then shows a still frame for under a second.
- **Accessibility:** skip link, keyboard-operable menu (Esc closes it, focus stays inside), accessible accordion, visible focus rings, alt text on every meaningful image, decorative images hidden from screen readers.
- **Safety:** no wallet connection, no form fields, no request for keys or seed phrases anywhere.

## Missing before launch

**Information**
- [ ] Verified token address (mint), ticker, supply
- [ ] Exact official Pump.fun URL (and an explorer link if wanted)
- [ ] Charitable allocation percentage, eligible revenue sources, distribution rules (approved and published)
- [ ] Treasury wallet, creator wallet disclosure
- [ ] Beneficiary organisations, reporting schedule, application process/URL
- [ ] Official X / Telegram / other channel links, contact email
- [ ] Production domain (index.html + config)
- [ ] Legal review of the risk notice and disclosures for your target jurisdictions

**Artwork (optional upgrades)**
- [ ] Native high-resolution, transparent versions of the poses. The cut-outs are AI-upscaled from a 1536×1024 sheet (about 400–600 px tall now); original masters would be sharper still.
- [ ] Full-body versions of the half-body poses (heart, pointing, shrug, thinking, laughing, coffee), so they can stand freely instead of sitting in frames.
- [ ] A dedicated "Damian waving / welcoming" pose for the community section, and a "Damian handing over a gift" pose for charity. Prompt idea: *"Damian Dupont — same flat 2D textured style, gold five-point crown, sculptural green hair, black sunglasses, nose ring, cream fur coat with black spots, navy vest, orange flared trousers — warmly handing a gift box tied with a gold ribbon to the viewer, plain electric-blue #2D8AFC background, full body, centred"*.
- [ ] A vector (SVG) wordmark / logo.
