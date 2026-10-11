/**
 * ─────────────────────────────────────────────────────────────
 *  OUR COIN — single source of truth for every official value.
 * ─────────────────────────────────────────────────────────────
 *
 *  Anything left as `null` renders as "To be announced" / "Pending
 *  verification" on the site, and the related buttons render as
 *  disabled "coming soon" controls instead of broken links.
 *
 *  NEVER fill these with guesses. Only paste values that have been
 *  verified and approved for public disclosure.
 */

export type Organisation = {
  name: string;
  url: string;
  /** what the organisation does, one short line */
  focus: string;
};

export type Donation = {
  date: string; // ISO date, e.g. "2026-12-01"
  recipient: string;
  amount: string; // display string incl. unit, e.g. "12.5 SOL"
  txUrl: string; // explorer link to the on-chain transaction
  receiptUrl?: string; // public proof of receipt from the recipient
};

export const site = {
  name: "OUR COIN",
  url: "https://ourcoin.example", // ← replace with the production domain (also in index.html)

  token: {
    name: "OUR COIN",
    ticker: null as string | null, // e.g. "OUR" (without $)
    chain: "Solana",
    /** Verified mint / contract address. */
    address: null as string | null,
    /** Exact official Pump.fun page for the token. */
    pumpFunUrl: null as string | null,
    /** Optional: explorer page for the mint, e.g. Solscan. */
    explorerUrl: null as string | null,
    supply: null as string | null, // e.g. "1,000,000,000"
    creatorWallet: null as string | null,
  },

  giving: {
    /** Published charitable allocation, e.g. "XX% of eligible project revenue". */
    allocation: null as string | null,
    /** Which revenue streams count as eligible, once approved. */
    eligibleRevenueSources: [] as string[],
    treasuryWallet: null as string | null,
    treasuryExplorerUrl: null as string | null,
    reportingSchedule: null as string | null, // e.g. "Quarterly, first week of each quarter"
    organisations: [] as Organisation[],
    donations: [] as Donation[],
    /** Display string for the verified total, e.g. "48.2 SOL". Update only from published reports. */
    totalVerifiedDonations: null as string | null,
    completedInitiatives: 0 as number,
    /** Link to the latest public impact report, once published. */
    latestReportUrl: null as string | null,
    /** Where charities / community groups can apply for support. */
    applicationUrl: null as string | null,
  },

  socials: {
    x: null as string | null, // e.g. "https://x.com/ourcoin"
    telegram: null as string | null,
    other: [] as { label: string; url: string }[],
  },

  contactEmail: null as string | null,
} as const;

export const TBA = "To be announced";
export const PENDING = "Pending verification";
