(function () {
  "use strict";

  var STATUS_CARD = document.querySelector("[data-server-status]");
  if (!STATUS_CARD) return;

  var HOST =
    STATUS_CARD.getAttribute("data-host") || "bdwl.xiao-blog.top";
  var API = "https://api.mcsrvstat.us/3/" + HOST;

  var dotEl = STATUS_CARD.querySelector("[data-status-dot]");
  var textEl = STATUS_CARD.querySelector("[data-status-text]");
  var onlineEl = STATUS_CARD.querySelector("[data-status-online]");
  var maxEl = STATUS_CARD.querySelector("[data-status-max]");
  var versionEl = STATUS_CARD.querySelector("[data-status-version]");
  var latencyEl = STATUS_CARD.querySelector("[data-status-latency]");
  var motdEl = STATUS_CARD.querySelector("[data-status-motd]");
  var playersEl = STATUS_CARD.querySelector("[data-status-players]");

  function setLoading() {
    if (textEl) textEl.textContent = "查询中";
    if (dotEl) {
      dotEl.classList.remove("status-dot--online", "status-dot--offline");
      dotEl.classList.add("status-dot--loading");
    }
  }

  function setOffline(msg) {
    if (textEl) textEl.textContent = msg || "离线";
    if (dotEl) {
      dotEl.classList.remove("status-dot--online", "status-dot--loading");
      dotEl.classList.add("status-dot--offline");
    }
    if (onlineEl) onlineEl.textContent = "0";
    if (maxEl) maxEl.textContent = "--";
  }

  function setOnline(data) {
    if (textEl) textEl.textContent = "在线";
    if (dotEl) {
      dotEl.classList.remove("status-dot--offline", "status-dot--loading");
      dotEl.classList.add("status-dot--online");
    }
    var p = data.players || {};
    if (onlineEl) onlineEl.textContent = p.online != null ? p.online : "--";
    if (maxEl) maxEl.textContent = p.max != null ? p.max : "--";
    if (versionEl) versionEl.textContent = data.version || "--";

    if (motdEl && data.motd && data.motd.clean && data.motd.clean.length) {
      motdEl.textContent = data.motd.clean.join("\n");
      motdEl.hidden = false;
    }
    if (playersEl && p.list && p.list.length) {
      playersEl.textContent =
        "在线玩家：" +
        p.list
          .map(function (pl) {
            return pl.name || pl;
          })
          .join("、");
      playersEl.hidden = false;
    }
  }

  function fetchStatus() {
    setLoading();
    var start = Date.now();
    fetch(API, { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        if (latencyEl) latencyEl.textContent = Date.now() - start + " ms";
        if (data && data.online) {
          setOnline(data);
        } else {
          setOffline();
        }
      })
      .catch(function () {
        setOffline("请求失败");
        if (latencyEl) latencyEl.textContent = "-- ms";
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fetchStatus);
  } else {
    fetchStatus();
  }
})();
