const languageButton = document.querySelector('#language');
const englishButton = document.createElement('button');
englishButton.id = 'language-en';
englishButton.type = 'button';
englishButton.textContent = 'EN';
englishButton.setAttribute('aria-label', 'English');
languageButton.textContent = 'PT';
languageButton.setAttribute('aria-label', 'Português');
const languageOptions = document.createElement('div');
languageOptions.setAttribute('role', 'group');
languageOptions.setAttribute('aria-label', 'Idioma / Language');
languageOptions.style.cssText = 'display:flex;gap:0.35rem;flex-shrink:0';
languageButton.replaceWith(languageOptions);
languageOptions.append(languageButton, englishButton);

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
  for (const [button, active] of [[languageButton, !english], [englishButton, english]]) {
    button.setAttribute('aria-pressed', String(active));
    button.style.background = active ? 'var(--lime)' : 'transparent';
    button.style.color = active ? 'var(--bg)' : 'var(--text)';
  }
}

languageButton.hidden = false;
languageButton.addEventListener('click', () => setLanguage('pt-BR'));
englishButton.addEventListener('click', () => setLanguage('en'));
setLanguage(document.documentElement.lang);
