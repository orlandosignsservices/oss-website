# Orlando Signs Services website

Copy of the live Wix site (same text, photos, design and page addresses) plus local Sign Repair pages by area.

- `content-wix.js`: all Wix page text. Sign Companies and installation pages stay exactly as on Wix.
- `content-repair-local.js`: 8 repair types and 12 local areas (local business owners only).
- `photos.js`: which Wix photo goes on each page.
- `img/`: the Wix photos.
- `build.js`: builds the site into `dist/`.

Every push to `main` is published by GitHub Actions to https://orlandosignsservices.github.io/oss-website/ while the domain stays on Wix.

Rules: installers only (never say we design or fabricate), no "licensed / insured / OSHA" claims, Sign Companies and Sign Repair stay separate.

The previous version (Oct 29) is kept in the `version-29-oct` branch.

Preview locally: `node build.js preview` then open `dist-preview/index.html`.
