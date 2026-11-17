import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { languageSettings, flagIcons, translations } from './translations.js';
import { aboutContent } from './about.js';
import portraitUrl from '../oliver.webp';
import '../style.css';

function Reveal({ children, className = '', ...props }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        ref.current.classList.add('animate-in');
        observer.disconnect();
      }
    }, { threshold: 0.08 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <section {...props} ref={ref} className={className}>{children}</section>;
}

function LanguageSelector({ language, onChange }) {
  return (
    <div className="language-options" role="group" aria-label="Idioma / Language">
      {Object.entries(languageSettings).map(([code, settings]) => (
        <button key={code} type="button" aria-label={settings.name}
          aria-pressed={code === language} onClick={() => onChange(code)}
          dangerouslySetInnerHTML={{ __html: flagIcons[code] }} />
      ))}
    </div>
  );
}

function Header({ language, onLanguageChange, t }) {
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);
  useEffect(() => {
    const close = () => setOpen(false);
    function closeOutside(event) {
      if (!headerRef.current.contains(event.target)) close();
    }
    function escape(event) {
      if (event.key === 'Escape') {
        close();
        toggleRef.current.focus();
      }
    }
    const media = window.matchMedia('(max-width: 730px)');
    media.addEventListener('change', close);
    if (open) {
      document.addEventListener('click', closeOutside);
      document.addEventListener('keydown', escape);
    }
    return () => {
      media.removeEventListener('change', close);
      document.removeEventListener('click', closeOutside);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);
  return (
    <header className="wrap header" ref={headerRef}>
      <a className="brand" href="#inicio" aria-label="Oliver Araújo">OA<span>.</span></a>
      <button className="menu-toggle" ref={toggleRef} type="button" aria-label="Menu"
        aria-controls="main-navigation" aria-expanded={open} onClick={() => setOpen(value => !value)}>
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>
      <nav id="main-navigation" aria-label={languageSettings[language].navigation} data-open={open}>
        {[['sobre', 'About'], ['projetos', 'Projects'], ['contato', 'Contact']].map(([id, label]) => (
          <a key={id} href={'#' + id} onClick={() => setOpen(false)}>{t(label)}</a>
        ))}
      </nav>
      <LanguageSelector language={language} onChange={onLanguageChange} />
    </header>
  );
}

function Hero({ language, t }) {
  return (
    <section className="wrap hero" aria-labelledby="nome">
      <div className="intro animate-in">
        <h1 id="nome">Oliver Araújo<span>.</span></h1>
        <p className="role">Back-end · Python</p>
        <p className="lede">{t('I’m transitioning from IT to back-end development and building my skills with Python.')}</p>
        <div className="actions">
          <a className="button primary" href="#projetos">{t('Explore projects ↘')}</a>
          <a className="button" href="#contato">{t('Get in touch')}</a>
        </div>
      </div>
      <div className="portrait animate-in">
        <img src={portraitUrl} alt={languageSettings[language].portrait} fetchPriority="high" />
      </div>
    </section>
  );
}

function ProjectCard({ project, t }) {
  return (
    <li className="card project-card">
      <div className="project-symbol" aria-hidden="true"><span>&gt;_</span></div>
      <div className="project-copy">
        <h3><a href={project.html_url}>{project.name}</a></h3>
        {project.description && <p>{project.description}</p>}
        <div className="project-links">
          {project.language && <span className="tag">{project.language}</span>}
          <a href={project.html_url}>{t('View code ↗')}</a>
        </div>
      </div>
    </li>
  );
}

function FeaturedProjects({ t }) {
  const [state, setState] = useState({ status: 'loading', projects: [] });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    let active = true;
    setState({ status: 'loading', projects: [] });
    async function load() {
      try {
        const response = await fetch('https://raw.githubusercontent.com/OliverAraujo/portifolio/main/pinned-projects.json', {
          cache: 'no-store', signal: controller.signal,
        });
        if (!response.ok) throw new Error('Project request failed');
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid projects');
        const projects = data.filter(project => project && typeof project.name === 'string'
          && typeof project.html_url === 'string'
          && /^https:\/\/github\.com\/[^/?#]+\/[^/?#]+$/.test(project.html_url));
        if (active) setState({ status: 'ready', projects });
      } catch {
        if (active) setState({ status: 'error', projects: [] });
      } finally {
        window.clearTimeout(timeout);
      }
    }
    load();
    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [attempt]);
  return (
    <Reveal className="wrap section" id="projetos">
      <h2>{t('Featured projects')}</h2>
      <p className="muted">{t('Selected projects from my development journey.')}</p>
      {state.status === 'loading' && <p className="muted" role="status">{t('Loading repositories…')}</p>}
      {state.status === 'error' && (
        <div role="status">
          <p className="muted">{t('The repository list is temporarily unavailable.')}</p>
          <button className="button" type="button" onClick={() => setAttempt(value => value + 1)}>{t('Try again')}</button>
        </div>
      )}
      {state.status === 'ready' && state.projects.length === 0 && <p className="muted">{t('No pinned projects yet.')}</p>}
      {state.projects.length > 0 && <ul className="cards">{state.projects.map(project => (
        <ProjectCard key={project.html_url} project={project} t={t} />
      ))}</ul>}
      <a className="button github-link" href="https://github.com/OliverAraujo">{t('View GitHub profile ↗')}</a>
    </Reveal>
  );
}

function About({ t, language }) {
  const content = aboutContent[language];
  return (
    <Reveal className="wrap section about" id="sobre">
      <h2>{t('About me')}</h2>
      <div>
        {content.paragraphs.map(text => <p key={text}>{text}</p>)}
        <h3>{content.technicalTitle}</h3>
        <ul>{content.skills.map(skill => <li key={skill}>{skill}</li>)}</ul>
        <h3>{content.careerTitle}</h3>
        <p>{content.roles}</p>
        {content.closing.map(text => <p key={text}>{text}</p>)}
      </div>
    </Reveal>
  );
}

function Contact({ t }) {
  return (
    <Reveal className="wrap section contact" id="contato">
      <h2>{t('Contact')}</h2>
      <p>{t('Based in Brazil and open to international remote opportunities in back-end development.')}</p>
      <div className="actions">
        <a className="button" href="https://www.linkedin.com/in/oliver-ara%C3%BAjo/">{t('Connect on LinkedIn ↗')}</a>
        <a className="button" href="https://www.instagram.com/euoliveraraujo/">Instagram ↗</a>
        <a className="button" href="mailto:oliverandre1994@gmail.com">{t('Email ↗')}</a>
      </div>
    </Reveal>
  );
}

function Footer({ t }) {
  return <footer className="wrap footer"><span>© Oliver Araújo</span><a href="#inicio">{t('Back to top ↑')}</a></footer>;
}

function App() {
  const [language, setLanguage] = useState('pt-BR');
  const t = text => language === 'en' ? text : translations[language][text] || text;
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = languageSettings[language].title;
  }, [language]);
  return (
    <>
      <a className="skip" href="#conteudo">{t('Skip to content')}</a>
      <Header language={language} onLanguageChange={setLanguage} t={t} />
      <main id="conteudo">
        <Hero language={language} t={t} />
        <FeaturedProjects t={t} />
        <About t={t} language={language} />
        <Contact t={t} />
      </main>
      <Footer t={t} />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
