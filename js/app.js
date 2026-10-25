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
