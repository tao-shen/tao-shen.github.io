import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  ArrowUp,
  ArrowRight,
  Sun,
  Moon,
  List,
  X,
  EnvelopeSimple,
  GithubLogo,
  GraduationCap,
  Copy,
  Check,
  MagnifyingGlass,
  Globe,
  CaretDown,
  BookOpen,
  Code,
} from "@phosphor-icons/react";
import { copy, links, products, directions } from "./content.js";
import { publications, profile } from "./publications.js";
import LossLandscape from "./LossLandscape.jsx";
import FigureDialog from "./FigureDialog.jsx";

const icon = { size: 18, weight: "regular", "aria-hidden": true };
const cx = (...items) => items.filter(Boolean).join(" ");
const External = ({ href, children, className = "", ...props }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props}>
    {children}
  </a>
);

function CopyButton({ text, label, c, className = "" }) {
  const [status, setStatus] = useState("");
  useEffect(() => {
    if (!status) return;
    const id = setTimeout(() => setStatus(""), 2400);
    return () => clearTimeout(id);
  }, [status]);
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }
  return (
    <span className="copy-control">
      <button
        type="button"
        onClick={handleCopy}
        className={cx("copy-button", className)}
        aria-label={status === "copied" ? c.copied : label}
        title={label}
      >
        {status === "copied" ? <Check {...icon} /> : <Copy {...icon} />}
      </button>
      <span className="copy-status" role="status">
        {status === "copied" ? c.copied : status === "error" ? c.copyError : ""}
      </span>
    </span>
  );
}

function SectionHeading({ eyebrow, title, subtitle, children }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2>{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}

function ProductRow({ product: p, lang, c, index }) {
  return (
    <article className="product-row grid gap-7 md:grid-cols-[300px_1fr] md:gap-10">
      <External href={p.url} className="product-art" aria-label={`${p.name} — ${p.action[lang]}`}>
        <img
          src={`./images/${p.image}`}
          alt={lang ? `${p.name} 产品概念图` : `${p.name} concept illustration`}
          width="640"
          height="400"
          loading="lazy"
        />
      </External>
      <div className="py-1">
        <div className="product-meta flex items-center gap-3">
          <span className="mono">0{index + 1}</span>
          <span>{p.type[lang]}</span>
        </div>
        <h3>
          <External href={p.url}>
            {p.name}
            <ArrowUpRight {...icon} size={21} />
          </External>
        </h3>
        <p className="product-title">{p.title[lang]}</p>
        <p className="product-description">{p.description[lang]}</p>
        <div className="product-links flex flex-wrap items-center gap-5">
          <External href={p.url} className="text-link">
            {p.action[lang]}
            <ArrowUpRight {...icon} size={15} />
          </External>
          {p.code && (
            <External href={p.code} className="muted-link">
              <GithubLogo {...icon} size={16} />
              {c.code}
            </External>
          )}
        </div>
      </div>
    </article>
  );
}

function ResearchSection({ lang, c, onExplore }) {
  const [active, setActive] = useState(0);
  const direction = directions[active];
  const keyPapers = publications.filter((p) => p.selected && p.topics.includes(direction.key)).slice(0, 3);
  return (
    <section id="research" className="page-section">
      <SectionHeading eyebrow={c.chapter2} title={c.research} subtitle={c.researchSub} />
      <p className="research-intro">{c.researchIntro}</p>
      <div className="research-landscape">
        <LossLandscape active={active} onSelect={setActive} lang={lang} />
      </div>
      <div className="research-detail" id="research-panel" aria-label={lang ? "研究方向详情" : "Research direction details"}>
        <div>
          <p className="eyebrow">
            0{active + 1} · {direction.dates}
          </p>
          <h3>{direction.label[lang]}</h3>
          <p className="research-detail-subtitle">{direction.subtitle[lang]}</p>
          <button className="outline-link" onClick={() => onExplore(direction.key)}>
            {publications.filter((p) => p.topics.includes(direction.key)).length} {c.results}
            <ArrowRight {...icon} size={15} />
          </button>
        </div>
        <div>
          <p>{direction.description[lang]}</p>
          <ul className="research-paper-links">
            {keyPapers.map((p) => (
              <li key={p.id}>
                <External href={p.url}>
                  {p.shortTitle || p.title.split(":")[0]}
                  <ArrowUpRight {...icon} size={12} />
                </External>
                <span>{p.year}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Authors({ value }) {
  return value
    .split(/(Tao Shen(?:\*)?|T Shen(?:\*)?)/g)
    .map((part, i) => (/^(Tao Shen|T Shen)/.test(part) ? <strong key={i}>{part}</strong> : <React.Fragment key={i}>{part}</React.Fragment>));
}

function Publication({ p, c, lang, onOpenFigure }) {
  const [open, setOpen] = useState(false);
  const bibtex =
    p.bibtex ||
    `@${p.venue.toLowerCase().includes("arxiv") ? "misc" : "article"}{${p.id},\n  title = {${p.title}},\n  author = {${p.authors}},\n  year = {${
      p.year
    }},\n  url = {${p.url}}\n}`;
  return (
    <article className={cx("publication", p.figure && "publication-illustrated")} id={`pub-${p.id}`}>
      {p.figure ? (
        <figure className="paper-figure">
          <button type="button" onClick={() => onOpenFigure(p)} aria-label={`${c.figure}: ${p.shortTitle || p.title}`}>
            <img src={`./images/papers/${p.figure.file}`} alt={p.figure.alt[lang]} width={p.figure.width} height={p.figure.height} loading="lazy" />
            <span className="figure-expand">
              <MagnifyingGlass {...icon} size={14} />
              {c.figure}
            </span>
          </button>
          <figcaption>
            <span>{p.figure.label}</span>
            {p.figure.caption[lang]}
          </figcaption>
        </figure>
      ) : (
        <div className="pub-year mono">{p.year}</div>
      )}
      <div className="min-w-0">
        <div className="pub-meta flex flex-wrap items-center gap-2">
          <span>{p.venue}</span>
          {p.firstAuthor && (
            <span className="author-badge">{p.coFirst ? (lang ? "共同第一作者" : "Co-first author") : lang ? "第一作者" : "First author"}</span>
          )}
        </div>
        <h3>
          <External href={p.url}>{p.title}</External>
        </h3>
        <p className="pub-authors">
          <Authors value={p.authors} />
        </p>
        {p.summary && <p className="pub-summary">{Array.isArray(p.summary) ? p.summary[lang] : p.summary}</p>}
        <div className="pub-links flex flex-wrap items-center gap-4">
          <External href={p.url}>
            <BookOpen {...icon} size={14} />
            {c.paper}
            <ArrowUpRight {...icon} size={12} />
          </External>
          {p.code && (
            <External href={p.code}>
              <Code {...icon} size={14} />
              {c.code}
            </External>
          )}
          <button onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={`cite-${p.id}`}>
            {c.citation}
            <CaretDown {...icon} size={12} className={open ? "rotate-180" : ""} />
          </button>
        </div>
        {open && (
          <div className="citation-box" id={`cite-${p.id}`}>
            <div className="flex items-center justify-between gap-3">
              <span className="mono">BibTeX</span>
              <CopyButton text={bibtex} label={c.copyCitation} c={c} />
            </div>
            <pre tabIndex={0}>{bibtex}</pre>
          </div>
        )}
      </div>
    </article>
  );
}

export default function App() {
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("light");
  const [menu, setMenu] = useState(false);
  const [selection, setSelection] = useState("selected");
  const [topic, setTopic] = useState("all");
  const [firstOnly, setFirstOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const [figurePaper, setFigurePaper] = useState(null);
  const lang = language === "zh" ? 1 : 0;
  const c = copy[language];
  const sectionIds = ["building", "research", "publications", "journey"];
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tao-lang");
      if (saved === "zh") setLanguage("zh");
      setTheme(document.documentElement.dataset.theme || "light");
    } catch {}
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActiveSection(entry.target.id);
      },
      { rootMargin: "-12% 0px -65% 0px" }
    );
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang ? "zh-CN" : "en";
  }, [language]);
  useEffect(() => {
    if (!menu) return;
    const close = (e) => {
      if (e.key === "Escape") {
        setMenu(false);
        document.getElementById("menu-button")?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menu]);
  const changeLanguage = () => {
    const next = language === "en" ? "zh" : "en";
    setLanguage(next);
    try {
      localStorage.setItem("tao-lang", next);
    } catch {}
  };
  const changeTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("tao-theme", next);
    } catch {}
  };
  const reset = () => {
    setSelection("all");
    setTopic("all");
    setFirstOnly(false);
    setQuery("");
  };
  const filtered = useMemo(
    () =>
      publications.filter(
        (p) =>
          (selection !== "selected" || p.selected) &&
          (topic === "all" || (p.topics || []).includes(topic)) &&
          (!firstOnly || p.firstAuthor) &&
          `${p.title} ${p.authors} ${p.venue} ${p.year}`.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [selection, topic, firstOnly, query]
  );
  const explore = (key) => {
    setSelection("all");
    setTopic(key);
    setFirstOnly(false);
    setQuery("");
    document
      .getElementById("publications")
      ?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  return (
    <>
      <a href="#main" className="skip-link">
        {c.skip}
      </a>
      <header className="site-header">
        <div className="page-width flex h-full items-center justify-between gap-4">
          <a href="#top" className="wordmark" aria-label="Tao Shen, back to top">
            <span className="status-dot" />
            Tao Shen<span className="wordmark-separator">/</span>
            <span className="wordmark-note">Research & Build</span>
          </a>
          <nav className={cx("desktop-nav", menu && "is-open")} aria-label={lang ? "主导航" : "Main navigation"} id="site-nav">
            {sectionIds.map((id, i) => (
              <a key={id} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined} onClick={() => setMenu(false)}>
                {c.nav[i]}
              </a>
            ))}
          </nav>
          <div className="header-actions flex items-center gap-2">
            <a href="#contact" className="contact-pill">
              <EnvelopeSimple {...icon} size={16} />
              {c.contact}
            </a>
            <button className="language-button" onClick={changeLanguage} aria-label={lang ? "Switch to English" : "切换至中文"}>
              {lang ? "EN" : "中"}
            </button>
            <button className="icon-button" onClick={changeTheme} aria-label={theme === "light" ? c.themeDark : c.themeLight}>
              {theme === "light" ? <Moon {...icon} /> : <Sun {...icon} />}
            </button>
            <button
              id="menu-button"
              className="icon-button menu-toggle"
              onClick={() => setMenu(!menu)}
              aria-label={menu ? c.menuClose : c.menuOpen}
              aria-controls="site-nav"
              aria-expanded={menu}
            >
              {menu ? <X {...icon} /> : <List {...icon} />}
            </button>
          </div>
        </div>
      </header>
      <main id="main" className="page-width">
        <section className="hero" id="top" aria-labelledby="hero-name">
          <div className="profile-card grid items-center gap-9 md:grid-cols-[1fr_264px]">
            <div className="profile-pattern" aria-hidden="true" />
            <div className="relative min-w-0">
              <p className="affiliation flex items-center gap-3">
                <span className="status-dot" />
                {c.affiliation}
              </p>
              <div className="name-row flex items-baseline gap-4">
                <h1 id="hero-name">Tao Shen</h1>
                {profile.chineseName && <span className="chinese-name">{profile.chineseName}</span>}
              </div>
              <p className="profile-role">{c.role}</p>
              <p className="profile-subtitle">{c.subtitle}</p>
              <dl className="profile-facts grid gap-5 sm:grid-cols-2">
                <div>
                  <dt>{c.degreeLabel}</dt>
                  <dd>{c.degree}</dd>
                </div>
                <div>
                  <dt>{c.focusLabel}</dt>
                  <dd>{c.focus}</dd>
                </div>
              </dl>
            </div>
            <figure className="portrait-wrap relative">
              {profile.portrait ? (
                <img className="portrait" src={`./images/${profile.portrait}`} alt="Tao Shen" width="528" height="568" fetchPriority="high" />
              ) : (
                <div className="portrait-monogram" aria-label="Tao Shen monogram">
                  ts<span>research → build</span>
                </div>
              )}
              <figcaption>
                <span className="status-dot" />
                {lang ? "从研究者，到创业者" : "From researcher to founder"}
              </figcaption>
            </figure>
          </div>
          <div className="intro-grid grid gap-4 lg:grid-cols-[1.07fr_1.14fr_.9fr]">
            <article className="intro-card intro-current">
              <p className="eyebrow">{c.currentLabel}</p>
              <p>{c.current}</p>
              <External href={links.company} className="text-link">
                democra.ai
                <ArrowUpRight {...icon} size={16} />
              </External>
            </article>
            <article className="intro-card">
              <p className="eyebrow">{c.aboutLabel}</p>
              <p>{c.about}</p>
              <a className="text-link" href="#journey">
                {lang ? "查看我的经历" : "A little more about me"}
                <ArrowRight {...icon} size={16} />
              </a>
            </article>
            <div className="intro-card contact-card">
              <p className="eyebrow">{c.elsewhere}</p>
              <ul>
                <li>
                  <External href={links.scholar}>
                    <GraduationCap {...icon} />
                    <span>{c.scholar}</span>
                    <ArrowUpRight {...icon} size={15} />
                  </External>
                </li>
                <li>
                  <External href={links.github}>
                    <GithubLogo {...icon} />
                    <span>GitHub</span>
                    <ArrowUpRight {...icon} size={15} />
                  </External>
                </li>
                <li>
                  <External href={links.company}>
                    <Globe {...icon} />
                    <span>Democra AI</span>
                    <ArrowUpRight {...icon} size={15} />
                  </External>
                </li>
                <li>
                  <a href={`mailto:${links.email}`}>
                    <EnvelopeSimple {...icon} />
                    <span>{c.email}</span>
                    <ArrowUpRight {...icon} size={15} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="chapter-bridge flex flex-wrap items-center justify-between gap-3">
            <span>{lang ? "一条贯穿始终的主线" : "ONE CONTINUING THREAD"}</span>
            <p>
              {lang ? "联邦学习" : "Federated learning"} <ArrowRight {...icon} size={13} /> {lang ? "分布式智能" : "Distributed intelligence"}{" "}
              <ArrowRight {...icon} size={13} /> <strong>{lang ? "AI 民主化" : "AI democratization"}</strong>
            </p>
          </div>
        </section>

        <section id="building" className="page-section">
          <SectionHeading eyebrow={c.chapter1} title={c.building} subtitle={c.buildingSub}>
            <External href={links.company} className="outline-link">
              {c.visitCompany}
              <ArrowUpRight {...icon} />
            </External>
          </SectionHeading>
          <div className="mission-grid grid gap-6 md:grid-cols-[1.2fr_1fr]">
            <p className="mission-statement">{c.mission}</p>
            <p className="mission-description">{c.missionSmall}</p>
          </div>
          <p className="eyebrow product-section-label">{c.productsLabel}</p>
          <div>
            {products.map((p, i) => (
              <ProductRow key={p.name} product={p} lang={lang} c={c} index={i} />
            ))}
          </div>
        </section>

        <ResearchSection lang={lang} c={c} onExplore={explore} />

        <section id="publications" className="page-section">
          <SectionHeading eyebrow={c.chapter3} title={c.pubs} subtitle={c.pubsSub}>
            <External href={links.scholar} className="text-link">
              {c.completeRecord}
              <ArrowUpRight {...icon} />
            </External>
          </SectionHeading>
          <div className="publication-controls">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="segmented" role="group" aria-label={lang ? "论文范围" : "Publication collection"}>
                <button
                  aria-pressed={selection === "selected"}
                  onClick={() => {
                    setSelection("selected");
                    setTopic("all");
                  }}
                  className={selection === "selected" ? "selected" : ""}
                >
                  {c.selected}
                  <span>{publications.filter((p) => p.selected).length}</span>
                </button>
                <button aria-pressed={selection === "all"} onClick={() => setSelection("all")} className={selection === "all" ? "selected" : ""}>
                  {c.all}
                  <span>{publications.length}</span>
                </button>
              </div>
              <label className="search-box">
                <MagnifyingGlass {...icon} />
                <span className="sr-only">{c.searchLabel}</span>
                <input type="search" placeholder={c.search} value={query} onChange={(e) => setQuery(e.target.value)} />
              </label>
            </div>
            <div className="filters-row flex flex-wrap items-center justify-between gap-4">
              <div className="topic-filters flex flex-wrap gap-2" role="group" aria-label={lang ? "按研究方向筛选" : "Filter by research area"}>
                {[{ key: "all", label: ["All topics", "所有方向"] }, ...directions].map((d) => (
                  <button
                    key={d.key}
                    aria-pressed={topic === d.key}
                    className={topic === d.key ? "active" : ""}
                    onClick={() => {
                      setTopic(d.key);
                      if (d.key !== "all") setSelection("all");
                    }}
                  >
                    {d.label[lang]}
                  </button>
                ))}
              </div>
              <label className="first-author-filter flex items-center gap-2">
                <input type="checkbox" checked={firstOnly} onChange={(e) => setFirstOnly(e.target.checked)} />
                {c.firstAuthor}
              </label>
            </div>
          </div>
          <div className="results-label" role="status" aria-live="polite">
            {filtered.length} {c.results}
          </div>
          <div className="publication-list">
            {filtered.map((p) => (
              <Publication key={p.id} p={p} c={c} lang={lang} onOpenFigure={setFigurePaper} />
            ))}
            {filtered.length === 0 && (
              <div className="empty-state">
                <MagnifyingGlass {...icon} size={28} />
                <p>{c.noResults}</p>
                <button onClick={reset} className="outline-link">
                  {c.reset}
                  <ArrowRight {...icon} />
                </button>
              </div>
            )}
          </div>
          <p className="pub-note">{c.pubNote}</p>
        </section>

        <section id="journey" className="page-section">
          <SectionHeading eyebrow={c.chapter4} title={c.journey} />
          <div className="career-chapters">
            <article className="career-chapter">
              <p className="eyebrow">01 · {c.researcherPeriod}</p>
              <h3>{c.researcher}</h3>
              <p className="career-affiliation">{c.researcherDetail}</p>
              <p>{c.researcherText}</p>
              <a className="text-link" href="#research">
                {lang ? "研究与论文" : "Research & publications"}
                <ArrowUpRight {...icon} size={15} />
              </a>
            </article>
            <div className="career-transition" aria-hidden="true">
              <ArrowRight size={22} />
              <span className="mono">2025</span>
            </div>
            <article className="career-chapter career-current">
              <p className="eyebrow">02 · {c.now}</p>
              <h3>Founder</h3>
              <p className="career-affiliation">{c.founderDetail}</p>
              <p>{c.founderText}</p>
              <a className="text-link" href="#building">
                {lang ? "产品与实践" : "Products & practice"}
                <ArrowUpRight {...icon} size={15} />
              </a>
            </article>
          </div>
        </section>

        <section id="contact" className="contact-section grid gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow">{c.contactLabel}</p>
            <h2>
              {c.contactTitle.split("\n").map((line, i) => (
                <React.Fragment key={line}>
                  {i > 0 && <br />}
                  {line}
                </React.Fragment>
              ))}
            </h2>
          </div>
          <div className="contact-detail">
            <p>{c.contactText}</p>
            <div className="flex flex-wrap items-center gap-3">
              <a href={`mailto:${links.businessEmail}`} className="primary-link">
                {c.emailMe}
                <ArrowUpRight {...icon} />
              </a>
              <span className="contact-email">{links.businessEmail}</span>
              <CopyButton text={links.businessEmail} c={c} label={c.copyEmail} />
            </div>
            <p className="academic-contact">
              {c.academicContact}
              <br />
              <a href={`mailto:${links.email}`}>{links.email}</a>
            </p>
          </div>
        </section>
      </main>
      <FigureDialog paper={figurePaper} lang={lang} c={c} onClose={() => setFigurePaper(null)} />
      <footer className="page-width site-footer">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <a href="#top" className="footer-name">
              Tao Shen
            </a>
            <p>{c.footer}</p>
          </div>
          <div className="footer-links flex flex-wrap gap-5">
            <External href={links.github}>
              GitHub
              <ArrowUpRight {...icon} size={13} />
            </External>
            <External href={links.scholar}>
              Scholar
              <ArrowUpRight {...icon} size={13} />
            </External>
            <External href={links.x}>
              X<ArrowUpRight {...icon} size={13} />
            </External>
            <External href={links.orcid}>
              ORCID
              <ArrowUpRight {...icon} size={13} />
            </External>
          </div>
        </div>
        <div className="footer-bottom flex flex-wrap items-center justify-between gap-3">
          <span>
            © 2026 Tao Shen <span aria-hidden="true">·</span> {c.updated}
          </span>
          <a href="#top">
            {c.back}
            <ArrowUp {...icon} size={14} />
          </a>
        </div>
      </footer>
    </>
  );
}
