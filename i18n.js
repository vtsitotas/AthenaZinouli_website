// Bilingual toggle (EL primary / EN). Each translatable element carries its
// English text in a data-en attribute; the original (Greek) HTML is cached in
// data-el on first switch so it can be restored.
(function () {
  const STORAGE_KEY = "site-lang";

  const TITLES = {
    el: "Οδοντιατρείο Αθηνάς Ζηνούλη | Οδοντίατρος Λάρισα",
    en: "Dental Office of Athena Zinouli | Dentist Larissa",
  };

  function applyLang(lang) {
    const isEn = lang === "en";
    document.documentElement.lang = isEn ? "en" : "el";

    document.querySelectorAll("[data-en]").forEach((el) => {
      if (!el.hasAttribute("data-el")) {
        el.setAttribute("data-el", el.innerHTML);
      }
      el.innerHTML = isEn
        ? el.getAttribute("data-en")
        : el.getAttribute("data-el");
    });

    document.title = TITLES[isEn ? "en" : "el"];

    // The toggle shows the language you can switch TO.
    const label = document.querySelector(".lang-toggle-label");
    if (label) label.textContent = isEn ? "ΕΛ" : "EN";

    try {
      localStorage.setItem(STORAGE_KEY, isEn ? "en" : "el");
    } catch (e) {}
  }

  function init() {
    let saved = "el";
    try {
      saved = localStorage.getItem(STORAGE_KEY) || "el";
    } catch (e) {}
    applyLang(saved);

    const toggle = document.getElementById("langToggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        const current = document.documentElement.lang === "en" ? "en" : "el";
        applyLang(current === "en" ? "el" : "en");
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
