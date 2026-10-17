/* =====================================================
   CONTEÚDO EDITÁVEL
   Para adicionar um projeto ou tecnologia, edite as listas abaixo.
   ===================================================== */

// Tecnologias: basta acrescentar um nome à lista.
const technologies = ["Python", "JavaScript", "HTML", "CSS", "SQL", "Java", "Git", "GitHub"];

// Projetos: para adicionar outro, copie um bloco e preencha os dados.
// image: caminho de uma imagem em assets/images/projetos/ (opcional; sem ela o card mostra o endereço do site)
// demo e repo: links (opcionais; só aparecem se preenchidos)
// placeholder: true marca um card como exemplo (use só enquanto não houver projeto real)
const projects = [
  {
    title: "Gambyte",
    description: "Análise de partidas de xadrez a partir do PGN. Classifica cada lance, calcula a precisão de cada lado e mostra o gráfico de vantagem ao longo da partida, usando o motor Stockfish.",
    tech: ["JavaScript", "Stockfish", "HTML", "CSS"],
    image: "assets/images/projetos/gambyte.png",
    demo: "https://gambyte.com.br",
    repo: "https://github.com/fidamaa/Gambyte"
  },
  {
    title: "PENSAÍ",
    description: "Treino de Matemática do ENEM contra o relógio. São dez questões de Matemática Básica, Estatística e Geometria, com tempo limite por dificuldade e um ranking dos mais rápidos.",
    tech: ["JavaScript", "HTML", "CSS"],
    image: "assets/images/projetos/pensai.png",
    demo: "https://pensaienem.web.app",
    repo: ""
  }
];

/* =====================================================
   RENDERIZAÇÃO
   ===================================================== */

// Evita que texto com caracteres especiais quebre o HTML
function escapeHTML(text) {
  const el = document.createElement("div");
  el.textContent = text;
  return el.innerHTML.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function renderTechnologies() {
  const list = document.getElementById("tech-list");
  if (!list) return;
  list.innerHTML = technologies.map(name => `<li>${escapeHTML(name)}</li>`).join("");
}

function projectCard(p) {
  const host = p.demo ? new URL(p.demo).hostname : "";
  const exampleBadge = p.placeholder ? '<span class="badge">Exemplo, substituir</span>' : "";
  let media;
  if (p.image) {
    media = `<div class="card-media has-preview"><img src="${escapeHTML(p.image)}" alt="Captura de tela do projeto ${escapeHTML(p.title)}" loading="lazy" width="640" height="400">${host ? `<div class="site-frame preview-address"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="host">${escapeHTML(host)}</span></div>` : ""}${exampleBadge}</div>`;
  } else if (host) {
    // Sem imagem: mostra uma "janela de navegador" com o endereço do site
    media = `<div class="card-media is-site" aria-hidden="true"><div class="site-frame"><span class="dots"><i></i><i></i><i></i></span><span class="host">${escapeHTML(host)}</span></div></div>`;
  } else {
    media = `<div class="card-media is-empty"><span>Imagem do projeto</span>${exampleBadge}</div>`;
  }

  const tags = p.tech.map(t => `<li>${escapeHTML(t)}</li>`).join("");

  const links = [];
  if (p.demo) links.push(`<a href="${escapeHTML(p.demo)}" target="_blank" rel="noopener noreferrer">Ver projeto</a>`);
  if (p.repo) links.push(`<a href="${escapeHTML(p.repo)}" target="_blank" rel="noopener noreferrer">Ver código</a>`);

  return `
    <article class="card reveal">
      ${media}
      <div class="card-body">
        <h3>${escapeHTML(p.title)}</h3>
        <p>${escapeHTML(p.description)}</p>
        <ul class="chips" aria-label="Tecnologias utilizadas">${tags}</ul>
        ${links.length ? `<div class="card-links">${links.join("")}</div>` : ""}
      </div>
    </article>`;
}

function renderProjects() {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;
  grid.innerHTML = projects.length
    ? (projects.some(p => !p.placeholder) ? projects.filter(p => !p.placeholder) : projects).map(projectCard).join("")
    : '<p class="empty-state">Os primeiros projetos serão publicados aqui em breve.</p>';
}

/* =====================================================
   COMPORTAMENTOS
   ===================================================== */

// Menu mobile
function setupMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("menu");
  if (!toggle || !nav) return;

  const setOpen = open => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.classList.toggle("menu-open", open);
    if (open) nav.querySelector("a")?.focus();
  };

  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", e => {
    if (!nav.classList.contains("open")) return;
    if (e.key === "Escape") { setOpen(false); toggle.focus(); }
    if (e.key === "Tab") {
      const controls = [toggle, ...nav.querySelectorAll("a")];
      const index = controls.indexOf(document.activeElement);
      if (e.shiftKey && index === 0) { e.preventDefault(); controls.at(-1).focus(); }
      else if (!e.shiftKey && index === controls.length - 1) { e.preventDefault(); toggle.focus(); }
    }
  });
  window.matchMedia("(max-width: 760px)").addEventListener("change", () => setOpen(false));
}

// Elementos aparecem suavemente ao entrar na tela
function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(el => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => el.classList.add("will-reveal"));
  items.forEach(el => observer.observe(el));
}

// Destaca no menu a seção que está na tela
function setupActiveLink() {
  const links = document.querySelectorAll(".nav a");
  const sections = [...links].map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(s => observer.observe(s));
}

// Mostra a foto só se o arquivo existir
function setupPhoto() {
  const figure = document.querySelector(".hero-photo");
  const img = figure && figure.querySelector("img");
  if (!img) return;
  const probe = new Image();
  probe.onload = () => { figure.hidden = false; };
  probe.src = img.getAttribute("src");
}

document.addEventListener("DOMContentLoaded", () => {
  renderTechnologies();
  renderProjects();
  setupMenu();
  setupReveal();
  setupActiveLink();
  setupPhoto();
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
