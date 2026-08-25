(function () {
  "use strict";

  var NAV_LINKS = document.querySelectorAll(".site-header__nav-link");

  function setActiveNav() {
    var hash = (window.location.hash || "#home").replace("#", "");
    NAV_LINKS.forEach(function (link) {
      var target = link.getAttribute("href").replace("#", "");
      if (target === hash) {
        link.classList.add("site-header__nav-link--active");
      } else {
        link.classList.remove("site-header__nav-link--active");
      }
    });
  }

  function handleNavClick(event) {
    var link = event.currentTarget;
    var href = link.getAttribute("href");
    if (href && href.charAt(0) === "#" && href.length > 1) {
      event.preventDefault();
      window.location.hash = href;
      setActiveNav();
    }
  }

  function init() {
    NAV_LINKS.forEach(function (link) {
      link.addEventListener("click", handleNavClick);
    });
    setActiveNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
