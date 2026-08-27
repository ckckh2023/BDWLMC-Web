(function () {
  "use strict";

  // ===== 导航高亮（基于当前路径） =====
  var NAV_LINKS = document.querySelectorAll(".site-header__nav-link");

  function getSegment(href) {
    if (!href || href === "/") return "home";
    var parts = href.split("/").filter(Boolean);
    return parts[0] || "home";
  }

  function setActiveNav() {
    var currentSeg = getSegment(window.location.pathname);
    NAV_LINKS.forEach(function (link) {
      var seg = getSegment(link.getAttribute("href"));
      if (seg === currentSeg) {
        link.classList.add("site-header__nav-link--active");
      } else {
        link.classList.remove("site-header__nav-link--active");
      }
    });
  }

  // ===== 动态模糊背景 =====
  var BG_LAYERS = document.querySelectorAll(".bg-blur__layer");
  var CARDS = document.querySelectorAll(".card");
  var currentLayer = 0;
  var currentSrc = null;
  var visibilityMap = {};

  function setBackground(src) {
    if (!src || src === currentSrc || BG_LAYERS.length < 2) return;
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
    setActiveNav();
    initBackground();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
