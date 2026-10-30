// Section renderers. Each takes (data, ctx) and returns HTML.
// ctx = { site, photoExists(src) }

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// "*word*" -> orange highlight
const hl = (s = "") => esc(s).replace(/\*(.+?)\*/g, '<span class="hl">$1</span>');

const button = (b) =>
  `<a class="btn btn--${esc(b.style || "primary")}" href="${esc(b.href)}">${esc(b.label)}</a>`;

const eyebrow = (t) => (t ? `<p class="eyebrow">${esc(t)}</p>` : "");

function photo(p, ctx, cls = "") {
  if (ctx.photoExists(p.src)) {
    return `<img class="${cls}" src="${esc(p.src)}" alt="${esc(p.alt || p.caption || "")}" loading="lazy">`;
  }
  // Placeholder until the real photo is added to assets/img
  return `<div class="ph ${cls}" role="img" aria-label="${esc(p.alt || p.caption || "Photo")}"><span>${esc(
    p.src.split("/").pop()
  )}</span></div>`;
}

const sections = {
  hero(d, ctx) {
    const lines = d.title.map((l) => `<span class="hero__line">${hl(l)}</span>`).join("");
    const photos = (d.photos || [])
      .slice(0, 4)
      .map((p, i) => `<figure class="hero__photo hero__photo--${i + 1}">${photo(p, ctx)}</figure>`)
      .join("");
    return `<section class="hero dots">
  ${photos}
  <div class="hero__inner">
    ${d.eyebrow ? `<p class="tag">${esc(d.eyebrow)}</p>` : ""}
    <h1 class="hero__title">${lines}</h1>
    <p class="hero__text">${esc(d.text)}</p>
    <div class="btns">${(d.buttons || []).map(button).join("")}</div>
  </div>
</section>`;
  },

  ticker(d, ctx) {
    const items = (d.items || ctx.site.ticker).map((t) => `<span>${esc(t)}</span><i aria-hidden="true">✦</i>`).join("");
    return `<div class="ticker" aria-label="Services"><div class="ticker__track">${items}${items}</div></div>`;
  },

  cards(d) {
    const cards = d.cards
      .map(
        (c, i) => `<article class="card${c.dark ? " card--dark" : ""}">
      <span class="card__num">${String(i + 1).padStart(2, "0")}</span>
      <h3>${c.href ? `<a class="card__link" href="${esc(c.href)}">${esc(c.title)}</a>` : esc(c.title)}</h3>
      <p>${esc(c.text)}</p>
      ${c.href ? `<span class="card__more" aria-hidden="true">Learn more →</span>` : ""}
    </article>`
      )
      .join("");
    return `<section class="section stripes"${d.id ? ` id="${esc(d.id)}"` : ""}>
  <div class="wrap">
    ${eyebrow(d.eyebrow)}
    <h2 class="h2">${hl(d.title)}</h2>
    <div class="grid grid--3">${cards}</div>
  </div>
</section>`;
  },

  split(d) {
    const items = d.items
      .map(
        (it) => `<article class="panel${it.dark ? " panel--dark" : ""}">
      <p class="tag">${esc(it.label)}</p>
      <h3 class="h3">${esc(it.title)}</h3>
      <p>${esc(it.text)}</p>
      ${it.button ? button({ ...it.button, style: it.dark ? "primary" : "dark" }) : ""}
    </article>`
      )
      .join("");
    return `<section class="section">
  <div class="wrap">
    ${eyebrow(d.eyebrow)}
    <div class="grid grid--2">${items}</div>
  </div>
</section>`;
  },

  process(d) {
    const steps = d.steps
      .map(
        (s, i) => `<li class="step">
      <span class="step__num">${String(i + 1).padStart(2, "0")}</span>
      <h3>${esc(s.title)}</h3>
      <p>${esc(s.text)}</p>
    </li>`
      )
      .join("");
    return `<section class="section section--dark dots-dark">
  <div class="wrap">
    ${eyebrow(d.eyebrow)}
    <h2 class="h2">${hl(d.title)}</h2>
    <ol class="steps">${steps}</ol>
  </div>
</section>`;
  },

  gallery(d, ctx) {
    const figs = d.photos
      .map((p) => `<figure class="shot">${photo(p, ctx)}<figcaption>${esc(p.caption)}</figcaption></figure>`)
      .join("");
    return `<section class="section">
  <div class="wrap">
    ${eyebrow(d.eyebrow)}
    <h2 class="h2">${hl(d.title)}</h2>
    <div class="grid grid--3">${figs}</div>
  </div>
</section>`;
  },

  cta(d) {
    return `<section class="cta">
  <div class="wrap wrap--narrow">
    <h2 class="h2">${hl(d.title)}</h2>
    <p>${esc(d.text)}</p>
    <div class="btns btns--center">${(d.buttons || []).map(button).join("")}</div>
  </div>
</section>`;
  },

  checklist(d) {
    const items = d.items.map((t) => `<li>${esc(t)}</li>`).join("");
    return `<section class="section stripes">
  <div class="wrap grid grid--2">
    <article class="panel">
      ${eyebrow(d.eyebrow)}
      <h2 class="h3">${hl(d.title)}</h2>
      <p>${esc(d.text)}</p>
      ${d.note ? `<p class="note">${esc(d.note)}</p>` : ""}
    </article>
    <article class="panel panel--dark">
      <p class="tag">${esc(d.listTitle || "What's included")}</p>
      <ul class="checks">${items}</ul>
    </article>
  </div>
</section>`;
  },

  links(d) {
    const chips = (arr) => arr.map((l) => `<a class="chip" href="${esc(l.href)}">${esc(l.label)}</a>`).join("");
    const more =
      d.moreTitle && d.moreLinks && d.moreLinks.length
        ? `<h2 class="h2">${hl(d.moreTitle)}</h2><div class="chips">${chips(d.moreLinks)}</div>`
        : "";
    return `<section class="section stripes">
  <div class="wrap">
    ${eyebrow(d.eyebrow)}
    <h2 class="h2">${hl(d.title)}</h2>
    ${d.text ? `<p class="lead">${esc(d.text)}</p>` : ""}
    <div class="chips">${chips(d.links)}</div>
    ${more}
  </div>
</section>`;
  },

  contact(d, ctx) {
    const s = ctx.site;
    const form = d.formEmbed
      ? d.formEmbed
      : `<div class="ph ph--form"><span>Quote form goes here</span></div>`;
    return `<section class="section stripes">
  <div class="wrap grid grid--2 contact">
    <div class="panel panel--dark">
      ${eyebrow(d.eyebrow)}
      <h1 class="h2">${hl(d.title)}</h1>
      <p>${esc(d.text)}</p>
      <ul class="contact__list">
        <li><strong>Call</strong> <a href="${esc(s.phoneHref)}">${esc(s.phone)}</a></li>
        <li><strong>Email</strong> <a href="mailto:${esc(s.email)}">${esc(s.email)}</a></li>
        <li><strong>Instagram</strong> <a href="${esc(s.instagram)}">${esc(s.instagramHandle)}</a></li>
        <li><strong>Based in</strong> ${esc(s.city)} · Serving ${esc(s.region)}</li>
      </ul>
    </div>
    <div class="panel">${form}</div>
  </div>
</section>`;
  },
};

module.exports = { sections, esc, hl };
