# PKHosting VPS Pricing

A static one-page PKHosting VPS pricing page, built for the TechAbout assessment. Plain HTML, CSS and JS, with no framework, no build step and no external requests.

## Run it

Open `index.html` in a browser. It works from `file://` and offline.

Tests: `node tests/pricing.test.js` (plain node script, exits non-zero on failure). It passes. It covers `js/pricing.js` only:

- Annual prices for all four plans: per-month figure, total billed, amount saved and savings percent (Growth: 4,000 a month, 48,000 billed, 9,600 saved, 17%).
- Monthly prices have no saving and are unchanged.
- Formatting and conversion: Growth in USD ($17.24) and GBP (£13.52), Dedicated Core in PKR (Rs 19,500), its annual total in PKR (195,000), the Growth annual total in USD (172.35, converted directly) and the Dedicated Core annual per-month figure in GBP (45.77).
- The currency and period validators accept valid values and reject EUR, "weekly", undefined and null.

## Structure

```
index.html               The page: header, hero, plan cards, comparison table, FAQ, footer
css/style.css            All styles
js/pricing.js            Pricing maths only, no DOM. Also loadable from node
js/app.js                DOM, events, localStorage
tests/pricing.test.js    Tests for js/pricing.js
assets/                  Two payment logos (JazzCash, Easypaisa), PNG
docs/                    Lighthouse report and screenshots at 360, 768 and 1440px
NOTES.md                 Observations on the live site and design trade-offs
CLAUDE.md                Project instructions used with Claude Code
```

## How pricing works

- Each plan card carries `data-monthly` in the HTML. That value is the single source of truth, and `js/app.js` reads it.
- The monthly PKR prices and the full comparison table are written in the HTML, so they show with JavaScript off.
- Annual billing charges 10 months for 12. The annual total is monthly x 10, and the per-month figure shown is monthly x 10 / 12.
- USD and GBP are converted from PKR at display time, at fixed rates of 278.50 PKR per USD and 355.00 PKR per GBP. Values are rounded only when formatted: whole numbers for PKR, two decimals for USD and GBP.
- The savings percentage on the Annually button is computed in JS (`getSavingsPercent`), not typed.
- The chosen currency and billing period are saved in localStorage and checked against an allowlist when loaded.

## Decisions and trade-offs

- **State persistence:** currency and billing period are kept in localStorage, with try/catch and an allowlist check on load. The cost is that choices are per browser, and a bad value silently falls back to PKR and monthly.
- **Currency selector placement:** always visible in the header, not inside the hamburger menu, because it changes every price on the page.
- **Plan grid:** four columns from 1200px instead of 3+1, so no card is left alone on its row.
- **Payment methods:** kept bank transfer, JazzCash, Easypaisa and card. Left out Stripe (a processor, not a buyer's choice) and PayPal (scope choice).
- **Fonts:** system font stack, because web fonts would break the zero-external-requests rule.

Full reasoning, and my six observations on the live pricing section, are in NOTES.md.

## Browsers tested

Tested: Chrome and Firefox (desktop). Not tested: Safari and real mobile devices.

## Lighthouse

Report: [docs/lighthouse-report.html](docs/lighthouse-report.html). Lighthouse 13.4.1, mobile, simulated throttling, run against a local server (`http://localhost:3000/`) on 2026-10-25 at 18:43 UTC.

| Category | Score |
| --- | --- |
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |

FCP 1.1 s, LCP 1.1 s, TBT 0 ms, CLS 0.

Page weight: index.html, css/, js/ and assets/ total 114 KB on disk (the limit is 300 KB). Lighthouse measured 72 KiB transferred.

## Not finished / what I'd improve

- The "Choose ..." buttons are inert. The brief did not ask for checkout or sign-up, so they are visual only.
- No tests cover `js/app.js` (the DOM and localStorage code).
- No screen reader was used for testing.
- The two payment logos are 256x256 PNGs shown at 28x28. Resizing them would save about 50 KB.

## AI disclosure

Used Claude and Claude Code for scaffolding and review. I reviewed and edited every file.
