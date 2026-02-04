const Store = require('electron-store');
const translations = require('../shared/translations');

const store = new Store();

const LANGUAGE_KEY = 'language';

function getStoredLanguage() {
  return store.get(LANGUAGE_KEY);
}

function setLanguage(lang) {
  if (translations[lang]) {
    store.set(LANGUAGE_KEY, lang);
    return true;
  }
  return false;
}

function getLanguage(systemLocale) {
  const saved = getStoredLanguage();
  if (saved && translations[saved]) return saved;
  const locale = (systemLocale || '').split('-')[0];
  return translations[locale] ? locale : 'en';
}

module.exports = {
  getStoredLanguage,
  setLanguage,
  getLanguage,
  translations
};
