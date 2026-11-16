const languageButton = document.querySelector('#language');
const translations = Array.from(document.querySelectorAll('[data-en]'), element => ({
  element,
  portuguese: element.textContent,
  english: element.dataset.en,
}));
const portrait = document.querySelector('.portrait img');
const portugueseAlt = portrait.alt;
const navigation = document.querySelector('nav');

function setLanguage(language) {
  const english = language === 'en';
  document.documentElement.lang = language;
  document.title = english ? 'Oliver Araújo · Python Portfolio' : 'Oliver Araújo · Portfólio Python';
  for (const translation of translations) {
    translation.element.textContent = english ? translation.english : translation.portuguese;
  }
  portrait.alt = english ? portrait.dataset.altEn : portugueseAlt;
  navigation.setAttribute('aria-label', english ? 'Main navigation' : 'Navegação principal');
  languageButton.textContent = english ? 'PT' : 'EN';
  languageButton.setAttribute('aria-label', english ? 'Ler em português' : 'Read in English');
}

languageButton.hidden = false;
languageButton.addEventListener('click', () => {
  setLanguage(document.documentElement.lang === 'en' ? 'pt-BR' : 'en');
});
