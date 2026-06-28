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
