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

// One select, two homes: just left of Get Started on desktop, just left of the
// hamburger below that (first in the header, so Tab order matches the screen).
// Moving the same element keeps its id, listeners and value.
function placeCurrencySelect() {
  var select = document.getElementById("currency");
  if (desktopQuery.matches) {
    var getStarted = document.querySelector(".nav-cta .btn");
    getStarted.parentNode.insertBefore(select, getStarted);
  } else {
    var header = navToggle.parentNode;
    header.insertBefore(select, header.firstChild);
  }
}

placeCurrencySelect();

// If the window grows to desktop width while open, the drawer is no longer
// a drawer, so reset the state (and the scroll lock with it)
desktopQuery.addEventListener("change", function (event) {
  placeCurrencySelect();
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

    // The default monthly PKR price is already written in the HTML, so leave it alone
    var isDefaultView = state.period === "monthly" && state.currency === "PKR";
    if (!(isFirstRender && isDefaultView)) {
      card.querySelector(".currency").textContent = perMonth.symbol;
      card.querySelector(".amount").textContent = perMonth.number;
      card.querySelector(".per").textContent = "/month";
    }

    if (state.period === "annual") {
      card.querySelector(".billed").textContent = joinAmount(billed) + " billed once a year";
    } else {
      // Each card carries its own short note, all the same length so the cards stay level
      card.querySelector(".billed").textContent = card.dataset.note;
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

  // The chip's percent comes from the same maths as the prices, never typed.
  // It is not aria-hidden: "Annually Save 17%" is useful in the button's name.
  function showSavingsChip() {
    document.querySelector(".chip").textContent = "Save up to " + Pricing.getSavingsPercent() + "%";
  }

  load();
  showSavingsChip();
  render();
})();
