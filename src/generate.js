// Page generators: builds the service pages, the city pages and every
// service × city page from content/services.json and content/service-areas.json.

module.exports = function generate(site, servicesData, areasData) {
  const { services } = servicesData;
  const { cities } = areasData;
  const quoteBtns = (dark = true) => [
    { label: "Get a Free Quote", href: "/contact/", style: dark ? "dark" : "primary" },
    { label: `Call ${site.phone}`, href: site.phoneHref, style: dark ? "ghost-light" : "ghost" },
  ];
  const isInstall = (s) => /installation/i.test(s.name);
  const comboSlug = (s, c) => `${s.slug}-${c.slug}`;
  const pages = [];

  // /services/
  pages.push({
    slug: "services",
    title: "Sign Services in Orlando & Central Florida",
    description: `${site.name}: ${services.map((s) => s.name).join(", ")}. Serving Orlando and Central Florida.`,
    sections: [
      {
        type: "cards",
        eyebrow: "What we do",
        title: servicesData.indexTitle,
        cards: services.map((s, i) => ({ title: s.name, text: s.short, href: `/services/${s.slug}/`, dark: i % 3 === 1 })),
      },
      { type: "ticker" },
      { type: "cta", title: "Not Sure What *You Need*?", text: "Send a photo of the sign and the address. We'll tell you what it needs.", buttons: quoteBtns() },
    ],
  });

  // /services/<service>/
  for (const s of services) {
    pages.push({
      slug: `services/${s.slug}`,
      title: `${s.name} in Orlando & Central Florida`,
      description: `${s.intro} Serving Orlando and Central Florida. Call ${site.phone}.`,
      sections: [
        {
          type: "hero",
          eyebrow: "Orlando · Central Florida",
          title: [s.name, "*across Central Florida.*"],
          text: `${s.intro} ${isInstall(s) ? "Experienced crews and the right equipment for every job." : ""}`.trim(),
          buttons: quoteBtns(false),
          photos: [],
        },
        { type: "ticker" },
        {
          type: "checklist",
          eyebrow: s.audience,
          title: `${s.name}, *Done Right*`,
          text: s.short,
          items: s.includes,
        },
        {
          type: "links",
          eyebrow: "Service areas",
          title: `${s.name} *Near You*`,
          text: `Choose your city for ${s.name.toLowerCase()} in your area.`,
          links: cities.map((c) => ({ label: c.name, href: `/${comboSlug(s, c)}/` })),
        },
        { type: "cta", title: `Need ${s.name}?`.replace(/(\S+)\?$/, "*$1*?"), text: "Send the address, photos and what you need. We reply the same day.", buttons: quoteBtns() },
      ],
    });
  }

  // /service-areas/
  pages.push({
    slug: "service-areas",
    title: "Service Areas in Central Florida",
    description: `Cities where ${site.name} installs and services signs: ${cities.map((c) => c.name).join(", ")}.`,
    sections: [
      {
        type: "links",
        eyebrow: "Where we work",
        title: areasData.indexTitle,
        text: areasData.indexText,
        links: cities.map((c) => ({ label: c.name, href: `/service-areas/${c.slug}/` })),
      },
      { type: "cta", title: "Project *Somewhere Else* in Florida?", text: "We take statewide projects on request. Send the details and we'll let you know.", buttons: quoteBtns() },
    ],
  });

  // /service-areas/<city>/
  for (const c of cities) {
    pages.push({
      slug: `service-areas/${c.slug}`,
      title: `Sign Installation & Repair in ${c.name}, FL`,
      description: `Sign installation, sign repair and maintenance in ${c.name}, ${c.county}, FL for sign companies and local businesses. Call ${site.phone}.`,
      sections: [
        {
          type: "hero",
          eyebrow: `${c.name} · ${c.county}`,
          title: ["Sign installation & repair", `*in ${c.name}.*`],
          text: `Channel letters, pylon and pole signs, monuments and lightboxes installed and serviced in ${c.name} and across ${c.county}. Experienced crews and the right equipment for every job.`,
          buttons: quoteBtns(false),
          photos: [],
        },
        { type: "ticker" },
        {
          type: "cards",
          eyebrow: `Services in ${c.name}`,
          title: `Sign Services in *${c.name}*`,
          cards: services.map((s, i) => ({ title: s.name, text: s.short, href: `/${comboSlug(s, c)}/`, dark: i % 3 === 1 })),
        },
        {
          type: "split",
          eyebrow: `Who we help in ${c.name}`,
          items: [
            { label: "Sign Companies", title: `Installation Partner in ${c.name}`, text: `Surveys, permits and installation for your accounts in ${c.name}, done under your brand.`, button: { label: "Partner With Us", href: "/sign-companies/" }, dark: true },
            { label: "Business Owners", title: `Sign Repair in ${c.name}`, text: "Lights out, faded faces or storm damage? We repair, clean, repaint and upgrade your sign.", button: { label: "See Sign Services", href: "/sign-repair/" } },
          ],
        },
        { type: "cta", title: `Have a Sign Project in *${c.name}*?`, text: "Send the address, photos and what you need. We reply the same day.", buttons: quoteBtns() },
      ],
    });
  }

  // /<service>-<city>/
  for (const s of services) {
    for (const c of cities) {
      const others = services.filter((o) => o.slug !== s.slug);
      const nearby = cities.filter((o) => o.slug !== c.slug && o.county === c.county).slice(0, 6);
      pages.push({
        slug: comboSlug(s, c),
        title: `${s.name} in ${c.name}, FL`,
        description: `${s.name} in ${c.name}, ${c.county}, Florida. ${s.short} Free quotes — call ${site.phone}.`,
        sections: [
          {
            type: "hero",
            eyebrow: `${c.name}, FL · ${c.county}`,
            title: [s.name, `*in ${c.name}, FL.*`],
            text: `${s.intro.replace(/\.$/, "")} in ${c.name} and nearby. ${isInstall(s) ? "Experienced crews and the right equipment for every job." : "We reply the same day."}`,
            buttons: quoteBtns(false),
            photos: [],
          },
          { type: "ticker" },
          {
            type: "checklist",
            eyebrow: s.audience,
            title: `${s.name} in *${c.name}*`,
            text: `Need ${s.name.toLowerCase()} in ${c.name}? ${s.short} Send the address and a few photos and we'll get back to you with a quote.`,
            items: s.includes,
          },
          {
            type: "links",
            eyebrow: `More in ${c.name}`,
            title: `Other Services in *${c.name}*`,
            links: others.map((o) => ({ label: o.name, href: `/${comboSlug(o, c)}/` })),
            moreTitle: nearby.length ? `${s.name} *Nearby*` : null,
            moreLinks: nearby.map((n) => ({ label: n.name, href: `/${comboSlug(s, n)}/` })),
          },
          { type: "cta", title: `${s.name} in *${c.name}*?`, text: "Send the address, photos and what you need. We reply the same day.", buttons: quoteBtns() },
        ],
      });
    }
  }

  return pages;
};

// "Channel Letter Installation" -> ["Channel Letter", "*Installation*"]
function titleLines(name) {
  const words = name.split(" ");
  const last = words.pop();
  return [words.join(" ") || last, words.length ? `*${last}*` : ""].filter(Boolean);
}
