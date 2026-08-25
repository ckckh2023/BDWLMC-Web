(function () {
  "use strict";

  // ===== 导航高亮 =====
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

  // ===== 动态模糊背景 =====
  var BG_LAYERS = document.querySelectorAll(".bg-blur__layer");
  var CARDS = document.querySelectorAll(".card");
  var currentLayer = 0;
  var currentSrc = null;
  var visibilityMap = {};

  function setBackground(src) {
    if (!src || src === currentSrc) return;
    currentSrc = src;
    var next = 1 - currentLayer;
    BG_LAYERS[next].style.backgroundImage = "url('" + src + "')";
    BG_LAYERS[next].classList.add("is-active");
    BG_LAYERS[currentLayer].classList.remove("is-active");
    currentLayer = next;
  }

  function updateBackground() {
    var bestId = null;
    var bestRatio = 0;
    Object.keys(visibilityMap).forEach(function (id) {
      if (visibilityMap[id] > bestRatio) {
        bestRatio = visibilityMap[id];
        bestId = id;
      }
    });
    if (!bestId) return;
    var card = document.getElementById(bestId);
    if (!card) return;
    var img = card.querySelector(".card__image");
    if (img) {
      setBackground(img.currentSrc || img.src);
    }
  }

  function initBackground() {
    if (!("IntersectionObserver" in window) || CARDS.length === 0) return;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visibilityMap[entry.target.id] = entry.intersectionRatio;
        });
        updateBackground();
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );
    CARDS.forEach(function (card) {
      observer.observe(card);
    });
    var firstImg = CARDS[0].querySelector(".card__image");
    if (firstImg) {
      setBackground(firstImg.currentSrc || firstImg.src);
    }
  }

  function init() {
    NAV_LINKS.forEach(function (link) {
      link.addEventListener("click", handleNavClick);
    });
    setActiveNav();
    initBackground();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
