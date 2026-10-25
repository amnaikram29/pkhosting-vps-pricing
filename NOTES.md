# Notes

## 1. Observations on the live pkhosting.com pricing section

1. The annual price rule differs by section. Every shared hosting plan I saw is labelled "10x monthly" (Personal Hosting: Rs 699/mo, shown as "Rs 6,990/yr"). Every VPS plan I saw is labelled "11x monthly" (Cloud VPS Starter: Rs 3,499/mo, shown as "Rs 38,490/yr"). A customer who learns the annual rule on one product gets a smaller discount on the other, with no explanation on the page.
2. Badges do not mean the same thing across plans. "Best Value" is on Professional (Rs 3,999, the dearest shared plan) and on Cloud VPS Starter (Rs 3,499, the cheapest Cloud plan). "Power" is on both Elite (Rs 13,999) and Max (Rs 19,999). Buyers cannot use a badge to compare plans, because the same word points at opposite ends of the range and two plans share one badge.
3. The shared hosting term toggle shows "Save up to 16%" on both "Annually" and "2 years", and 36% on "3 years". A buyer choosing between annual and 2 years sees the same saving on both labels.

## 2. Design decisions and trade-offs

- **Persistence.** Currency and billing period are saved in localStorage under the key "pkh-vps-prefs". Reads and writes are inside try/catch, and loaded values are checked against an allowlist. The cost is that choices are per browser only, and a bad or tampered value silently falls back to the defaults (PKR, monthly) with no message.
- **Payment methods.** Kept bank transfer (IBFT / Raast), JazzCash, Easypaisa and card, because these are the common local options. Cut Stripe, because it is a processor and not a method a buyer chooses. Cut PayPal: I was not sure PayPal is usable for Pakistani buyers, so I left it out. The cost is that buyers with a PayPal balance have no option.
- **Currency selector always visible.** It is in the header at every width, never inside the hamburger drawer, because it changes every price on the page. On narrow screens it sits beside the menu button.
- **Four-column plan grid from 1200px.** Below that it is one column, then two from 640px. I chose four across instead of 3+1 so the last card is not left alone on its row.
- **System font stack.** The live site's web fonts would break the zero-external-requests rule, so the page uses system-ui, "Segoe UI", Roboto, Arial, sans-serif. The cost is that text looks different on each operating system and does not match the live site.
- **Pricing logic.** `data-monthly` on each card is the single source of truth. Conversion to USD and GBP happens at display time from PKR, and rounding happens only when the number is formatted. The savings percent comes from `getSavingsPercent` in `js/pricing.js`, never typed. The rates (278.50 PKR per USD and 355.00 PKR per GBP) are fixed as the brief specified, and need a manual edit if they change.

## 3. What I'd do next

- Resize the two payment logos from 256x256 to about 56x56. That saves roughly 50 KB; the logos are about 55 KB of the 73 KB transferred. Lighthouse estimates 53 KiB.
- The "Choose ..." buttons are inert. The brief did not ask for checkout or sign-up, so I left them as visual only.
- Tests cover only the pricing maths in `js/pricing.js`. Nothing tests the DOM code in `js/app.js`, including the storage load and save.

## 4. Known limits

- Tested in Chrome and Firefox only. Safari and real mobile devices were not tested.
- CLS is 0.013 on load, from the billing toggle resizing when JS fills the 'Save up to 17%' chip.
- Screen reader testing: keyboard-only testing plus Lighthouse. No screen reader used.
