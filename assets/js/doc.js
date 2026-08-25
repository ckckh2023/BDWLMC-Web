(function () {
  "use strict";

  var el = document.getElementById("doc-content");
  if (!el || typeof marked === "undefined") return;

  fetch("/docs/index.md", { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.text();
    })
    .then(function (md) {
      el.innerHTML = marked.parse(md);
    })
    .catch(function () {
      el.textContent = "文档加载失败，请稍后重试。";
    });
})();
