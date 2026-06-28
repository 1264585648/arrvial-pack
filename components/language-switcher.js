const DEFAULT_LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "zh", label: "中文" },
  { value: "bi", label: "Bilingual" },
];

function renderLanguageSwitcher(container, options = {}) {
  if (!container) return;

  const languages = options.languages || DEFAULT_LANGUAGE_OPTIONS;
  const activeLang = options.activeLang || languages[0]?.value || "en";

  container.classList.add("segmented");
  container.setAttribute("aria-label", options.label || "Language");
  container.replaceChildren(
    ...languages.map((language) => {
      const button = document.createElement("button");
      const isActive = language.value === activeLang;

      button.className = `chip${isActive ? " is-active" : ""}`;
      button.type = "button";
      button.dataset.lang = language.value;
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
      button.textContent = language.label;

      return button;
    }),
  );
}

window.LanguageSwitcher = {
  languages: DEFAULT_LANGUAGE_OPTIONS,
  render: renderLanguageSwitcher,
};

function readChinaReadyGlobal(name) {
  try {
    return (0, eval)(name);
  } catch (error) {
    return undefined;
  }
}

function writeChinaReadyGlobal(name, value) {
  try {
    window.__chinaReadyPatchValue = value;
    (0, eval)(`${name} = window.__chinaReadyPatchValue`);
    delete window.__chinaReadyPatchValue;
    return true;
  } catch (error) {
    delete window.__chinaReadyPatchValue;
    return false;
  }
}

function callChinaReadyGlobal(name, ...args) {
  const fn = readChinaReadyGlobal(name);
  if (typeof fn === "function") {
    return fn(...args);
  }
  return undefined;
}

function ensureMapPageStyles() {
  if (document.getElementById("china-ready-map-fixes")) return;

  const style = document.createElement("style");
  style.id = "china-ready-map-fixes";
  style.textContent = `
    .brand-mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: 12px;
      background: #102f27;
      color: #f7efe2;
      font-weight: 800;
      box-shadow: inset 0 0 0 1px rgba(201, 145, 59, 0.45);
    }

    .day-tools {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }

    .day-name-input {
      min-width: min(100%, 220px);
      flex: 1 1 220px;
    }

    .day-action {
      min-height: 38px;
    }

    @media print {
      .planner-panel {
        max-height: none !important;
        overflow: visible !important;
      }

      .day-card,
      .route-summary,
      .print-sheet {
        break-inside: avoid;
      }
    }
  `;
  document.head.appendChild(style);
}

function patchMapTranslations() {
  const C = readChinaReadyGlobal("C");
  if (!C) return;

  if (C.en) {
    C.en.removeDay = "Remove day";
    C.en.dayNamePlaceholder = "Name this day, e.g. Old Town";
    C.en.transitCopy =
      "Transit details are shown as a printable planning hint. Please confirm live routes and operating times in a local map app before departure.";
  }

  if (C.zh) {
    C.zh.removeDay = "删除当天";
    C.zh.dayNamePlaceholder = "给这一天命名，例如：老城路线";
    C.zh.transitCopy =
      "公共交通信息会作为可打印的规划提示展示。出发前请在本地地图应用中确认实时线路和运营时间。";
  }

  if (C.bi) {
    C.bi.removeDay = "Remove day / 删除当天";
    C.bi.dayNamePlaceholder = "Name this day / 给这一天命名";
    C.bi.transitCopy =
      "Transit details are printable planning hints. Please confirm live routes before departure. / 公共交通为打印规划提示，出发前请确认实时线路。";
  }
}

function patchedDayName(index) {
  const state = readChinaReadyGlobal("state");
  const customName = state?.days?.[index]?.name?.trim();

  if (customName) return customName;
  if (state?.lang === "zh") return `第 ${index + 1} 天`;
  if (state?.lang === "bi") return `Day ${index + 1} / 第 ${index + 1} 天`;
  return `Day ${index + 1}`;
}

function patchMapState() {
  const state = readChinaReadyGlobal("state");
  if (!state?.days) return;

  state.showContextSpots = true;
  state.days.forEach((day, index) => {
    if (typeof day.name !== "string") {
      day.name = "";
    }
    if (!day.color) {
      day.color = ["#c9913b", "#2c7a5f", "#8d3d2c", "#516a8a"][index % 4];
    }
  });

  writeChinaReadyGlobal("dayName", patchedDayName);
}

function getActiveDay() {
  const state = readChinaReadyGlobal("state");
  return state?.days?.[state.activeDay] || null;
}

function getActiveCopy() {
  const state = readChinaReadyGlobal("state");
  const C = readChinaReadyGlobal("C");
  return C?.[state?.lang || "en"] || C?.en || {};
}

function syncMapPatchControls() {
  const state = readChinaReadyGlobal("state");
  const copy = getActiveCopy();
  const activeDay = getActiveDay();
  const removeDay = document.getElementById("removeDay");
  const dayNameInput = document.getElementById("dayNameInput");

  if (removeDay) {
    removeDay.textContent = copy.removeDay || "Remove day";
    removeDay.disabled = !state?.days || state.days.length <= 1;
  }

  if (dayNameInput) {
    dayNameInput.placeholder = copy.dayNamePlaceholder || "Name this day";
    if (document.activeElement !== dayNameInput) {
      dayNameInput.value = activeDay?.name || "";
    }
  }
}

function ensureDayControls() {
  const addDay = document.getElementById("addDay");
  const activeDayCard = document.getElementById("activeDayCard");

  if (addDay && !document.getElementById("removeDay")) {
    const wrapper = addDay.parentElement;
    if (wrapper) {
      wrapper.classList.add("day-tools");
    }

    const removeDay = document.createElement("button");
    removeDay.id = "removeDay";
    removeDay.className = "outline-button day-action";
    removeDay.type = "button";
    removeDay.addEventListener("click", () => {
      const state = readChinaReadyGlobal("state");
      if (!state?.days || state.days.length <= 1) return;

      state.days.splice(state.activeDay, 1);
      state.activeDay = Math.max(0, Math.min(state.activeDay, state.days.length - 1));
      callChinaReadyGlobal("render");
      callChinaReadyGlobal("fitAllRoutes");
    });

    addDay.insertAdjacentElement("afterend", removeDay);
  }

  if (activeDayCard && !document.getElementById("dayNameInput")) {
    const input = document.createElement("input");
    input.id = "dayNameInput";
    input.className = "form-input day-name-input";
    input.type = "text";
    input.maxLength = 28;
    input.autocomplete = "off";
    input.addEventListener("input", () => {
      const activeDay = getActiveDay();
      if (!activeDay) return;

      activeDay.name = input.value;
      callChinaReadyGlobal("renderDayTabs");
      callChinaReadyGlobal("renderActiveDayCard");
      callChinaReadyGlobal("renderDayCards");
      callChinaReadyGlobal("updateSources");
      syncMapPatchControls();
    });

    activeDayCard.insertAdjacentElement("beforebegin", input);
  }
}

function ensureSpotLabels() {
  const map = readChinaReadyGlobal("map");
  if (!map || typeof map.getLayer !== "function" || typeof map.addLayer !== "function") return;
  if (!map.getSource("spots") || map.getLayer("spot-labels")) return;

  map.addLayer({
    id: "spot-labels",
    type: "symbol",
    source: "spots",
    layout: {
      "text-field": ["get", "label"],
      "text-size": 12,
      "text-font": ["Noto Sans Bold"],
      "text-offset": [0, 1.1],
      "text-anchor": "top",
      "text-optional": true,
    },
    paint: {
      "text-color": "#162019",
      "text-halo-color": "#fffdf8",
      "text-halo-width": 1.4,
    },
  });
}

function patchMapLanguageLayer() {
  const originalSetMapLang = readChinaReadyGlobal("setMapLang");
  if (typeof originalSetMapLang !== "function" || originalSetMapLang.__patchedForLabels) return;

  const patchedSetMapLang = (lang) => {
    originalSetMapLang(lang);
    const map = readChinaReadyGlobal("map");
    if (map?.getLayer?.("spot-labels")) {
      map.setLayoutProperty("spot-labels", "text-field", ["get", "label"]);
    }
  };
  patchedSetMapLang.__patchedForLabels = true;
  writeChinaReadyGlobal("setMapLang", patchedSetMapLang);
}

function patchMapRender() {
  const originalRender = readChinaReadyGlobal("render");
  if (typeof originalRender !== "function" || originalRender.__patchedForMapControls) return;

  const patchedRender = (...args) => {
    const result = originalRender(...args);
    ensureDayControls();
    syncMapPatchControls();
    return result;
  };
  patchedRender.__patchedForMapControls = true;
  writeChinaReadyGlobal("render", patchedRender);
}

function installMapPageFixes() {
  if (window.__chinaReadyMapFixesInstalled) return;
  if (!document.getElementById("map") || !document.getElementById("addDay")) return;

  window.__chinaReadyMapFixesInstalled = true;

  document.querySelectorAll('link[href*="ready-brand"], link[href*="favicon"]').forEach((link) => {
    link.remove();
  });

  const brand = document.querySelector(".site-header .brand");
  if (brand?.querySelector(".brand-logo")) {
    const mark = document.createElement("span");
    mark.className = "brand-mark";
    mark.textContent = "中";

    const name = document.createElement("span");
    name.textContent = "ChinaReady";

    brand.replaceChildren(mark, name);
  }

  ensureMapPageStyles();
  patchMapTranslations();
  patchMapState();
  patchMapLanguageLayer();
  ensureDayControls();
  patchMapRender();
  callChinaReadyGlobal("render");

  const map = readChinaReadyGlobal("map");
  if (map?.on) {
    map.on("load", () => {
      patchMapState();
      ensureSpotLabels();
      callChinaReadyGlobal("updateSources");
      callChinaReadyGlobal("fitShanghai");
    });
  }

  if (map?.loaded?.()) {
    ensureSpotLabels();
    callChinaReadyGlobal("updateSources");
    callChinaReadyGlobal("fitShanghai");
  }

  syncMapPatchControls();
}

window.addEventListener("load", installMapPageFixes);
