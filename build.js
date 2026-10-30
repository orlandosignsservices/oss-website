#!/usr/bin/env node
// OSS Website Factory — turns content/*.json into a static site in dist/.
// No dependencies: run with `node build.js`.

const fs = require("fs");
const path = require("path");
const { sections, esc } = require("./src/sections");

const ROOT = __dirname;
const BUILD_ID = Date.now().toString(36);
const DIST = path.join(ROOT, "dist");
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));

const site = read("site.config.json");
const ctx = {
  site,
  photoExists: (src) => fs.existsSync(path.join(ROOT, src.replace(/^\//, ""))),
};

function layout(page, body) {
  const url = `${site.url}/${page.slug ? page.slug + "/" : ""}`;
  const title = page.slug ? `${page.title} | ${site.name}` : `${site.name} | ${page.title}`;
  const nav = site.nav
    .map((n) => {
      const active = n.href === `/${page.slug ? page.slug + "/" : ""}`;
      return `<a href="${n.href}"${active ? ' aria-current="page"' : ""}>${esc(n.label)}</a>`;
    })
    .join("");
  const schema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: site.name,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    areaServed: site.region,
    address: { "@type": "PostalAddress", addressLocality: "Orlando", addressRegion: "FL", addressCountry: "US" },
    sameAs: [site.instagram],
  };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="website">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/css/style.css?v=${BUILD_ID}">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="top">
  <div class="top__inner">
    <a class="logo" href="/"><span class="logo__dot" aria-hidden="true"></span>Orlando Signs Services</a>
    <input type="checkbox" id="menu" class="menu-toggle" aria-label="Open menu">
    <label for="menu" class="menu-btn" aria-hidden="true"><span></span></label>
    <nav class="nav" aria-label="Main">${nav}<a class="btn btn--dark btn--sm" href="${site.cta.href}">${esc(site.cta.label)}</a></nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="foot">
  <div class="wrap foot__inner">
    <div>
      <img class="foot__logo" src="/assets/img/logo.png" alt="${esc(site.name)} logo" width="240" height="78">
      <p>${esc(site.city)} · Serving ${esc(site.region)}</p>
    </div>
    <div>
      <p><a href="${site.phoneHref}">${esc(site.phone)}</a></p>
      <p><a href="mailto:${site.email}">${esc(site.email)}</a></p>
      <p><a href="${site.instagram}">${esc(site.instagramHandle)}</a></p>
    </div>
  </div>
  <p class="foot__legal">© ${new Date().getFullYear()} ${esc(site.name)}</p>
</footer>
<script>
document.querySelectorAll(".tabs").forEach(function (g) {
  g.addEventListener("click", function (e) {
    var t = e.target.closest(".tab"); if (!t) return;
    g.querySelectorAll(".tab").forEach(function (x) { x.classList.toggle("is-on", x === t); x.setAttribute("aria-pressed", x === t); });
    var c = t.dataset.cat;
    g.parentNode.querySelectorAll(".shelf__item").forEach(function (i) { i.classList.toggle("is-dim", c !== "all" && i.dataset.cat !== c); });
  });
});
</script>
</body>
</html>`;
}

function renderPage(page) {
  const body = page.sections
    .map((s) => {
      const fn = sections[s.type];
      if (!fn) throw new Error(`Unknown section type "${s.type}" in page "${page.slug || "home"}"`);
      return fn(s, ctx);
    })
    .join("\n");
  return layout(page, body);
}

// BASE_PATH lets the site work under /oss-website/ on github.io before the custom domain is connected
const BASE = (process.env.BASE_PATH || "").replace(/\/$/, "");
const withBase = (html) => (BASE ? html.replace(/(href|src)="\//g, `$1="${BASE}/`) : html);

function write(slug, html) {
  html = withBase(html);
  const dir = path.join(DIST, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
}

function copyDir(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const f of fs.readdirSync(from)) {
    const a = path.join(from, f), b = path.join(to, f);
    fs.statSync(a).isDirectory() ? copyDir(a, b) : fs.copyFileSync(a, b);
  }
}

// Service, city and service × city pages come from src/generate.js
const generate = require("./src/generate");
function cityPages() {
  return generate(site, read("content/services.json"), read("content/service-areas.json"));
}
// ---- build ----
fs.rmSync(DIST, { recursive: true, force: true });
const pages = fs
  .readdirSync(path.join(ROOT, "content/pages"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => read(`content/pages/${f}`))
  .concat(cityPages());

for (const p of pages) write(p.slug, renderPage(p));
copyDir(path.join(ROOT, "assets"), path.join(DIST, "assets"));

// 404, sitemap, robots, CNAME
fs.writeFileSync(
  path.join(DIST, "404.html"),
  withBase(renderPage({
    slug: "404",
    title: "Page Not Found",
    description: "This page doesn't exist.",
    sections: [{ type: "cta", title: "Page *Not Found*", text: "Let's get you back on track.", buttons: [{ label: "Go Home", href: "/", style: "dark" }] }],
  }))
);
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((p) => `  <url><loc>${site.url}/${p.slug ? p.slug + "/" : ""}</loc><lastmod>${today}</lastmod></url>`)
    .join("\n")}\n</urlset>\n`
);
fs.writeFileSync(path.join(DIST, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
if (process.env.CUSTOM_DOMAIN === "true") fs.writeFileSync(path.join(DIST, "CNAME"), site.domain + "\n");
fs.writeFileSync(path.join(DIST, ".nojekyll"), "");

console.log(`Built ${pages.length} pages into dist/`);
