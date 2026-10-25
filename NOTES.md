# Notes

## 1. Observations on the live pkhosting.com pricing section

Checked on 25 Oct 2026; the live site may have changed since.

1. The annual price rule differs by section. Every shared hosting plan I saw is labelled "10x monthly" (Personal Hosting: Rs 699/mo, shown as "Rs 6,990/yr"). Every VPS plan I saw is labelled "11x monthly" (Cloud VPS Starter: Rs 3,499/mo, shown as "Rs 38,490/yr"). A customer who learns the annual rule on one product gets a smaller discount on the other. The VPS term toggle shows 'Save up to 8%' for annual where the shared toggle shows 16%.
2. Badges do not mean the same thing across plans. "Best Value" is on Professional (Rs 3,999, the dearest of the three shared plans on the homepage) and on Cloud VPS Starter (Rs 3,499, the cheapest Cloud plan). "Power" is on both Cloud VPS Elite (Rs 13,999) and Cloud VPS Max (Rs 19,999). A badge does not tell a buyer where a plan sits in the range.
3. The shared hosting term toggle shows "Save up to 16%" on both "Annually" and "2 years", and 36% on "3 years". A buyer choosing between annual and 2 years sees the same saving on both labels.
4. The "11x monthly" label is not exact. Nine of the ten VPS plans show an annual price Rs 1 above eleven times the monthly price (Cloud VPS Starter: 3,499 x 11 = 38,489, shown as Rs 38,490). Only Premium VPS Max is exact (11,499 x 11 = 126,489). The gap is small, but the label is not literally true, and a buyer who checks the sum will find it.
5. The headline VPS price leaves out the Windows license. Cloud VPS Starter is Rs 3,499/mo; its Windows license is Rs 4,500/mo, in a separate table lower on the page, and the FAQ says no combined server-plus-Windows total is published. A buyer who needs Windows pays Rs 7,999/mo, more than twice the price on the card.
6. The "Premium" badge sits on three adjacent plans in a section already titled Premium VPS. Premium VPS Starter, Pro and Max all carry "Premium"; Nano carries "Entry". The badge repeats the section name and does not tell the three plans apart.

## 2. Design decisions and trade-offs

- **Persistence.** Currency and billing period are saved in localStorage under the key "pkh-vps-prefs". Reads and writes are inside try/catch, and loaded values are checked against an allowlist. The cost is that choices are per browser only, and a bad or tampered value silently falls back to the defaults (PKR, monthly) with no message.
- **Payment methods.** The brief says PKHosting lists eight; its footer shows five (Stripe, PayPal, JazzCash, Easypaisa, bank account), so I measured my cuts against those. I kept bank transfer (IBFT / Raast), JazzCash and Easypaisa, the common local options, and added debit or credit card as its own method, which the footer does not show. I left out Stripe, which is a processor and not a method a buyer chooses, and PayPal. The live site lists both, so this is a scope choice, not a claim that they do not work. The cost is that buyers with a PayPal balance have no option.
- **Currency selector always visible.** It is in the header at every width, never inside the hamburger drawer, because it changes every price on the page. On narrow screens it sits beside the menu button.
- **Four-column plan grid from 1200px.** Below that it is one column, then two from 640px. I chose four across instead of 3+1 so the last card is not left alone on its row.
- **System font stack.** The live site's web fonts would break the zero-external-requests rule, so the page uses system-ui, "Segoe UI", Roboto, Arial, sans-serif. The cost is that text looks different on each operating system and does not match the live site.
- **Pricing logic.** `data-monthly` on each card is the single source of truth. Conversion to USD and GBP happens at display time from PKR, and rounding happens only when the number is formatted. The savings percent comes from `getSavingsPercent` in `js/pricing.js`, never typed. The rates (278.50 PKR per USD and 355.00 PKR per GBP) are fixed as the brief specified, and need a manual edit if they change. Annual is 10x monthly on every plan, as the brief specified. The live VPS cards use 11x (observation 1). The savings percent is rounded, so it reads 17%; the live site shows 16% for the same ratio.

## 3. What I'd do next

- Resize the two payment logos from 256x256 to about 56x56. That saves roughly 50 KB; the logos are about 55 KB of the 73 KB transferred. Lighthouse estimates 53 KiB.
- The "Choose ..." buttons are inert. The brief did not ask for checkout or sign-up, so I left them as visual only.
- Tests cover only the pricing maths in `js/pricing.js`. Nothing tests the DOM code in `js/app.js`, including the storage load and save.

## 4. Known limits

- Tested in Chrome and Firefox only. Safari and real mobile devices were not tested.
- Screen reader testing: keyboard-only testing plus Lighthouse. No screen reader used.
