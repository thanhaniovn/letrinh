# CMC Telecom Icon Manager

CMC Telecom Icon Manager is a single-page web application that helps design and product teams curate, audit, and distribute SVG icon libraries. The interface is designed around three pillars:

1. **Icon library operations** – upload, filter, search, and download SVG assets.
2. **Icon editing & export** – preview icons, adjust presentation styles, and export tailored assets.
3. **Lightweight admin** – coordinate access, organize icon packs by project/brand, and define stylistic presets.

The application ships as static HTML/CSS/JavaScript files so it can be hosted on any static hosting service (e.g., GitHub Pages, Netlify, S3). State is stored in the browser via `localStorage`, enabling persistent icon libraries without requiring a backend.

## Table of contents

- [Features](#features)
- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [Data model](#data-model)
- [Core workflows](#core-workflows)
- [Customization](#customization)
- [Limitations & roadmap](#limitations--roadmap)

## Features

### Icon library management

- Drag & drop or select SVG files to upload; icons are linted and normalized for `viewBox`, `stroke`, and fill defaults.
- Filter icons by **category** (AI, Business, Arrow, …) and **style** (Outline, Bold, Linear, Twotone, Bulk, Broken, Custom).
- Search instantly by icon name, tags, or keywords.
- Bulk select icons to download as SVG or bundle into an icon pack (`.zip`).
- Organize icons into packs scoped by project or brand, each pack tracking semantic versioning metadata.

### Icon editing & export

- Live preview panel with configurable size (16–256 px), stroke (1, 1.5, 2), and primary color controls.
- Apply reusable **style presets** to keep stroke, color, and corner radii consistent across teams.
- Copy optimized SVG markup to the clipboard or export any icon as PNG directly from the browser (leveraging `canvas`).
- Auto-suggest similar icons that share categories, styles, or tags.

### Lightweight administration

- Role-based access hints (Admin, Designer, Dev) to track responsibilities.
- Manage tags and categories through inline editors.
- Project/brand library overview with quick stats on icon coverage.
- Configurable lint rules for uploaded SVGs to normalize stroke width, replace `fill="none"` declarations, and enforce square viewports.

## Quick start

1. Serve the project directory with any static file server (for example `python -m http.server 8080`).
2. Open `http://localhost:8080` in your browser.
3. Upload SVG icons or explore the seeded demo library.

All state changes (uploads, metadata edits, packs, presets) are stored in `localStorage`. Use the **Reset demo data** action inside the *Admin* section to clear the cache and restore defaults.

## Project structure

```
├── index.html      # Application shell and layout
├── styles.css      # Light-theme styling, grids, cards, and panels
├── app.js          # Stateful UI logic and feature implementation
└── README.md       # This documentation
```

## Data model

The UI operates on a small client-side store persisted to `localStorage` under the key `cmc-icon-manager`.

```ts
interface Icon {
  id: string;          // slug; also used as DOM identifier
  name: string;        // human readable name
  category: string;    // taxonomy bucket (AI, Business, Arrow…)
  style: IconStyle;    // Outline | Bold | Linear | Twotone | Bulk | Broken | Custom
  tags: string[];      // search keywords
  svg: string;         // sanitized SVG markup
  updatedAt: number;   // milliseconds since epoch
}

interface IconPack {
  id: string;
  name: string;
  version: string;     // SemVer notation
  project: string;     // Linked project or brand
  iconIds: string[];   // Members of the pack
  createdAt: number;
}

interface StylePreset {
  id: string;
  name: string;
  size: number;
  stroke: number;
  color: string;
  corner: number;      // For future rounded corner tooling
}
```

The application keeps derived collections – categories, styles, tags – in memory for rendering filters. Any user edits are immediately synchronized with the persisted store.

## Core workflows

### Uploading icons

1. Drag SVG files onto the upload drop zone or click to open the file picker.
2. Each file is read, sanitized (trimmed, `viewBox` enforced, `stroke-width` normalized), and appended to the library.
3. The icon grid refreshes, keeping the current filters active.

### Editing and exporting icons

1. Click an icon card to focus it in the preview panel.
2. Adjust size, stroke, and color controls; optionally save the configuration as a style preset.
3. Use **Copy SVG** or **Export PNG**. Exporting uses a hidden `<canvas>` to rasterize the icon with the applied settings.

### Managing packs and permissions

- The *Admin* drawer includes quick toggles to mark team members as Admin, Designer, or Dev.
- Press **Create pack from selection** to bundle the currently selected icons into a downloadable `.zip` file. Provide a pack name, semantic version, and project/brand association.
- Manage tags and categories via editable lists; changes instantly affect filter options.

## Customization

- **Branding** – Update gradients, accent color variables, and logos inside `styles.css`.
- **Default library** – Modify the `seedIcons` array inside `app.js` to replace the starter icons with your organization’s assets.
- **SVG linting** – Extend `normalizeSvgMarkup` in `app.js` to enforce custom rules (e.g., remove `<title>` tags, rewrite color palettes).
- **Persistence** – To integrate with a backend, replace the `localStorage` read/write helpers with REST/GraphQL calls.

## Limitations & roadmap

- The app runs entirely in-browser; there is no multi-user sync or server-based storage.
- PNG export leverages the browser’s canvas implementation and may not perfectly match Figma/Illustrator rendering for complex gradients or filters.
- Role and project management is informational only – there is no authentication/authorization layer.
- Future enhancements: collaborative editing, diff tooling for icon updates, accessibility metadata (ARIA titles/desc), AI-driven icon recommendations.

