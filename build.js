// Genera el sitio completo de Orlando Signs Services.
// node build.js preview  -> dist-preview/ (enlaces con index.html, para la vista previa)
// node build.js          -> dist/ (direcciones limpias, para GitHub Pages)
const fs = require("fs");
const path = require("path");
const W = require("./content-wix");
const L = require("./content-repair-local");
require("./photos")(W, L);

const MODE = process.argv[2] === "preview" ? "preview" : "prod";
// Mientras el dominio siga en Wix, la copia de prueba no se indexa en Google (evita contenido duplicado).
const NOINDEX = MODE === "preview" || process.env.CUSTOM_DOMAIN !== "true";
const OUT = path.join(__dirname, MODE === "preview" ? "dist-preview" : "dist");
const S = W.site;
const pages = []; // para el sitemap

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "assets", "img"), { recursive: true });
for (const f of fs.readdirSync(path.join(__dirname, "img"))) {
  fs.copyFileSync(path.join(__dirname, "img", f), path.join(OUT, "assets", "img", f));
}

// Mismo widget de Lead Connector que usa hoy la página Contact de Wix
const LC_WIDGET = `<iframe src="https://api.leadconnectorhq.com/widget/booking/BgXVap1OuMe72rGIR61b" style="width:100%;border:none;overflow:hidden;min-height:1675px" scrolling="no" id="BgXVap1OuMe72rGIR61b_quote" title="Request a quote"></iframe><script src="https://link.msgsndr.com/js/form_embed.js" type="text/javascript"></script>`;
// Microsoft Clarity (contador de visitas, proyecto "Orlando Signs Services", ID z9qhz6qxms). No se carga en la vista previa.
const CLARITY = `<script type="text/javascript">(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "z9qhz6qxms");</script>`;

// Botón principal de cotización: abre un email listo con lo que necesitamos para cotizar
const QUOTE_MAILTO = (email) => "mailto:" + email + "?subject=" + encodeURIComponent("Free Quote Request") + "&body=" + encodeURIComponent("Hi Orlando Signs Services,\n\nI'd like a free quote.\n\nName:\nPhone:\nSign address:\nWhat I need (install / removal / repair / other):\nWhen I need it:\n\nPlease attach photos of the sign and the wall or storefront.\n\nThank you!");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const areaBy = Object.fromEntries(L.areas.map((a) => [a.slug, a]));

// ---------- enlaces ----------
function rel(depth) { return depth === 0 ? "./" : "../".repeat(depth); }
function link(depth, slug) {
  if (!slug) return MODE === "preview" ? rel(depth) + "index.html" : rel(depth);
  return rel(depth) + slug + (MODE === "preview" ? "/index.html" : "/");
}
function img(depth, f) { return rel(depth) + "assets/img/" + f; }

// ---------- estilos (look de Wix: negro, naranja, títulos Arial en mayúsculas, Montserrat) ----------
const CSS = `
:root{--ink:#14110f;--black:#0c0b0a;--coal:#171513;--orange:#f05a1a;--orange-dark:#c8460f;--orange-soft:#fff1ea;--paper:#ffffff;--mist:#f6f4f1;--line:#e8e3dd;--muted:#5d5852;--on-dark:#ece8e4;
--display:"Barlow Condensed",Arial Narrow,Arial,sans-serif;--body:Inter,Montserrat,Arial,Helvetica,sans-serif;--r:16px;--shadow:0 1px 2px rgba(20,17,15,.05),0 8px 24px -12px rgba(20,17,15,.18);--shadow-lg:0 2px 4px rgba(20,17,15,.06),0 22px 44px -18px rgba(20,17,15,.32);color-scheme:light}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--body);font-size:16px;line-height:1.65;-webkit-font-smoothing:antialiased}
img{max-width:100%;display:block}
a{color:var(--orange-dark)}
.wrap{max-width:1200px;margin:0 auto;padding-left:max(20px,env(safe-area-inset-left,0px));padding-right:max(20px,env(safe-area-inset-right,0px))}
h1,h2,h3{font-family:var(--display);font-weight:700;text-transform:uppercase;line-height:1.02;text-wrap:balance;margin:0;letter-spacing:.005em}
h1{font-size:clamp(40px,5.6vw,72px);font-weight:800}
h2{font-size:clamp(32px,4vw,52px);color:var(--ink)}
h2::after{content:"";display:block;width:56px;height:4px;border-radius:4px;background:var(--orange);margin-top:16px}
[style*="text-align:center"]>h2::after,h2[style*="text-align:center"]::after,.center h2::after,.cta h2::after{margin-inline:auto}
h3{font-size:22px;letter-spacing:.02em;line-height:1.1}
p{margin:0}
.btns{display:flex;gap:12px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font-family:var(--display);font-weight:700;font-size:18px;text-transform:uppercase;letter-spacing:.06em;text-decoration:none;border-radius:999px;padding:14px 28px;line-height:1;transition:transform .2s,box-shadow .2s,background-color .2s,color .2s}
.btn:hover{transform:translateY(-2px)}
.btn-black{background:var(--black);color:#fff;box-shadow:0 10px 24px -12px rgba(0,0,0,.6)}
.btn-black:hover{background:#2a2622}
.btn-orange{background:var(--orange);color:#fff;box-shadow:0 10px 26px -10px rgba(240,90,26,.75)}
.btn-orange:hover{background:var(--orange-dark)}
.btn-line-dark{border:2px solid var(--black);color:var(--black);background:transparent}
.btn-line-dark:hover{background:var(--black);color:#fff}
.btn-line{border:2px solid rgba(255,255,255,.85);color:#fff;padding:12px 26px}
.btn-line:hover{background:#fff;color:var(--ink)}
a:focus-visible,.btn:focus-visible,summary:focus-visible{outline:3px solid var(--orange);outline-offset:3px}

/* header */
body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:60;background:var(--black)}
.top{background:rgba(12,11,10,.92);-webkit-backdrop-filter:saturate(1.4) blur(14px);backdrop-filter:saturate(1.4) blur(14px);color:#fff;position:sticky;top:env(safe-area-inset-top,0px);z-index:50;border-bottom:1px solid rgba(255,255,255,.07)}
.top .wrap{display:flex;align-items:center;justify-content:space-between;gap:16px;padding-block:12px}
.logo img{height:44px;width:auto}
.nav{display:flex;align-items:center;gap:26px;flex-wrap:wrap}
.nav a,.nav summary{color:#f3efeb;text-decoration:none;font-size:14px;font-weight:500;cursor:pointer;transition:color .2s}
.nav a:hover,.nav summary:hover{color:var(--orange)}
.nav .call{color:#fff;font-size:16px;padding:11px 22px}
.nav .call:hover{color:#fff}
.dd{position:relative}
.dd summary{list-style:none}
.dd summary::-webkit-details-marker{display:none}
.dd summary::after{content:"";display:inline-block;width:6px;height:6px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:translateY(-3px) rotate(45deg);margin-left:7px}
.dd .menu{position:absolute;top:calc(100% + 16px);left:-16px;background:var(--coal);border:1px solid #2c2925;border-radius:14px;padding:8px;min-width:280px;display:grid;gap:2px;z-index:70;box-shadow:0 24px 48px -16px rgba(0,0,0,.6)}
.dd .menu a{padding:9px 12px;border-radius:9px}
.dd .menu a:hover{background:#25221f;color:#fff}
.call{white-space:nowrap}
.burger{display:none}
@media (max-width:980px){
 .nav{display:none}
 .burger{display:block}
 .burger summary{list-style:none;color:#fff;font-family:var(--display);font-weight:700;font-size:18px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;padding:8px 14px;border:1px solid rgba(255,255,255,.25);border-radius:999px}
 .burger summary::-webkit-details-marker{display:none}
 .burger[open] .mnav{display:grid}
 .mnav{display:none;position:absolute;left:0;right:0;top:100%;background:var(--black);padding:12px max(20px,env(safe-area-inset-left,0px)) 24px;gap:2px;border-top:1px solid #222;max-height:calc(100vh - 70px);overflow:auto}
 .mnav a{color:#fff;text-decoration:none;padding:11px 0;border-bottom:1px solid #1e1c1a}
 .mnav .sub{padding-left:14px;font-size:14px;color:#c9c3bd}
 .top .call{display:none}
}

/* hero */
.hero-split{display:grid;grid-template-columns:minmax(0,11fr) minmax(0,13fr);background:radial-gradient(120% 90% at 0% 100%,rgba(240,90,26,.22),transparent 55%),var(--black);color:#fff;position:relative}
.hs-text{display:grid;gap:22px;align-content:center;padding-block:clamp(56px,8vw,112px);padding-left:max(24px,calc((100vw - 1160px)/2));padding-right:clamp(24px,4vw,64px)}
.hs-text h1{margin:0;font-size:clamp(40px,4.6vw,66px)}
.hs-text p{color:var(--on-dark);font-size:17px;line-height:1.7;margin:0;max-width:520px}
.crumb{font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;color:#ffb48f}
.crumb a{color:#ffb48f}
.hs-text .btns{margin-top:6px}
.trust{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;padding:22px 0 0;margin:6px 0 0;border-top:1px solid rgba(255,255,255,.12);font-size:13px;line-height:1.35;color:#bfb8b1;list-style:none;max-width:520px}
.trust li{display:grid;gap:4px}
.trust b{font-family:var(--display);font-size:30px;line-height:1;color:#fff;font-weight:700;letter-spacing:.01em}
.hs-photo{min-height:clamp(340px,38vw,580px);background:#111 center/cover no-repeat}
@media (max-width:820px){.trust b{font-size:24px}.hero-split{grid-template-columns:1fr}.hs-photo{order:-1;min-height:260px}.hs-text{padding-left:max(20px,env(safe-area-inset-left,0px));padding-right:max(20px,env(safe-area-inset-right,0px));padding-block:40px 48px}}
.hero{position:relative;color:#fff;background:#222 center/cover no-repeat}
.hero::before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.25),rgba(0,0,0,.62))}
.hero .wrap{position:relative;padding-block:clamp(90px,14vw,170px) clamp(60px,8vw,90px);text-align:center;display:grid;gap:18px;justify-items:center}
.hero p{max-width:780px;font-size:17px;color:var(--on-dark)}
.hero .btns{justify-content:center}
.mission{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);background:radial-gradient(120% 90% at 0% 100%,rgba(240,90,26,.2),transparent 55%),var(--black);color:#fff}
.mission-text{display:grid;align-content:center;gap:18px;padding:clamp(48px,6vw,96px) clamp(24px,5vw,72px)}
.mission-text h2{color:#fff}
.mission-text p{color:var(--on-dark);font-size:17px;max-width:560px}
.mission-photo{min-height:clamp(320px,36vw,540px);background:#111 center/cover no-repeat}
@media(max-width:820px){.mission{grid-template-columns:1fr}.mission-photo{order:-1;min-height:260px}}

/* secciones */
.sec{padding-block:clamp(64px,8vw,112px)}
.sec.mist{background:var(--mist)}
.sec.dark{background:radial-gradient(90% 120% at 100% 0%,rgba(240,90,26,.16),transparent 50%),var(--black);color:var(--on-dark)}
.sec.dark h2{color:#fff}
.stack{display:grid;gap:22px}
.stack>h2+*{margin-top:10px}
.center{text-align:center;justify-items:center}
.narrow{max-width:820px}
.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:clamp(28px,4vw,56px);align-items:start}
.two>*{min-width:0}
.two>img{box-shadow:var(--shadow-lg);border-radius:var(--r)!important}
.ticks{list-style:none;margin:0;padding:0;display:grid;gap:12px}
.ticks li{position:relative;padding-left:34px;font-size:17px;line-height:1.6}
.ticks li::before{content:"";position:absolute;left:0;top:.2em;width:22px;height:22px;border-radius:50%;background:var(--orange-soft) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23e0521a' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12.5l4.5 4.5L19 7.5'/%3E%3C/svg%3E") center/13px no-repeat}
.sec.dark .ticks li::before{background-color:rgba(240,90,26,.18)}
.ticks strong{color:var(--ink);font-weight:700}
.ticks li:has(strong){color:var(--muted)}
.sec .stack > p{font-size:18px;line-height:1.75;color:#34302c}
.sec.dark .stack > p{color:var(--on-dark)}
.panel{background:var(--paper);border:1px solid var(--line);border-radius:var(--r);padding:30px;display:grid;gap:14px;box-shadow:var(--shadow);align-content:start}
.panel h3{font-size:24px}
.panel h3 a:hover{color:var(--orange)!important}
.panel>a:last-child{font-weight:600;text-decoration:none;justify-self:start}
.panel>a:last-child:not(.btn)::after{content:" →"}
.sec.mist .panel{background:#fff}

/* tarjetas con foto: el texto va debajo de la foto, nunca encima del letrero */
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:22px}
.tile{display:flex;flex-direction:column;border-radius:var(--r);overflow:hidden;background:#fff;color:var(--ink);text-decoration:none;box-shadow:var(--shadow);border:1px solid var(--line);transition:transform .3s,box-shadow .3s}
.tile:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg)}
.tile .ph{position:relative;aspect-ratio:4/3;overflow:hidden;background:#111}
.tile img{position:relative;width:100%;height:100%;object-fit:contain;transition:transform .6s}
.tile img.bgfill{position:absolute;inset:0;object-fit:cover;filter:blur(18px) brightness(.5);transform:scale(1.2)}
.tile:hover img:not(.bgfill){scale:1.04}
.tile span{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:18px 20px;font-family:var(--display);font-weight:700;font-size:20px;letter-spacing:.03em;line-height:1.1;text-transform:uppercase}
.tile span::after{content:"→";color:var(--orange);font-size:22px;transition:transform .3s;flex:none}
.tile:hover span::after{transform:translateX(4px)}
.sec.dark .tile{background:var(--coal);border-color:#2a2724;color:#fff}

.why{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:20px;counter-reset:why}
.why .panel{position:relative;border-top:4px solid var(--orange);padding-top:30px;gap:12px}
.why .panel::before{counter-increment:why;content:counter(why,decimal-leading-zero);font-family:var(--display);font-weight:800;font-size:44px;line-height:1;color:var(--orange)}
.why .panel h3{color:var(--ink);font-size:23px}
.why .panel p{color:var(--muted)}

/* galería: fotos completas en mosaico, sin barras borrosas */
.gallery{columns:4 240px;column-gap:14px}
.gph{break-inside:avoid;margin-bottom:14px;border-radius:12px;overflow:hidden;background:#eee;box-shadow:var(--shadow)}
.gph img{width:100%;height:auto;transition:transform .6s}
.gph:hover img{transform:scale(1.03)}
.gph img.bgfill{display:none}
.two .gallery{columns:2 200px}

.quote{font-size:19px;font-style:italic;max-width:780px}
.reviews{background:#fff;border:1px solid var(--line);border-radius:24px;box-shadow:var(--shadow);padding:clamp(32px,5vw,56px);max-width:860px;margin-inline:auto}
.stars{color:#f5a623;font-size:26px;letter-spacing:4px;line-height:1}

.cta{background:radial-gradient(80% 140% at 85% 0%,#ff8a4c 0%,transparent 55%),linear-gradient(135deg,#f05a1a,#d94a10);color:#fff;position:relative;overflow:hidden}
.cta h2{color:#fff;font-size:clamp(34px,4.4vw,58px)}
.cta h2::after{background:#fff}
.cta .wrap{padding-block:clamp(64px,8vw,104px);display:grid;gap:20px;justify-items:center;text-align:center;position:relative}
.cta p{font-size:17px;max-width:640px}
.cta .btns{justify-content:center}
.cta .btn-line{border-color:#fff}
.cta .btn-line:hover{color:var(--orange-dark)}
.cta .meta{font-size:15px;opacity:.92}
.cta .meta b{user-select:all}

/* AREAS: formato por zonas */
.arealist{border-top:2px solid var(--ink)}
.arow{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.7fr);gap:24px;padding-block:28px;border-bottom:1px solid var(--line);align-items:center}
.arow h3{font-size:clamp(30px,3.6vw,46px);letter-spacing:.01em}
.arow h3 a{color:var(--ink);text-decoration:none;transition:color .2s}
.arow h3 a:hover{color:var(--orange)}
.arow .county{font-size:12px;color:var(--muted);letter-spacing:.14em;text-transform:uppercase;margin-top:8px;font-weight:600}
@media (max-width:760px){.arow{grid-template-columns:1fr;gap:14px}}
.zgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,260px),1fr));gap:12px;align-items:start}
.zone{border:1px solid var(--line);border-radius:14px;background:#fff;box-shadow:var(--shadow);transition:border-color .2s}
.zone:hover{border-color:var(--orange)}
.zone summary{cursor:pointer;list-style:none;padding:16px 20px;font-family:var(--display);font-weight:700;font-size:19px;letter-spacing:.04em;text-transform:uppercase;color:var(--ink);display:flex;justify-content:space-between;align-items:center}
.zone summary::-webkit-details-marker{display:none}
.zone summary::after{content:"+";font-size:24px;line-height:1;color:var(--orange)}
.zone[open] summary::after{content:"−"}
.zone[open]{border-color:var(--orange)}
.zone ul{list-style:none;margin:0;padding:0 20px 16px;display:grid;gap:8px}
.zone li a{color:var(--ink);text-decoration:none;font-size:15px}
.zone li a:hover{color:var(--orange)}
.zone li.all a{font-weight:700;color:var(--orange-dark)}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{display:inline-block;border:1px solid var(--line);color:var(--ink);border-radius:999px;padding:8px 16px;font-family:var(--display);font-weight:600;font-size:16px;letter-spacing:.04em;text-transform:uppercase;text-decoration:none;background:#fff;transition:background-color .2s,color .2s,border-color .2s}
.chip:hover{background:var(--orange);border-color:var(--orange);color:#fff}
.sec.dark .chip{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.16);color:#f3efeb}
.sec.dark .chip:hover{background:var(--orange);border-color:var(--orange);color:#fff}

.note{border-left:4px solid var(--orange);background:#fff;padding:28px 30px;border-radius:0 var(--r) var(--r) 0;box-shadow:var(--shadow)}
.note h3{font-size:26px}
.note p{font-size:18px;line-height:1.7;color:#34302c}
.post p+p{margin-top:0}
.post .stack{gap:14px}
.post h2{font-family:var(--body);font-size:22px;font-weight:700;color:var(--ink);text-transform:none;letter-spacing:-.01em;line-height:1.3;margin-top:18px}
.post h2::after{display:none}
.post p{font-size:17px;line-height:1.8;color:#34302c}
.posts{display:grid;gap:16px}
.posts a{display:block;padding:26px 28px;border:1px solid var(--line);border-radius:var(--r);text-decoration:none;color:var(--ink);box-shadow:var(--shadow);transition:transform .25s,box-shadow .25s,border-color .25s}
.posts a:hover{border-color:var(--orange);transform:translateY(-2px);box-shadow:var(--shadow-lg)}
.posts h3{font-family:var(--body);text-transform:none;letter-spacing:-.01em;font-size:20px;line-height:1.35}

footer{background:var(--black);color:#bdb6af;font-size:14px}
footer .wrap{padding-block:64px 30px;display:grid;gap:32px}
footer .cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:28px}
footer .cols > *{min-width:0;overflow-wrap:anywhere}
footer h4{font-family:var(--display);color:#fff;text-transform:uppercase;letter-spacing:.08em;font-size:17px;margin:0 0 12px}
footer a{color:#bdb6af;text-decoration:none;display:block;padding:3px 0;transition:color .2s}
footer a:hover{color:var(--orange)}
footer .line{border-top:1px solid #24211e;padding-top:20px;font-size:12px;color:#8a837c}
.preview-flag{background:#fff4d6;color:#4a3a00;font-size:13px;text-align:center;padding:8px 16px}
.mbar{display:none}
@media (max-width:900px){.mbar{display:grid;grid-template-columns:1fr 1fr;gap:10px;position:fixed;left:0;right:0;bottom:0;z-index:80;padding:10px max(12px,env(safe-area-inset-left,0px)) calc(10px + env(safe-area-inset-bottom,0px));background:rgba(12,11,10,.94);-webkit-backdrop-filter:saturate(1.4) blur(14px);backdrop-filter:saturate(1.4) blur(14px);border-top:1px solid rgba(255,255,255,.1);box-shadow:0 -10px 30px -12px rgba(0,0,0,.5)}.mbar .btn{padding:14px 10px;font-size:18px;width:100%}.mbar .btn:hover{transform:none}body{padding-bottom:calc(72px + env(safe-area-inset-bottom,0px))}}
@media (prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}
@media (max-width:820px){.hs-text,.mission-text,.cta .wrap{text-align:center;justify-items:center}.sec .stack{text-align:center}.tile span{text-align:left}.hs-text p,.mission-text p{margin-inline:auto}.btns{justify-content:center}.trust{margin-inline:auto;text-align:center}.trust li{justify-items:center}h2::after{margin-inline:auto}.two>.stack,.two>p{text-align:center}.panel,.note{text-align:left}.ticks{text-align:left;justify-self:stretch}.why .panel{text-align:center;justify-items:center}.chips{justify-content:center}.arow{text-align:center}.arow .chips{justify-content:center}.zgrid,.posts{text-align:left}.post .stack{text-align:left;justify-items:stretch}.post h2::after{display:none}footer .cols{text-align:center}footer .line{text-align:center}}
`;

// ---------- piezas ----------
const servicesMenu = W.services.list.map(([n, s]) => [n.replace(/\b\w+/g, (w) => w[0] + w.slice(1).toLowerCase()), s]);

function header(d) {
  const L1 = (s) => link(d, s);
  const repairMenu = [["Sign Repair & Maintenance", W.repair.slug], ["Sign Repair by Area", "sign-repair-areas"], ...L.repairs.map((r) => [r.name, r.slug])];
  const dd = (label, items) => `<details class="dd"><summary>${label}</summary><div class="menu">${items.map(([n, s]) => `<a href="${L1(s)}">${esc(n)}</a>`).join("")}</div></details>`;
  const mobile = [["Home", ""], ["Services", "services"], ...servicesMenu.map(([n, s]) => ["sub:" + n, s]), ["Sign Companies", W.partner.slug], ["Sign Repair", W.repair.slug], ["Sign Repair by Area", "sign-repair-areas"], ...L.repairs.map((r) => ["sub:" + r.name, r.slug]), ["Our Work", "viewourwork"], ["About", "about"], ["Blog", "blog"], ["Contact", "contact"]];
  return `<header class="top"><div class="wrap">
<a class="logo" href="${L1("")}" aria-label="Orlando Signs Services home"><img src="${img(d, "logo.png")}" alt="Orlando Signs Services" width="146" height="44"></a>
<nav class="nav" aria-label="Main">
${dd("Services", [["All Services", "services"], ...servicesMenu])}
<a href="${L1(W.partner.slug)}">Sign Companies</a>
${dd("Sign Repair", repairMenu)}
<a href="${L1("about")}">About</a>
<a href="${L1("contact")}">Contact</a>
${dd("More", [["Our Work", "viewourwork"], ["Blog", "blog"], ["Book Online", "book-online"]])}
<a class="btn btn-orange call" href="${S.phoneHref}">Call Us Now</a>
</nav>
<details class="burger"><summary>Menu</summary><div class="mnav">${mobile.map(([n, s]) => n.startsWith("sub:") ? `<a class="sub" href="${L1(s)}">${esc(n.slice(4))}</a>` : `<a href="${L1(s)}">${esc(n)}</a>`).join("")}<a href="${S.phoneHref}">Call ${S.phone}</a></div></details>
</div></header>`;
}

function footer(d) {
  const L1 = (s) => link(d, s);
  return `<footer><div class="wrap">
<div class="cols">
<div><h4>Orlando Signs Services</h4><p>Orlando, FL · Serving Central Florida</p><p style="margin-top:8px"><a href="mailto:${S.email}" style="display:inline">${S.email}</a><br><a href="tel:${S.phone.replace(/\D/g, "")}" style="display:inline">${S.phone}</a></p><a href="${S.instagram}" style="margin-top:8px">Follow us on Instagram</a></div>
<div><h4>Installation</h4>${servicesMenu.map(([n, s]) => `<a href="${L1(s)}">${esc(n)}</a>`).join("")}<a href="${L1(W.partner.slug)}">For Sign Companies</a></div>
<div><h4>Sign Repair</h4><a href="${L1(W.repair.slug)}">Sign Repair & Maintenance</a>${L.repairs.map((r) => `<a href="${L1(r.slug)}">${esc(r.name)}</a>`).join("")}</div>
<div><h4>Repair by Area</h4>${L.areas.map((a) => `<a href="${L1("sign-repair-" + a.slug)}">${esc(a.name)}</a>`).join("")}<a href="${L1("sign-repair-areas")}"><b>All areas</b></a></div>
</div>
<div class="line">${esc(S.footerLine)} · <a href="${L1("about")}" style="display:inline">About</a> · <a href="${L1("blog")}" style="display:inline">Blog</a> · <a href="${L1("contact")}" style="display:inline">Contact</a></div>
</div></footer>`;
}

function cta(d, title, text) {
  return `<section class="cta"><div class="wrap"><h2>${esc(title)}</h2>${text ? `<p>${esc(text)}</p>` : ""}<div class="btns"><a class="btn btn-black" href="${link(d, "contact")}">Request a Free Quote</a><a class="btn btn-line" href="${S.phoneHref}">Call ${S.phone}</a></div><p class="meta">Email <b>${S.email}</b> · Phone <b>${S.phone}</b></p></div></section>`;
}

const tilePos = { "c33736_8f2fec.jpg": "center 38%", "06307d_559a98.jpg": "center top" }; // tarjetas: dónde enfocar cada foto
const tileZoom = { "c33736_ca2798.jpg": "scale(1.45);transform-origin:center 20%", "c33736_d18eaa.jpg": "scale(1.4);transform-origin:center 30%", "c33736_819ac0.jpg": "scale(1.9);transform-origin:center 32%" }; // Os 4 nov: como estaban pero un poco más alejadas
const tz = (f) => (tileZoom[f] ? ` style="transform:${tileZoom[f]}"` : "");
const tp = (f) => (tilePos[f] ? ` style="object-position:${tilePos[f]}"` : "");
function hero(d, { title, text, photo, crumb, buttons = true, h = "h1", split = true, trust = null }) {
  // Todas las portadas: texto a un lado y foto completa al otro (3 nov 2026, Os: ningún texto encima de un letrero)
  const posMap = { "06307d_559a98.jpg": "center top", "c33736_1920f0.jpg": "center top", "c33736_c8fd0f.jpg": "center 15%", "06307d_715008.jpg": "center 34%", "c33736_0ecda4.jpg": "center 12%", "c33736_9d6cab.jpg": "80% 30%", "c33736_7a62af.jpg": "center 35%", "international-drive-cafe-tu-tu-tango.jpg": "left center", "dr-phillips-bay-hill-jewelers.jpg": "center 22%", "millenia-mattress-mars.jpg": "center 30%", "sanford-relax-or-knot-chair-massage.jpg": "38% center" };
  const fitMap = { "waterford-lakes-peoples-tax.jpg": true, "c33736_de62ad.jpg": true, "c33736_25e10f.jpg": true, "bay-hill-jewelers-before-after.jpg": true, "c33736_8f2fec.jpg": true }; // fotos pequeñas o collages antes/después: se muestran completas // foto ancha y pequeña: se muestra completa sin agrandar
  if (split) {
    // Zonas: texto a la izquierda en fondo oscuro, foto completa a la derecha (el texto nunca tapa el letrero)
    return `<section class="hero-split"><div class="hs-text">${crumb ? `<div class="crumb">${crumb}</div>` : ""}<${h}>${esc(title)}</${h}>${text ? `<p>${esc(text)}</p>` : ""}${buttons ? `<div class="btns"><a class="btn btn-orange" href="${link(d, "contact")}">Request a Free Quote</a><a class="btn btn-line" href="${S.phoneHref}">Call ${S.phone}</a></div>` : ""}${trust ? `<ul class="trust">${trust.map(([b, t]) => `<li><b>${esc(b)}</b> ${esc(t)}</li>`).join("")}</ul>` : ""}</div><div class="hs-photo" style="background-image:url('${img(d, photo)}')${posMap[photo] ? ";background-position:" + posMap[photo] : ""}${fitMap[photo] ? ";background-size:contain;background-color:#0b0d10" : ""}" role="img" aria-label="Sign installed by Orlando Signs Services"></div></section>`;
  }
  const pos = { "06307d_715008.jpg": ";background-position:center 34%", "c33736_0ecda4.jpg": ";background-position:center 19%", "c33736_9d6cab.jpg": ";background-position:80% 30%", "c33736_7a62af.jpg": ";background-position:center 40%" }[photo] || "";
  return `<section class="hero" style="background-image:url('${img(d, photo)}')${pos}"><div class="wrap">${crumb ? `<div class="crumb">${crumb}</div>` : ""}<${h}>${esc(title)}</${h}>${text ? `<p>${esc(text)}</p>` : ""}${buttons ? `<div class="btns"><a class="btn btn-black" href="${link(d, "contact")}">Request a Free Quote</a></div>` : ""}</div></section>`;
}

const gallery = (d, list) => `<div class="gallery">${list.map((f) => { const [src, alt] = Array.isArray(f) ? f : [f, "Commercial sign installation by Orlando Signs Services in Central Florida"]; return `<div class="gph"><img class="bgfill" src="${img(d, src)}" alt="" aria-hidden="true" loading="lazy"><img src="${img(d, src)}" alt="${esc(alt)}" loading="lazy"></div>`; }).join("")}</div>`;
const ticks = (list) => `<ul class="ticks">${list.map((x) => { const i = x.indexOf(": "); return i > 0 && i < 45 ? `<li><strong>${esc(x.slice(0, i))}:</strong> ${esc(x.slice(i + 2))}</li>` : `<li>${esc(x)}</li>`; }).join("")}</ul>`; // etiqueta antes de ":" en negrita

function schema(extra) {
  const base = { "@context": "https://schema.org", "@type": "LocalBusiness", name: S.name, url: S.domain + "/", telephone: "+1-" + S.phone, email: S.email, image: S.domain + "/assets/img/logo.png", address: { "@type": "PostalAddress", addressLocality: "Orlando", addressRegion: "FL", addressCountry: "US" }, areaServed: L.areas.map((a) => a.name).concat(["Central Florida"]) };
  return `<script type="application/ld+json">${JSON.stringify(Object.assign(base, extra || {}))}</script>`;
}

function page({ slug, depth, title, desc, body, extraSchema, hold }) {
  const canonical = S.domain + "/" + (slug ? slug + "/" : "");
  if (!hold) pages.push(slug); // las páginas en espera no van al sitemap
  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">${NOINDEX ? `\n<meta name="robots" content="noindex, nofollow">` : hold ? `\n<meta name="robots" content="noindex, follow">` : ""}
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:type" content="website"><meta property="og:url" content="${canonical}">
<link rel="icon" href="${img(depth, "favicon.svg")}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>${CSS}</style>
${schema(extraSchema)}
${MODE === "preview" ? "" : CLARITY}
</head><body>
${MODE === "preview" ? `<div class="preview-flag">Vista previa privada · todavía no está publicada en orlandosignsservices.com</div>` : ""}
${header(depth)}
<main>${body}</main>
${footer(depth)}
<nav class="mbar" aria-label="Quick contact"><a class="btn btn-orange" href="${S.phoneHref}">Call Now</a><a class="btn btn-line" href="${link(depth, "contact")}">Free Quote</a></nav>
<script src="https://beta.leadconnectorhq.com/loader.js" data-resources-url="https://beta.leadconnectorhq.com/chat-widget/loader.js" data-widget-id="683d338bb8f8b548bfea13d2"></script>
<script>(function(){var n=0,t=setInterval(function(){var w=document.querySelector("chat-widget");if(w&&w.shadowRoot&&w.shadowRoot.querySelector("#lc_text-widget--btn")){var s=document.createElement("style");s.textContent="@media (max-width:900px){#lc_text-widget,#lc_text-widget--btn{right:auto!important;left:16px!important}#lc_text-widget--btn{bottom:calc(84px + env(safe-area-inset-bottom,0px))!important}#lc_text-widget{bottom:calc(150px + env(safe-area-inset-bottom,0px))!important}}";w.shadowRoot.appendChild(s);clearInterval(t)}if(++n>60)clearInterval(t)},500)})();</script>
</body></html>`;
  const dir = slug ? path.join(OUT, slug) : OUT;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
}

// ================== SECCIÓN COMPAÑÍAS (igual que Wix) ==================
{
  const H = W.home, d = 0;
  page({ slug: "", depth: d, title: H.title, desc: H.desc, body: `
${hero(d, { title: H.heroTitle, text: H.heroText, photo: H.heroPhoto, trust: [["500+", "installations"], ["Since 2019", "in Central Florida"], ["3–5 days", "to schedule after permits"]] })}
<section class="sec"><div class="wrap two"><div class="stack"><h2>${esc(H.aboutTitle)}</h2><p>${esc(H.aboutText)}</p></div><img src="${img(d, H.aboutPhoto)}" alt="Pylon sign with Orlando Signs Services logo at sunset" style="border-radius:12px;width:100%;aspect-ratio:4/3;object-fit:cover"></div></section>
<section class="sec mist"><div class="wrap stack"><h2 style="text-align:center">${esc(H.servicesTitle)}</h2><div class="tiles">${H.tiles.map(([t, s, f]) => `<a class="tile" href="${link(d, s)}"><div class="ph"><img class="bgfill" src="${img(d, f)}" alt="" aria-hidden="true" loading="lazy"><img src="${img(d, f)}"${tz(f)} alt="${esc(t)}" loading="lazy"></div><span>${esc(t)}</span></a>`).join("")}</div></div></section>
<section class="sec"><div class="wrap stack"><h2 style="text-align:center">${esc(H.whyTitle)}</h2><div class="why">${H.why.map(([t, x]) => `<div class="panel"><h3>${esc(t)}</h3><p>${esc(x)}</p></div>`).join("")}</div></div></section>
<section class="sec dark"><div class="wrap stack"><h2 style="text-align:center">SIGN REPAIR NEAR YOU</h2><p style="text-align:center;max-width:760px;margin-inline:auto">Lights out, a broken face or a dark letter? Find sign repair in your part of Central Florida.</p><div class="chips" style="justify-content:center">${L.areas.map((a) => `<a class="chip" href="${link(d, "sign-repair-" + a.slug)}">${esc(a.name)}</a>`).join("")}</div></div></section>
<section class="sec"><div class="wrap stack"><h2 style="text-align:center">${esc(H.recentTitle)}</h2>${gallery(d, H.gallery)}<p style="text-align:center">${esc(H.recentText)}</p></div></section>
<section class="sec mist"><div class="wrap"><div class="reviews stack center"><div class="stars" aria-hidden="true">★★★★★</div><h2>SEE WHAT OUR CLIENTS SAY ON GOOGLE</h2><p>Read real reviews from our clients on our Google Business Profile.</p><div class="btns" style="justify-content:center;margin-top:6px"><a class="btn btn-black" href="https://www.google.com/maps/place/?q=place_id:ChIJfYQhWD52Lk0RMZFaQ1kIQCE" target="_blank" rel="noopener">Read Our Google Reviews</a><a class="btn btn-line-dark" href="https://g.page/r/CTGRWkNZCEAhEBM/review" target="_blank" rel="noopener">Leave a Review</a></div></div></div></section>
${cta(d, H.ctaTitle, H.ctaText)}` });
}

{
  const A = W.about, d = 1;
  page({ slug: A.slug, depth: d, title: A.title, desc: A.desc, body: `
${hero(d, { title: A.whoTitle, text: "", photo: A.whoPhoto, buttons: false })}
<section class="sec"><div class="wrap two"><p>${esc(A.who)}</p><img src="${img(d, A.whoPhoto)}" alt="Restaurant storefront channel letter sign installed in Central Florida" style="border-radius:12px;width:100%;aspect-ratio:4/3;object-fit:cover"></div></section>
<section class="mission"><div class="mission-text"><h2>${esc(A.missionTitle)}</h2>${A.mission.map((m) => `<p>${esc(m)}</p>`).join("")}</div><div class="mission-photo" style="background-image:url('${img(d, A.heroPhoto)}')" role="img" aria-label="Three digital display screens at night with the city skyline behind"></div></section>
<section class="sec"><div class="wrap stack"><h2 style="text-align:center">${esc(A.valuesTitle)}</h2><div class="why">${A.values.map(([t, x]) => `<div class="panel"><h3>${esc(t)}</h3><p>${esc(x)}</p></div>`).join("")}</div></div></section>
${cta(d, "READY TO WORK WITH US?", "")}` });
}

{
  const V = W.services, d = 1;
  page({ slug: V.slug, depth: d, title: V.title, desc: V.desc, body: `
${hero(d, { title: V.h1, text: V.intro[0], photo: V.heroPhoto })}
<section class="sec"><div class="wrap narrow" style="margin-inline:auto"><p>${esc(V.intro[1])}</p></div></section>
<section class="sec mist"><div class="wrap stack"><h2 style="text-align:center">SERVICES</h2><div class="two">${V.list.map(([t, s, x, ph]) => `<div class="panel"><img src="${img(d, ph)}" alt="${esc(t.toLowerCase())} by Orlando Signs Services" loading="lazy" style="width:120px;height:120px;border-radius:50%;object-fit:cover"><h3><a href="${link(d, s)}" style="color:var(--ink);text-decoration:none">${esc(t)}</a></h3><p>${esc(x)}</p><a href="${link(d, s)}">Learn more</a></div>`).join("")}</div></div></section>
<section class="sec"><div class="wrap stack"><h2>${esc(V.whyTitle)}</h2>${ticks(V.why)}<p>${esc(V.areas)}</p></div></section>
${cta(d, V.cta, "")}` });
}

function installPage(P, slug) {
  const d = 1;
  page({ slug, depth: d, title: P.title, desc: P.desc, body: `
${hero(d, { title: P.h1, text: P.lead, photo: P.mainPhoto })}
<section class="sec"><div class="wrap two">
<div class="stack"><h2>${esc(P.aboutTitle || P.forTitle)}</h2><p>${esc(P.about || P.forText)}</p><img src="${img(d, P.mainPhoto)}" alt="${esc(P.h1.toLowerCase())} in Central Florida" loading="lazy" style="border-radius:12px;width:100%;aspect-ratio:4/3;object-fit:cover"></div>
<div class="panel"><h3>${P.includes ? "What's included" : esc(P.handleTitle)}</h3>${ticks(P.includes || P.handle)}</div>
</div></section>
<section class="sec mist"><div class="wrap stack"><h2>${P.whyTitle ? esc(P.whyTitle) : "WHY CHOOSE US"}</h2>${ticks(P.why)}</div></section>
<section class="sec"><div class="wrap stack"><h2 style="text-align:center">${esc(P.recentTitle)}</h2>${gallery(d, P.photos)}<p style="text-align:center">${esc(P.areas)}</p></div></section>
${cta(d, P.cta, "")}` });
}
W.installs.forEach((P) => installPage(P, P.slug));
installPage(W.partner, W.partner.slug);

{
  const K = W.work, d = 1;
  page({ slug: K.slug, depth: d, title: K.title, desc: K.desc, body: `
${hero(d, { title: K.h1, text: K.lead, photo: K.groups[0][1][0], buttons: false })}
${K.groups.map(([t, list], i) => `<section class="sec${i % 2 ? " mist" : ""}"><div class="wrap stack"><h2>${esc(t)}</h2>${gallery(d, list)}</div></section>`).join("")}
${cta(d, K.cta, "")}` });
}

{
  const C = W.contact, d = 1;
  page({ slug: C.slug, depth: d, title: C.title, desc: C.desc, body: `
${hero(d, { title: C.h1, text: C.text, photo: C.photo, buttons: false })}
<section class="sec"><div class="wrap stack">
<div class="stack center narrow" style="margin-inline:auto"><h2>GET A FREE QUOTE</h2><p>Send us the address, photos of the sign and what you need. We reply the same day.</p><div class="btns" style="justify-content:center"><a class="btn btn-orange" href="${QUOTE_MAILTO(S.email)}">Email Us for a Free Quote</a><a class="btn btn-line" href="${S.phoneHref}">Call ${S.phone}</a></div><p>Email: <b style="user-select:all">${S.email}</b> · Phone: <b style="user-select:all">${S.phone}</b></p></div>
<div class="stack center narrow" style="margin-inline:auto;margin-top:24px"><h3>Prefer to book a call?</h3><p>Pick a time below and we will call you.</p></div>
<div id="quote-form" style="max-width:900px;width:100%;margin-inline:auto">${LC_WIDGET}</div>
</div></section>` });
}

{
  const d = 1;
  page({ slug: W.book.slug, depth: d, title: W.book.title, desc: W.book.desc, body: `
${hero(d, { title: "BOOK ONLINE", text: "Book a site survey or a sign service call.", photo: "06307d_d58e03.jpg", buttons: false })}
<section class="sec"><div class="wrap stack center narrow" style="margin-inline:auto"><div style="width:100%">${LC_WIDGET}</div><p>Prefer to talk? Call <b style="user-select:all">${S.phone}</b> or email <b style="user-select:all">${S.email}</b>.</p></div></section>` });
}

// Blog (mismas direcciones /blog y /post/...)
{
  const B = W.blog;
  page({ slug: "blog", depth: 1, title: B.title, desc: "Sign installation, permits and repair tips for businesses and sign companies in Orlando and Central Florida.", body: `
${hero(1, { title: "ALL POSTS", text: "", photo: "c33736_0a41f7.jpg", buttons: false })}
<section class="sec"><div class="wrap posts narrow" style="margin-inline:auto">${B.posts.map((p) => `<a href="${link(1, "post/" + p.slug)}"><h3>${esc(p.title)}</h3><p style="color:var(--muted);margin-top:6px">${esc(p.sections[0][1].slice(0, 170))}…</p></a>`).join("")}</div></section>` });
  B.posts.forEach((p) => {
    const d = 2;
    page({ slug: "post/" + p.slug, depth: d, title: p.title, desc: p.sections[0][1].slice(0, 155), extraSchema: {}, body: `
${hero(d, { title: p.title, text: "", photo: "c33736_297144.jpg", buttons: false, crumb: `<a href="${link(d, "blog")}">Blog</a>` })}
<section class="sec post"><div class="wrap narrow stack" style="margin-inline:auto">${p.sections.map(([h, x]) => `<h2>${esc(h)}</h2><p>${esc(x)}</p>`).join("")}</div></section>
${cta(d, "READY TO GET YOUR SIGN INSTALLED?", "")}` });
  });
}

// Wix tenía /portfolio-collections/my-portfolio vacío: se manda a Our Work
{
  const dir = path.join(OUT, "portfolio-collections", "my-portfolio");
  fs.mkdirSync(dir, { recursive: true });
  const to = link(2, "viewourwork");
  fs.writeFileSync(path.join(dir, "index.html"), `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Our Work</title><meta http-equiv="refresh" content="0; url=${to}"><link rel="canonical" href="${S.domain}/viewourwork"></head><body><a href="${to}">Our Work</a></body></html>`);
}

// ================== SIGN REPAIR (Wix + formato por zonas) ==================
{
  const R = W.repair, d = 1;
  page({ slug: R.slug, depth: d, title: R.title, desc: R.desc, body: `
${hero(d, { title: R.h1, text: R.lead, photo: R.mainPhoto })}
<section class="sec"><div class="wrap two">
<div class="stack"><h2>${esc(R.serviceTitle)}</h2><p>${esc(R.serviceText)}</p></div>
<div class="panel"><h3>${esc(R.listTitle)}</h3>${ticks(R.list)}</div>
</div></section>
<section class="sec dark"><div class="wrap stack"><h2>WHAT DOES YOUR SIGN NEED?</h2><div class="tiles">${L.repairs.map((r) => `<a class="tile" href="${link(d, r.slug)}"><div class="ph"><img class="bgfill" src="${img(d, r.photos[0])}" alt="" aria-hidden="true" loading="lazy"><img src="${img(d, r.photos[0])}" alt="${esc(r.name)}" loading="lazy"></div><span>${esc(r.name)}</span></a>`).join("")}</div></div></section>
<section class="sec mist"><div class="wrap two"><div class="stack"><h2>${esc(R.packageTitle)}</h2><p>${esc(R.packageIntro)}</p>${ticks(R.package)}<p>${esc(R.packageOutro)}</p></div><div>${gallery(d, [L.repairs[0].photos[1], L.repairs[1].photos[0]])}</div></div></section>
<section class="sec"><div class="wrap stack"><h2>SIGN REPAIR BY AREA</h2><p>Click your area to see the repairs we do there.</p><div class="zgrid">${L.areas.map((a) => `<details class="zone"><summary>${esc(a.name)}</summary><ul>${L.repairs.map((r) => `<li><a href="${link(d, r.slug + "-" + a.slug)}">${esc(r.name)}</a></li>`).join("")}<li class="all"><a href="${link(d, "sign-repair-" + a.slug)}">All sign repair in ${esc(a.name)}</a></li></ul></details>`).join("")}</div></div></section>
<section class="sec mist"><div class="wrap stack"><h2 style="text-align:center">${esc(R.recentTitle)}</h2>${gallery(d, R.photos)}<p style="text-align:center">${esc(R.areas)}</p></div></section>
${newSigns(d)}
${cta(d, R.cta, "")}` });
}


// Nota para clientes locales: también hacemos letreros nuevos (sin enlazar a la sección de compañías)
function newSigns(d, place) {
  const where = place ? ` in ${esc(place)}` : "";
  return `<section class="sec mist"><div class="wrap two"><div class="stack"><h2>NEED A NEW SIGN INSTALLED?</h2><p>Besides repairs and maintenance, we also install new signs for local businesses${where}: channel letters, lightboxes, cabinet signs, monument and pylon signs.</p></div><div class="panel"><h3>Installation services</h3><ul class="ticks"><li>Sign installation and electrical connection</li><li>Site survey before every job</li><li>Removal of the old sign</li></ul><a class="btn btn-orange" href="${link(d, "contact")}" style="justify-self:start">Ask About Installation</a></div></div></section>`;
}
function areaList(d, only) {
  return `<div class="arealist">${(only || L.areas).map((a) => `<div class="arow"><div><h3><a href="${link(d, "sign-repair-" + a.slug)}">${esc(a.name)}</a></h3><div class="county">${esc(a.county)}</div></div><div class="chips">${L.repairs.map((r) => `<a class="chip" href="${link(d, r.slug + "-" + a.slug)}">${esc(r.name)}</a>`).join("")}</div></div>`).join("")}</div>`;
}

// Página "Areas" (la lista estilo GLPX)
page({ slug: "sign-repair-areas", depth: 1, title: "Sign Repair Areas in Orlando & Central Florida | Orlando Signs Services", desc: "Find business sign repair near you: LED repair, sign face replacement, channel letter repair, lighting, cleaning and maintenance in Downtown Orlando, I-Drive, Dr. Phillips, Lake Nona, Winter Park, Kissimmee and more.", body: `
${hero(1, { title: "SIGN REPAIR AREAS WE SERVE", text: "Pick your area and the repair you need. Every page shows what we fix there and how we bring signs back to life.", photo: "06307d_715008.jpg", crumb: `<a href="${link(1, W.repair.slug)}">Sign Repair</a>` })}
<section class="sec"><div class="wrap">${areaList(1)}</div></section>
<section class="sec mist"><div class="wrap stack center narrow" style="margin-inline:auto"><h2>DON'T SEE YOUR AREA?</h2><p>We repair signs across all of Central Florida, from Sanford to Clermont and Kissimmee. Call or send photos of your sign and the address.</p></div></section>
${newSigns(1)}
${cta(1, "SIGN NOT LOOKING ITS BEST?", "")}` });

// Una página por zona
L.areas.forEach((a) => {
  const d = 1;
  const near = a.nearby.map((s) => areaBy[s]);
  page({ slug: "sign-repair-" + a.slug, depth: d, title: `Sign Repair in ${a.name}, FL | LED, Faces & Letters | Orlando Signs Services`, desc: `Business sign repair in ${a.name}: LED and lighting repair, sign face replacement, channel letter repair, neon to LED, cleaning and maintenance. Request a quote.`, extraSchema: { areaServed: a.name }, body: `
${hero(d, { title: `SIGN REPAIR IN ${a.name}`, text: a.about, photo: a.photo, split: true, crumb: `<a href="${link(d, "sign-repair-areas")}">Sign Repair Areas</a> · ${esc(a.county)}` })}
<section class="sec"><div class="wrap stack"><h2>WHAT DOES YOUR SIGN NEED IN ${esc(a.name)}?</h2><div class="two">${L.repairs.map((r) => `<div class="panel"><h3><a href="${link(d, r.slug + "-" + a.slug)}" style="color:var(--ink);text-decoration:none">${esc(r.name)}</a></h3><p>${esc(r.short)}</p><a href="${link(d, r.slug + "-" + a.slug)}" aria-label="${esc(r.name)} in ${esc(a.name)}">Learn more</a></div>`).join("")}</div></div></section>
<section class="sec mist"><div class="wrap two"><div class="stack"><h2>SIGNS WE SERVICE HERE</h2><p>Common business signs here include ${esc(a.typical)}. Every sign is different, so we quote each one after a quick look.</p></div><div class="note"><h3 style="margin-bottom:8px">BACK TO LIFE</h3><p>We bring tired signs back to life: new faces, brighter LEDs, upgraded electrical, cleaning and fresh paint, so your business looks its best day and night.</p></div></div></section>
<section class="sec"><div class="wrap stack"><h2>NEARBY AREAS</h2>${areaList(d, near)}</div></section>
${newSigns(d, a.name)}
${cta(d, `NEED A SIGN REPAIRED IN ${a.name}?`, "Send photos of your sign and the address. We reply the same day.")}` });
});

// Una página por reparación (todas las zonas)
L.repairs.forEach((r) => {
  const d = 1;
  page({ slug: r.slug, depth: d, title: `${r.name} Orlando & Central Florida | Orlando Signs Services`, desc: `${r.name} for businesses in Orlando and Central Florida. ${r.short} Request a quote.`, body: `
${hero(d, { title: `${r.name.toUpperCase()} IN ORLANDO & CENTRAL FLORIDA`, text: r.intro, photo: r.photos[0], crumb: `<a href="${link(d, W.repair.slug)}">Sign Repair</a>` })}
<section class="sec"><div class="wrap two"><div class="panel"><h3>Signs it needs attention</h3>${ticks(r.signs)}</div><div class="panel"><h3>What we do</h3>${ticks(r.fix)}</div></div></section>
<section class="sec mist"><div class="wrap stack"><h2>${esc(r.name)} BY AREA</h2><div class="chips">${L.areas.map((a) => `<a class="chip" href="${link(d, r.slug + "-" + a.slug)}">${esc(a.name)}</a>`).join("")}</div><div class="note"><p>${esc(r.renew)}</p></div></div></section>
<section class="sec"><div class="wrap stack"><h2>RECENT SIGN WORK</h2>${gallery(d, r.photos)}</div></section>
${newSigns(d)}
${cta(d, `NEED ${r.name.toUpperCase()}?`, "Send photos of your sign and the address. We reply the same day.")}` });
});

// Reparación × zona
L.repairs.forEach((r) => L.areas.forEach((a) => {
  const d = 1, slug = r.slug + "-" + a.slug;
  const others = L.repairs.filter((x) => x !== r);
  page({ slug, depth: d, hold: !(L.live || []).includes(slug), title: `${r.name} in ${a.name}, FL | Orlando Signs Services`, desc: `${r.name} in ${a.name}. ${r.short} Local crew, fast quotes. Call ${S.phone}.`, extraSchema: { areaServed: a.name, makesOffer: { "@type": "Offer", itemOffered: { "@type": "Service", name: `${r.name} in ${a.name}` } } }, body: `
${hero(d, { title: `${r.name} IN ${a.name}`, text: r.intro, photo: a.photo, split: true, crumb: `<a href="${link(d, "sign-repair-" + a.slug)}">Sign Repair in ${esc(a.name)}</a> · ${esc(a.county)}` })}
<section class="sec"><div class="wrap two">
<div class="stack"><h2>${esc(r.name)} FOR LOCAL BUSINESSES</h2><p>${esc(a.about)}</p><p>Common business signs here include ${esc(a.typical)}.</p></div>
<div class="panel"><h3>Signs it needs attention</h3>${ticks(r.signs)}</div>
</div></section>
<section class="sec mist"><div class="wrap two">
<div class="panel"><h3>What we do</h3>${ticks(r.fix)}</div>
<div class="note"><h3 style="margin-bottom:8px">${esc(a.name)}</h3><p>${esc(r.renew)}</p></div>
</div></section>
<section class="sec"><div class="wrap stack"><h2>RECENT SIGN WORK IN CENTRAL FLORIDA</h2>${gallery(d, r.photos)}</div></section>
<section class="sec dark"><div class="wrap stack"><h2>OTHER SIGN REPAIRS</h2><div class="chips">${others.map((x) => `<a class="chip" href="${link(d, x.slug + "-" + a.slug)}">${esc(x.name)}</a>`).join("")}</div>
<h2 style="margin-top:18px">${esc(r.name)} NEARBY</h2><div class="chips">${a.nearby.map((s) => `<a class="chip" href="${link(d, r.slug + "-" + s)}">${esc(areaBy[s].name)}</a>`).join("")}</div></div></section>
${newSigns(d, a.name)}
${cta(d, `NEED ${r.name.toUpperCase()} IN ${a.name}?`, "Send photos of your sign and the address. We reply the same day.")}` });
}));

// ---------- 404 (página de error con menú, teléfono y formulario) ----------
{
  page({ slug: "__404", depth: 0, title: "Page not found | Orlando Signs Services", desc: "This page was not found. Call Orlando Signs Services or send us your project.", body: `
<section class="sec"><div class="wrap stack center"><h1>PAGE NOT FOUND</h1><p>The page you are looking for moved or no longer exists.</p><p>Call us at <a href="tel:${S.phone.replace(/\D/g, "")}">${S.phone}</a> or send us your project and we reply the same day.</p><div class="btns"><a class="btn" href="${link(0, "contact")}">CONTACT US</a> <a class="btn" href="${link(0, "")}">GO TO HOME</a></div></div></section>` });
  pages.pop();
  const f = path.join(OUT, "__404", "index.html");
  const base = (process.env.BASE_PATH || "") + "/";
  let h = fs.readFileSync(f, "utf8").replace("<head>", `<head>\n<base href="${base}">`);
  if (!/name="robots"/.test(h)) h = h.replace("</title>", `</title>\n<meta name="robots" content="noindex">`);
  fs.writeFileSync(path.join(OUT, "404.html"), h);
  fs.rmSync(path.join(OUT, "__404"), { recursive: true });
}

// ---------- sitemap, robots, 404 ----------
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `<url><loc>${S.domain}/${p ? p + "/" : ""}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, "robots.txt"), NOINDEX ? `User-agent: *\nDisallow: /\n` : `User-agent: *\nAllow: /\nSitemap: ${S.domain}/sitemap.xml\n`);
console.log(MODE, "pages:", pages.length, "->", OUT);
