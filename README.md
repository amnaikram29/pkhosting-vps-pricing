# PKHosting VPS Pricing

A static one-page PKHosting VPS pricing page, built for the TechAbout assessment. Plain HTML, CSS and JS, with no framework, no build step and no external requests.

## Run it

Open `index.html` in a browser. It works from `file://` and offline.

Tests: `node tests/pricing.test.js` (plain node script, exits non-zero on failure). It passes.

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

## Not finished / known limits

- The "Choose ..." buttons are inert. The brief did not ask for checkout or sign-up, so they are visual only.
- No tests cover `js/app.js` (the DOM and localStorage code).
- No screen reader was used for testing.
- The two payment logos are 256x256 PNGs shown at 28x28. Resizing them would save about 50 KB.

## AI disclosure

Used Claude and Claude Code for scaffolding and review. I reviewed and edited every file.

See NOTES.md for observations on the live pkhosting.com pricing section and my design trade-offs.
