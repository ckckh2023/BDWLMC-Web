(function () {
  "use strict";

  var listEl = document.querySelector("[data-display-list]");
  if (!listEl) return;

  var loadingEl = listEl.querySelector("[data-display-loading]");

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderCard(item, index) {
    var card = document.createElement("article");
    card.className = "card display-card";
    card.id = "display-" + (index + 1);

    var img = document.createElement("img");
    img.className = "card__image";
    img.src = item.image;
    img.alt = item.title || "作品";
    img.loading = "lazy";
    card.appendChild(img);

    var overlay = document.createElement("div");
    overlay.className = "display-card__overlay";

    var title = document.createElement("h2");
    title.className = "display-card__title";
    title.textContent = item.title || "未命名作品";
    overlay.appendChild(title);

    if (item.author) {
      var meta = document.createElement("p");
      meta.className = "display-card__meta";
      meta.textContent = "by " + item.author;
      overlay.appendChild(meta);
    }

    if (item.description) {
      var desc = document.createElement("p");
      desc.className = "display-card__desc";
      desc.textContent = item.description;
      overlay.appendChild(desc);
    }

    card.appendChild(overlay);
    return card;
  }

  function renderError(msg) {
    var p = document.createElement("p");
    p.className = "display-loading";
    p.textContent = msg || "加载失败，请稍后重试。";
    listEl.innerHTML = "";
    listEl.appendChild(p);
  }

  function renderList(data) {
    var items = (data && data.items) || [];
    if (!items.length) {
      renderError("暂无作品。");
      return;
    }
    listEl.innerHTML = "";
    items.forEach(function (item, index) {
      listEl.appendChild(renderCard(item, index));
    });
  }

  function load() {
    fetch("/display/display.json", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(renderList)
      .catch(function () {
        renderError("加载失败，请稍后重试。");
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", load);
  } else {
    load();
  }
})();
