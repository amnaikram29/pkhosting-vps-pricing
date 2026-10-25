// Run with: node tests/pricing.test.js
var assert = require("assert");
var Pricing = require("../js/pricing.js");

var failures = 0;

// Prints one line per check and keeps going, so one failure doesn't hide the rest
function check(name, fn) {
  try {
    fn();
    console.log("PASS  " + name);
  } catch (error) {
    failures++;
    console.log("FAIL  " + name + "  (" + error.message + ")");
  }
}

var plans = { Starter: 2400, Growth: 4800, Scale: 9600, "Dedicated Core": 19500 };

check("Growth annual: 4000/month, billed 48000, saved 9600, 17%", function () {
  var p = Pricing.getPlanPrices(4800, "annual");
  assert.strictEqual(p.perMonthPkr, 4000);
  assert.strictEqual(p.billedPkr, 48000);
  assert.strictEqual(p.savedPkr, 9600);
  assert.strictEqual(p.savedPercent, 17);
});

check("Starter annual per month is 2000", function () {
  assert.strictEqual(Pricing.getPlanPrices(2400, "annual").perMonthPkr, 2000);
});

check("Scale annual per month is 8000", function () {
  assert.strictEqual(Pricing.getPlanPrices(9600, "annual").perMonthPkr, 8000);
});

check("Dedicated Core annual per month is 16250", function () {
  assert.strictEqual(Pricing.getPlanPrices(19500, "annual").perMonthPkr, 16250);
});

check("Monthly saved is 0 for every plan", function () {
  Object.keys(plans).forEach(function (name) {
    var p = Pricing.getPlanPrices(plans[name], "monthly");
    assert.strictEqual(p.savedPkr, 0, name);
    assert.strictEqual(p.savedPercent, 0, name);
    assert.strictEqual(p.perMonthPkr, plans[name], name);
    assert.strictEqual(p.billedPkr, plans[name], name);
  });
});

check("Growth 4800 in USD is $17.24", function () {
  var f = Pricing.formatAmount(4800, "USD");
  assert.strictEqual(f.symbol + f.number, "$17.24");
});

check("Growth 4800 in GBP is £13.52", function () {
  var f = Pricing.formatAmount(4800, "GBP");
  assert.strictEqual(f.symbol + f.number, "£13.52");
});

check("Dedicated Core 19500 in PKR is Rs and 19,500", function () {
  var f = Pricing.formatAmount(19500, "PKR");
  assert.strictEqual(f.symbol, "Rs");
  assert.strictEqual(f.number, "19,500");
});

check("Dedicated Core annual total in PKR is 195,000", function () {
  var billed = Pricing.getPlanPrices(19500, "annual").billedPkr;
  assert.strictEqual(Pricing.formatAmount(billed, "PKR").number, "195,000");
});

check("Growth annual total in USD is 172.35 (converted directly)", function () {
  var billed = Pricing.getPlanPrices(4800, "annual").billedPkr;
  assert.strictEqual(Pricing.formatAmount(billed, "USD").number, "172.35");
});

check("Dedicated Core annual per month in GBP is 45.77", function () {
  var perMonth = Pricing.getPlanPrices(19500, "annual").perMonthPkr;
  assert.strictEqual(Pricing.formatAmount(perMonth, "GBP").number, "45.77");
});

check("Currency validator rejects EUR, undefined and null", function () {
  assert.strictEqual(Pricing.isValidCurrency("PKR"), true);
  assert.strictEqual(Pricing.isValidCurrency("USD"), true);
  assert.strictEqual(Pricing.isValidCurrency("GBP"), true);
  assert.strictEqual(Pricing.isValidCurrency("EUR"), false);
  assert.strictEqual(Pricing.isValidCurrency(undefined), false);
  assert.strictEqual(Pricing.isValidCurrency(null), false);
});

check("Period validator rejects weekly, undefined and null", function () {
  assert.strictEqual(Pricing.isValidPeriod("monthly"), true);
  assert.strictEqual(Pricing.isValidPeriod("annual"), true);
  assert.strictEqual(Pricing.isValidPeriod("weekly"), false);
  assert.strictEqual(Pricing.isValidPeriod(undefined), false);
  assert.strictEqual(Pricing.isValidPeriod(null), false);
});

if (failures > 0) {
  console.log("\n" + failures + " check(s) failed");
  process.exit(1);
}
console.log("\nAll checks passed");
