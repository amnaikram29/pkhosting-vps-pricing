/* ---------- Mobile menu ---------- */
var navToggle = document.querySelector(".nav-toggle");
var siteNav = document.getElementById("site-nav");
// Must match the breakpoint where the drawer turns into the inline nav in style.css
var desktopQuery = window.matchMedia("(min-width: 1200px)");

function setNavOpen(isOpen) {
  navToggle.setAttribute("aria-expanded", String(isOpen));
  siteNav.classList.toggle("is-open", isOpen);
  // Stops the page behind the drawer from scrolling
  document.documentElement.classList.toggle("nav-open", isOpen);
}

function isNavOpen() {
  return navToggle.getAttribute("aria-expanded") === "true";
}

navToggle.addEventListener("click", function () {
  setNavOpen(!isNavOpen());
});

// Tapping a link jumps to its section, so the drawer should get out of the way
siteNav.addEventListener("click", function (event) {
  if (event.target.closest("a")) {
    setNavOpen(false);
  }
});

document.addEventListener("keydown", function (event) {
  if (!isNavOpen()) {
    return;
  }

  if (event.key === "Escape") {
    setNavOpen(false);
    navToggle.focus();
    return;
  }

  if (event.key === "Tab") {
    // While the drawer is open, Tab only cycles through the toggle and the links
    var focusable = [navToggle].concat(Array.from(siteNav.querySelectorAll("a")));
    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

// If the window grows to desktop width while open, the drawer is no longer
// a drawer, so reset the state (and the scroll lock with it)
desktopQuery.addEventListener("change", function (event) {
  if (event.matches) {
    setNavOpen(false);
  }
});

/* ---------- Header glass effect on scroll ---------- */
(function () {
  var header = document.querySelector(".site-header");

  function updateHeader() {
    // A few pixels of slack so the tiniest scroll does not flicker it
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  // Passive: we never cancel the scroll, so the browser can keep it smooth
  window.addEventListener("scroll", updateHeader, { passive: true });
  // Also run once now, in case the page reloads already scrolled down
  updateHeader();
})();

/* ---------- Plans: billing toggle ---------- */
(function () {
  var STORAGE_KEY = "pkh-vps-prefs";

  var cards = document.querySelectorAll(".card");
  var periodButtons = document.querySelectorAll("[data-period]");
  var status = document.getElementById("status");
  var currencySelect = document.getElementById("currency");

  var state = { period: "monthly", currency: "PKR" };
  var isFirstRender = true;

  // Reads saved choices. Anything missing, broken or not on the allowlist is ignored.
  function load() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && Pricing.isValidPeriod(saved.period)) {
        state.period = saved.period;
      }
      if (saved && Pricing.isValidCurrency(saved.currency)) {
        state.currency = saved.currency;
      }
    } catch (error) {
      // Storage blocked or the saved text was not JSON: keep the defaults
    }
  }

  // Saving is a convenience, so a failure (private mode, full storage) is ignored
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      // Nothing to do
    }
  }

  // "Rs 195,000" but "$172.35": only the rupee symbol is a word, so it gets a space
  function joinAmount(amount) {
    return amount.symbol === "Rs" ? amount.symbol + " " + amount.number : amount.symbol + amount.number;
  }

  function renderCard(card) {
    // data-monthly in the HTML is the only price list
    var monthly = Number(card.dataset.monthly);
    var prices = Pricing.getPlanPrices(monthly, state.period);
    var perMonth = Pricing.formatAmount(prices.perMonthPkr, state.currency);
    var billed = Pricing.formatAmount(prices.billedPkr, state.currency);
    var yearly = Pricing.formatAmount(Pricing.getPlanPrices(monthly, "annual").billedPkr, state.currency);

    // The default monthly PKR price is already written in the HTML, so leave it alone
    var isDefaultView = state.period === "monthly" && state.currency === "PKR";
    if (!(isFirstRender && isDefaultView)) {
      card.querySelector(".currency").textContent = perMonth.symbol;
      card.querySelector(".amount").textContent = perMonth.number;
      card.querySelector(".per").textContent = "/month";
    }

    if (state.period === "annual") {
      card.querySelector(".billed").textContent =
        joinAmount(billed) + " billed once a year (10× monthly) · Recurring rate; notified price changes may apply";
    } else {
      card.querySelector(".billed").textContent =
        "Billed monthly · or " + joinAmount(yearly) + "/yr (10× monthly) if billed annually";
    }
  }

  function render() {
    cards.forEach(renderCard);

    periodButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.period === state.period));
    });

    currencySelect.value = state.currency;

    isFirstRender = false;
  }

  // Only called after a user action, so a screen reader is not told about the first load
  function announce() {
    var periodName = state.period === "annual" ? "annual" : "monthly";
    status.textContent = "Showing " + periodName + " billing in " + state.currency + ". Prices updated.";
  }

  periodButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var period = button.dataset.period;
      if (!Pricing.isValidPeriod(period)) {
        return;
      }
      state.period = period;
      render();
      save();
      announce();
    });
  });

  currencySelect.addEventListener("change", function () {
    // The options are fixed in the HTML, but check anyway before trusting the value
    if (!Pricing.isValidCurrency(currencySelect.value)) {
      return;
    }
    state.currency = currencySelect.value;
    render();
    save();
    announce();
  });

  // The top bar scrolls out of view, and the browser cannot scroll it back by
  // itself. So when keyboard focus lands on the select, go back to the top.
  // Waiting one frame lets the browser finish its own scrolling first.
  currencySelect.addEventListener("focus", function () {
    requestAnimationFrame(function () {
      window.scrollTo(0, 0);
    });
  });

  // The chip's percent comes from the same maths as the prices, never typed.
  // Taking the biggest across the cards makes "up to" honest.
  function showSavingsChip() {
    var best = 0;
    cards.forEach(function (card) {
      var percent = Pricing.getPlanPrices(Number(card.dataset.monthly), "annual").savedPercent;
      best = Math.max(best, percent);
    });
    document.querySelector(".tab-chip").textContent = "Save up to " + best + "%";
  }

  load();
  showSavingsChip();
  render();
})();
