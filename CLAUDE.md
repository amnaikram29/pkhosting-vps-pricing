# PKHosting VPS Pricing Page

One-page static assessment project: a fictional "PKHosting VPS Hosting" pricing page.
Timebox is 5-6 hours total, so keep everything simple.

## 1. HARD CONSTRAINTS (from the brief, checked by reviewers)
- Plain HTML/CSS/JS only. No frameworks, libraries, build step, npm packages, CDN links,
  web fonts, or external requests of any kind. Total size under 300 KB.
- Must work by double-clicking index.html (file://), offline. No type="module" scripts and
  no fetch() (file:// blocks them). Use normal <script src> tags.
- Monthly PKR prices and the full comparison table are written in the HTML source (not
  injected by JS) so they show with JavaScript disabled.
- No page-level horizontal scroll at 360 / 768 / 1440px or 200% zoom. Only the comparison
  table may scroll, inside its own visible, keyboard-focusable container.
- Keyboard operable, visible focus, price changes announced via an aria-live region,
  4.5:1 body contrast, no layout shift.
- Currency and billing period survive a reload: localStorage inside try/catch, validate
  against an allowlist, fall back to defaults.

## 2. PRICING RULES
- Plans per month in PKR: Starter 2400, Growth 4800 (marked "Most popular"), Scale 9600,
  Dedicated Core 19500.
- Annual billing charges 10 months for 12. Per-month shown = monthly*10/12
  (Growth annual = Rs 4,000). Annual total = monthly*10. The savings badge is computed in
  code, never typed.
- Fixed rates: 1 USD = 278.50 PKR, 1 GBP = 355.00 PKR. No rate API.
- PKR shown as whole numbers; USD and GBP with two decimals. Convert from PKR at display
  time, round only when formatting.
- Single source of truth: each card carries data-monthly in the HTML; JS reads it.
- The price is split into two spans, `.currency` (the symbol) and `.amount` (the number),
  so the symbol can be styled smaller. JS will later fill `.currency`, `.amount`, `.per`,
  `.billed` and `.badge` on each card. `.badge` is empty in the HTML.

## 3. FILE STRUCTURE
- index.html
- css/style.css
- js/pricing.js: pure functions, no DOM. Also exportable for node via a module.exports guard.
- js/app.js: DOM, events, storage.
- tests/pricing.test.js: plain node script, no test framework. Run it with
  `node tests/pricing.test.js`. It must exit non-zero on failure.
- docs/ (screenshots, lighthouse report) and NOTES.md: created in later phases.
- README.md

## 4. VISUAL DIRECTION
Echo pkhosting.com using my own tokens. Define exactly these 12 as CSS custom properties
in :root (no others):
- brand-50 #e9f9ef, brand-500 #1aa54a, brand-600 #138a3d, brand-700 #126e33
- ink-50 #f7f6f4, ink-100 #eceae7, ink-200 #dad6d1, ink-500 #6e655e, ink-600 #544c46,
  ink-900 #1c1815, ink-950 #120f0d
- accent-500 #d8232a

Look: dark hero (ink-900 with soft green/red radial glows), white sticky header, rounded
16px cards, dark featured card for Growth. System font stack only:
system-ui, "Segoe UI", Roboto, Arial, sans-serif.
- Body text on white must be at least ink-500.
- Use brand-700 (not brand-500) for buttons with white text.
- Focus rings must be 3:1+ against their background.
- No copied code, logos, or assets from pkhosting.com.

## 5. WORKFLOW RULES FOR CLAUDE CODE
- One phase at a time. Propose a plan, wait for approval, then edit.
- Never run git commit or git add. I commit myself.
- Keep code simple, with short plain-language comments explaining why. I must explain every
  line in a live review, so no clever tricks or dense one-liners.
- Prefer the smallest change that works. Don't add features not in the brief.
- Build one page section at a time. Each slice does its HTML and its CSS together, so I
  can open index.html and see the result. Never style a section that does not exist yet.
  After each slice: (a) explain what you wrote in plain language, grouped by HTML then
  CSS; (b) ask me 3 questions about it and wait for my answers; (c) tell me the commit
  message to use. I commit myself.

## 6. CSS RULES
- Mobile-first, using min-width media queries.
- One class per component, flat selectors (no ids, no deep nesting, no !important).
- Spacing and type sizes come from a small set of custom properties.
- Comments only for the "why".

## 7. REFERENCE
Screenshots from pkhosting.com are in ../reference/ for layout and mood only. Do not copy
their markup, class names, code or assets.

## 8. ROADMAP (tick off as we go)
- [x] 0 setup
- [x] 1 base + header
- [x] 2 hero
- [x] 3 cards (done)
- [x] 3b plans behaviour
- [x] 3c currency selector (the brief requires it; maths already done in 3b)
- [x] 4 comparison table
- [x] 5 faq
- [x] 6 footer
- [x] 7 no-JS + a11y pass + verification + screenshots + lighthouse
- [x] 8 NOTES.md + README
