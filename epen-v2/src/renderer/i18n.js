(function () {
  function applyTranslations(translations, lang) {
    if (!translations || !translations[lang]) return;
    var t = translations[lang];
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var text = t[key];
      if (text == null) return;
      if (el.tagName === 'BUTTON') {
        var span = el.querySelector('span');
        if (span) span.textContent = text;
        else el.textContent = text;
      } else {
        el.textContent = text;
      }
    });
  }
  window.applyTranslations = applyTranslations;
})();
