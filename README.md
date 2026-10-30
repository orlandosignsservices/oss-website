# OSS Website Factory

The website for **orlandosignsservices.com**, built as a small "factory": edit a JSON file, push to `main`, and GitHub Actions rebuilds and publishes the whole site to GitHub Pages.

No frameworks, no dependencies — just Node.js (`node build.js`).

## What it builds

| Source | Pages |
|---|---|
| `content/pages/*.json` | Hand-written pages: Home, For Sign Companies, Sign Repair, Contact |
| `content/services.json` | `/services/` and one page per service (`/services/channel-letter-installation/`) |
| `content/service-areas.json` | `/service-areas/` and one page per city (`/service-areas/kissimmee/`) |
| services × cities | One page per service in every city (`/channel-letter-installation-kissimmee/`) |

Plus `sitemap.xml`, `robots.txt`, `404.html` and LocalBusiness schema on every page.

## Everyday changes

- **Add a city:** add `{ "name": "...", "slug": "...", "county": "..." }` to `content/service-areas.json`. Its city page and one page per service are created automatically.
- **Add a service:** add an entry to `content/services.json` (`slug`, `name`, `short`, `intro`, `includes`, `audience`). Its service page and one page per city are created automatically.
- **Change text on a main page:** edit the matching file in `content/pages/`. Wrap words in `*asterisks*` to make them orange.
- **Add photos:** put them in `assets/img/` using the file names shown in the striped placeholders (e.g. `work-1.jpg`, `gallery-1.jpg`). Use JPGs around 1600px wide.
- **Quote form:** paste the Lead Connector form embed code into `formEmbed` in `content/pages/contact.json`.

## Section types

`hero`, `ticker`, `cards`, `split`, `process`, `gallery`, `checklist`, `links`, `cta`, `contact` — see `src/sections.js`.

## Preview locally

```
node build.js
python -m http.server 8000 -d dist
```

Then open http://localhost:8000.

## Publishing

1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions** (one time).
2. Every push to `main` publishes to `https://orlandosignsservices.github.io/oss-website/` while the domain stays on Wix.
3. **Going live on orlandosignsservices.com** (only when approved): set the Actions variable `CUSTOM_DOMAIN=true`, add the domain under Settings → Pages → Custom domain, then point the domain's DNS from Wix to GitHub Pages.

While `CUSTOM_DOMAIN` is not set, the build uses `BASE_PATH=/oss-website` so every link works on the github.io preview address.

## Public content rules

- No prices, credit terms, license numbers, COI, or insurance claims ("Licensed and insured" is not used).
- Equipment is only mentioned as: "Experienced crews and the right equipment for every job."
- Company-facing services say **Installation**; repair and maintenance services do not.
- No end-client names from jobs done for sign companies. Lead photos are direct jobs only.
- Fonts: Arial / Helvetica.
