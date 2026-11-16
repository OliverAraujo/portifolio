const spanishTranslations = {
  "Skip to content": "Ir al contenido",
  "About": "Sobre mí",
  "Projects": "Proyectos",
  "Contact": "Contacto",
  "I’m transitioning from IT to back-end development and building my skills with Python.": "Estoy pasando del área de TI al desarrollo back-end y construyendo mis conocimientos de Python.",
  "Explore projects ↘": "Ver proyectos ↘",
  "Get in touch": "Contacto",
  "Selected projects from my development journey.": "Proyectos seleccionados de mi trayectoria en desarrollo.",
  "Featured projects": "Proyectos destacados",
  "Loading repositories…": "Cargando repositorios…",
  "No pinned projects yet.": "Todavía no hay proyectos fijados para mostrar.",
  "The repository list is temporarily unavailable.": "La lista de repositorios no está disponible temporalmente.",
  "View GitHub profile ↗": "Ver perfil de GitHub ↗",
  "About me": "Sobre mí",
  "I come from an IT background and am studying Python to move into back-end development. I want to apply what I learn to practical problems, such as tracking IT support requests.": "Vengo del área de TI y estudio Python para pasar al desarrollo back-end. Quiero aplicar lo que aprendo a problemas prácticos, como organizar y dar seguimiento a solicitudes de soporte.",
  "What I’m studying": "Lo que estoy estudiando",
  "Programming fundamentals": "Lógica de programación",
  "Based in Brazil and open to international remote opportunities in back-end development.": "Estoy en Brasil y abierto a oportunidades remotas internacionales en desarrollo back-end.",
  "Connect on LinkedIn ↗": "Contáctame en LinkedIn ↗",
  "Email ↗": "Correo electrónico ↗",
  "Back to top ↑": "Volver arriba ↑"
};
const languageSettings = {
  'pt-BR': { label: '🇧🇷 PT', name: 'Português', title: 'Oliver Araújo · Portfólio Python', navigation: 'Navegação principal', portrait: 'Oliver Araújo com camisa azul' },
  en: { label: '🇺🇸 ENG', name: 'English', title: 'Oliver Araújo · Python Portfolio', navigation: 'Main navigation', portrait: 'Oliver Araújo wearing a blue shirt' },
  es: { label: '🇪🇸 ESP', name: 'Español', title: 'Oliver Araújo · Portafolio Python', navigation: 'Navegación principal', portrait: 'Oliver Araújo con camisa azul' },
};
const translations = Array.from(document.querySelectorAll('[data-en]'), element => ({
  element,
  'pt-BR': element.textContent,
  en: element.dataset.en,
  es: spanishTranslations[element.dataset.en],
}));
const languageOptions = document.createElement('div');
languageOptions.setAttribute('role', 'group');
languageOptions.setAttribute('aria-label', 'Idioma / Language');
languageOptions.style.cssText = 'display:flex;gap:0.35rem;flex-shrink:0';
document.querySelector('#language').replaceWith(languageOptions);
document.querySelector('.header').style.flexWrap = 'wrap';
const languageButtons = new Map();

function setLanguage(language) {
  const settings = languageSettings[language];
  document.documentElement.lang = language;
  document.title = settings.title;
  for (const translation of translations) {
    translation.element.textContent = translation[language];
  }
  document.querySelector('.portrait img').alt = settings.portrait;
  document.querySelector('nav').setAttribute('aria-label', settings.navigation);
  for (const [code, button] of languageButtons) {
    const active = code === language;
    button.setAttribute('aria-pressed', String(active));
    button.style.background = active ? 'var(--lime)' : 'transparent';
    button.style.color = active ? 'var(--bg)' : 'var(--text)';
  }
}
for (const [code, settings] of Object.entries(languageSettings)) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = settings.label;
  button.setAttribute('aria-label', settings.name);
  button.addEventListener('click', () => setLanguage(code));
  languageButtons.set(code, button);
  languageOptions.append(button);
}
setLanguage(document.documentElement.lang);
