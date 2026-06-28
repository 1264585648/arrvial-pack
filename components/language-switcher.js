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

    .map-shell {
      display: grid !important;
      grid-template-columns: minmax(340px, 400px) minmax(0, 1fr) !important;
      gap: 12px !important;
      align-items: stretch !important;
      overflow: visible !important;
      border: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    .map-canvas,
    .map-shell > #map {
      grid-column: 2 !important;
      grid-row: 1 !important;
      min-height: calc(100vh - 188px) !important;
      overflow: hidden !important;
      border: 1px solid rgba(255, 253, 248, 0.16) !important;
      border-radius: 8px !important;
      background: #e9ece2 !important;
      box-shadow: 0 28px 90px rgba(0, 0, 0, 0.34) !important;
    }

    .map-canvas > #map {
      position: absolute !important;
      inset: 0 !important;
      min-height: 0 !important;
      border: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
    }

    .map-shell > #map {
      position: relative !important;
      inset: auto !important;
    }

    .planner-panel {
      position: relative !important;
      top: auto !important;
      left: auto !important;
      grid-column: 1 !important;
      grid-row: 1 !important;
      width: 100% !important;
      max-height: calc(100vh - 188px) !important;
    }

    .destination-drawer {
      display: grid;
      grid-column: 1 / -1;
      gap: 12px;
      border: 1px solid rgba(22, 32, 25, 0.12);
      border-radius: 8px;
      padding: 16px;
      background: rgba(255, 253, 248, 0.96);
      color: #162019;
      box-shadow: 0 18px 50px rgba(0, 0, 0, 0.18);
    }

    .drawer-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }

    .drawer-header h3 {
      margin: 0;
      font-size: 18px;
    }

    .drawer-tools {
      display: grid;
      grid-template-columns: minmax(220px, 1fr) auto;
      gap: 10px;
      align-items: start;
    }

    .destination-drawer .spots {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      max-height: 280px;
    }

    .destination-drawer .spot {
      grid-template-columns: minmax(0, 1fr) auto auto;
    }

    .selected-preview {
      display: grid;
      gap: 7px;
    }

    .selected-chip {
      display: grid;
      grid-template-columns: 30px 1fr auto;
      gap: 8px;
      align-items: center;
      border: 1px solid rgba(22, 32, 25, 0.14);
      border-radius: 8px;
      padding: 8px;
      background: rgba(255, 253, 248, 0.9);
      color: #162019;
    }

    .selected-chip button {
      width: 28px;
      height: 28px;
      border: 1px solid rgba(22, 32, 25, 0.14);
      border-radius: 999px;
      background: #fffdf8;
      color: #162019;
      cursor: pointer;
      font-weight: 900;
    }

    @media (max-width: 1060px) {
      .map-shell {
        grid-template-columns: 1fr !important;
      }

      .planner-panel,
      .map-canvas,
      .map-shell > #map {
        grid-column: 1 !important;
        max-height: none !important;
      }

      .drawer-tools {
        grid-template-columns: 1fr;
      }
    }

    @media print {
      .planner-panel {
        position: absolute !important;
        top: 8mm !important;
        right: 8mm !important;
        left: auto !important;
        max-height: none !important;
        overflow: visible !important;
        width: 96mm !important;
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
    C.en.selectedStops = "Selected destinations";
    C.en.noSelectedStops = "No destinations selected yet. Open the library or click map labels.";
    C.en.openLibrary = "Open destination library";
    C.en.closeLibrary = "Close";
    C.en.drawerKicker = "Destination library";
    C.en.drawerTitle = "Choose destinations from a wider list";
    C.en.transitCopy =
      "Transit details are shown as a printable planning hint. Please confirm live routes and operating times in a local map app before departure.";
  }

  if (C.zh) {
    C.zh.removeDay = "删除当天";
    C.zh.dayNamePlaceholder = "给这一天命名，例如：老城路线";
    C.zh.selectedStops = "已选目的地";
    C.zh.noSelectedStops = "还没有选择目的地。可以打开目的地库，或直接点击地图标签。";
    C.zh.openLibrary = "打开目的地库";
    C.zh.closeLibrary = "关闭";
    C.zh.drawerKicker = "目的地库";
    C.zh.drawerTitle = "在更宽的列表中选择目的地";
    C.zh.transitCopy =
      "公共交通信息会作为可打印的规划提示展示。出发前请在本地地图应用中确认实时线路和运营时间。";
  }

  if (C.bi) {
    C.bi.removeDay = "Remove day / 删除当天";
    C.bi.dayNamePlaceholder = "Name this day / 给这一天命名";
    C.bi.selectedStops = "Selected destinations / 已选目的地";
    C.bi.noSelectedStops = "No destinations selected yet. / 还没有选择目的地。";
    C.bi.openLibrary = "Open destination library / 打开目的地库";
    C.bi.closeLibrary = "Close / 关闭";
    C.bi.drawerKicker = "Destination library / 目的地库";
    C.bi.drawerTitle = "Choose destinations from a wider list / 在更宽的列表中选择目的地";
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
  state.pickerOpen = Boolean(state.pickerOpen);
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
  return state?.days?.[state.active] || state?.days?.[state.activeDay] || null;
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
  const selectedStopsLabel = document.getElementById("selectedStopsLabel");
  const openDestinationDrawer = document.getElementById("openDestinationDrawer");
  const closeDestinationDrawer = document.getElementById("closeDestinationDrawer");
  const destinationDrawer = document.getElementById("destinationDrawer");
  const drawerKicker = document.getElementById("drawerKicker");
  const drawerTitle = document.getElementById("drawerTitle");

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

  if (selectedStopsLabel) selectedStopsLabel.textContent = copy.selectedStops || "Selected destinations";
  if (openDestinationDrawer) openDestinationDrawer.textContent = copy.openLibrary || "Open destination library";
  if (closeDestinationDrawer) closeDestinationDrawer.textContent = copy.closeLibrary || "Close";
  if (drawerKicker) drawerKicker.textContent = copy.drawerKicker || "Destination library";
  if (drawerTitle) drawerTitle.textContent = copy.drawerTitle || "Choose destinations from a wider list";
  if (destinationDrawer && state) {
    destinationDrawer.classList.toggle("is-hidden", !state.pickerOpen || activeDay?.phase === "transport");
  }

  renderSelectedStopsPreview();
}

function escapePatchHTML(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

function labelPatchItem(item) {
  const L = readChinaReadyGlobal("L");
  if (typeof L === "function") return L(item);

  const state = readChinaReadyGlobal("state");
  if (state?.lang === "zh") return item.zh || item.en;
  if (state?.lang === "bi") return `${item.en || ""} / ${item.zh || item.en || ""}`;
  return item.en || item.zh || "";
}

function renderSelectedStopsPreview() {
  const preview = document.getElementById("selectedStopsPreview");
  const state = readChinaReadyGlobal("state");
  const day = getActiveDay();
  const copy = getActiveCopy();
  const dayColor = readChinaReadyGlobal("dayColor");
  if (!preview || !state || !day) return;

  if (!day.stops?.length) {
    preview.innerHTML = `<div class="empty-state">${escapePatchHTML(copy.noSelectedStops || "No destinations selected yet.")}</div>`;
    return;
  }

  preview.innerHTML = day.stops.map((stop, index) => {
    const color = typeof dayColor === "function" ? dayColor(state.active ?? state.activeDay ?? 0) : "#d75a3d";
    const meta = stop.custom ? `${stop.coord[1].toFixed(4)}, ${stop.coord[0].toFixed(4)}` : stop.tip;
    const activeIndex = state.active ?? state.activeDay ?? 0;
    return `<div class="selected-chip" style="--day-color:${color}"><span class="num">${activeIndex + 1}.${index + 1}</span><span class="stop-main"><strong>${escapePatchHTML(labelPatchItem(stop))}</strong><small>${escapePatchHTML(meta)}</small></span><button type="button" aria-label="${escapePatchHTML(copy.remove || "Remove")}" data-remove="${activeIndex}:${index}">×</button></div>`;
  }).join("");
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
      const activeIndex = state?.active ?? state?.activeDay ?? 0;
      if (!state?.days || state.days.length <= 1) return;

      state.days.splice(activeIndex, 1);
      if ("active" in state) state.active = Math.max(0, Math.min(activeIndex, state.days.length - 1));
      if ("activeDay" in state) state.activeDay = Math.max(0, Math.min(activeIndex, state.days.length - 1));
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

function ensureDestinationLibraryLayout() {
  const mapShell = document.querySelector(".map-shell");
  const plannerPanel = document.querySelector(".planner-panel");
  const destinationSection = document.getElementById("destinationSection");
  const activeDayCard = document.getElementById("activeDayCard");
  const confirmDestinations = document.getElementById("confirmDestinations");
  const presetRoutes = document.getElementById("presetRoutes");
  const spotSearch = document.getElementById("spotSearch");
  const categoryTabs = document.getElementById("categoryTabs");
  const spotList = document.getElementById("spotList");

  if (!mapShell || !plannerPanel || !destinationSection || !activeDayCard || !confirmDestinations) return;

  if (!document.querySelector(".map-canvas") && mapShell.firstElementChild?.id === "map") {
    const canvas = document.createElement("div");
    canvas.className = "map-canvas";
    mapShell.insertBefore(canvas, mapShell.firstElementChild);
    canvas.appendChild(document.getElementById("map"));
  }

  if (!document.getElementById("selectedStopsPreview")) {
    const label = document.createElement("span");
    label.id = "selectedStopsLabel";
    label.className = "panel-label";

    const preview = document.createElement("div");
    preview.id = "selectedStopsPreview";
    preview.className = "selected-preview";

    const dayNameInput = document.getElementById("dayNameInput");
    const anchor = dayNameInput?.nextElementSibling || activeDayCard.nextElementSibling;
    destinationSection.insertBefore(label, anchor);
    destinationSection.insertBefore(preview, anchor);
  }

  if (!document.getElementById("openDestinationDrawer")) {
    const openButton = document.createElement("button");
    openButton.id = "openDestinationDrawer";
    openButton.className = "mini primary";
    openButton.type = "button";
    openButton.addEventListener("click", () => {
      const state = readChinaReadyGlobal("state");
      if (state) {
        state.pickerOpen = !state.pickerOpen;
      }
      syncMapPatchControls();
    });
    confirmDestinations.insertAdjacentElement("beforebegin", openButton);
  }

  if (!document.getElementById("destinationDrawer")) {
    const drawer = document.createElement("div");
    drawer.id = "destinationDrawer";
    drawer.className = "destination-drawer screen-only is-hidden";
    drawer.setAttribute("aria-label", "Destination library");
    drawer.innerHTML = `
      <div class="drawer-header">
        <div>
          <span class="panel-label" id="drawerKicker"></span>
          <h3 id="drawerTitle"></h3>
        </div>
        <button class="mini" type="button" id="closeDestinationDrawer"></button>
      </div>
      <div class="drawer-presets"></div>
      <div class="drawer-tools"></div>
      <div class="drawer-spots"></div>
    `;
    mapShell.appendChild(drawer);

    drawer.querySelector("#closeDestinationDrawer").addEventListener("click", () => {
      const state = readChinaReadyGlobal("state");
      if (state) {
        state.pickerOpen = false;
      }
      syncMapPatchControls();
    });
  }

  const drawer = document.getElementById("destinationDrawer");
  const drawerPresets = drawer?.querySelector(".drawer-presets");
  const drawerTools = drawer?.querySelector(".drawer-tools");
  const drawerSpots = drawer?.querySelector(".drawer-spots");

  if (drawerPresets && presetRoutes && presetRoutes.parentElement !== drawerPresets) {
    drawerPresets.appendChild(presetRoutes);
  }
  if (drawerTools && spotSearch && spotSearch.parentElement !== drawerTools) {
    drawerTools.appendChild(spotSearch);
  }
  if (drawerTools && categoryTabs && categoryTabs.parentElement !== drawerTools) {
    drawerTools.appendChild(categoryTabs);
  }
  if (drawerSpots && spotList && spotList.parentElement !== drawerSpots) {
    drawerSpots.appendChild(spotList);
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
    ensureDestinationLibraryLayout();
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
  ensureDestinationLibraryLayout();
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
