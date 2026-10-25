/* Pure pricing maths. No DOM and no storage, so node can test it. */
var Pricing = (function () {
  // Fixed demo rates: how many PKR one unit of each currency costs
  var RATES = { PKR: 1, USD: 278.5, GBP: 355 };
  // Annual billing charges 10 months and gives 12
  var PAID_MONTHS = 10;
  var YEAR_MONTHS = 12;

  var SYMBOLS = { PKR: "Rs", USD: "$", GBP: "£" };

  // Allowlists: anything not listed here is rejected
  function isValidCurrency(currency) {
    return currency === "PKR" || currency === "USD" || currency === "GBP";
  }

  function isValidPeriod(period) {
    return period === "monthly" || period === "annual";
  }

  // All amounts stay in PKR here. Nothing is rounded in this function.
  function getPlanPrices(monthlyPkr, period) {
    if (period === "annual") {
      var saved = monthlyPkr * YEAR_MONTHS - monthlyPkr * PAID_MONTHS;
      return {
        perMonthPkr: (monthlyPkr * PAID_MONTHS) / YEAR_MONTHS,
        billedPkr: monthlyPkr * PAID_MONTHS,
        savedPkr: saved,
        savedPercent: Math.round((saved / (monthlyPkr * YEAR_MONTHS)) * 100)
      };
    }

    return {
      perMonthPkr: monthlyPkr,
      billedPkr: monthlyPkr,
      savedPkr: 0,
      savedPercent: 0
    };
  }

  // No rounding here, so the total is never built from rounded pieces
  function convert(pkr, currency) {
    return pkr / RATES[currency];
  }

  // Rounding happens only here, when the number is turned into text
  function formatAmount(pkr, currency) {
    var value = convert(pkr, currency);
    var digits = currency === "PKR" ? 0 : 2;

    return {
      symbol: SYMBOLS[currency],
      number: value.toLocaleString("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      })
    };
  }

  return {
    RATES: RATES,
    PAID_MONTHS: PAID_MONTHS,
    YEAR_MONTHS: YEAR_MONTHS,
    getPlanPrices: getPlanPrices,
    convert: convert,
    formatAmount: formatAmount,
    isValidCurrency: isValidCurrency,
    isValidPeriod: isValidPeriod
  };
})();

// Lets the node test load this file. In the browser "module" does not exist.
if (typeof module !== "undefined" && module.exports) module.exports = Pricing;
