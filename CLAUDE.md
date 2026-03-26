# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for Yesuah's Love Heals, a church ministry in Minneapolis, MN. No build tools, frameworks, or package manager — pure HTML/CSS/JavaScript.

## Running the Site

Open `index.html` directly in a browser, or serve the directory with any static HTTP server:

```bash
# Python
python -m http.server 8080

# Node.js (if available)
npx serve .
```

## Architecture

All code lives in three files at the root:

- **`index.html`** — Full single-page layout with all content and markup. Sections: Hero → Watch → Connect → Events → Give. Contains three modals: donation form, speaking engagement form, and ministry partnership form.
- **`styles.css`** — CSS custom properties for theming, responsive layout via flexbox/grid, modal overlays, animated fade-ins, and mobile hamburger menu.
- **`script.js`** — All client-side behavior:
  - Mobile nav toggle
  - Scroll-based active link highlighting and navbar styling
  - Intersection Observer for section fade-in animations
  - Service countdown timer (next Sunday 10:30 AM CST)
  - Modal open/close (button, ESC key, overlay click)
  - Form submission and validation

## External Dependencies (CDN only)

- Google Fonts — Inter typeface
- Font Awesome 6.0.0 — icons

## Key Patterns

- **Modals** are toggled by adding/removing `active` CSS class; all three share the same open/close logic in `script.js`.
- **Smooth scroll** accounts for the fixed navbar height when jumping to anchors.
- **Intersection Observer** drives all entrance animations — elements gain a `visible` class when they enter the viewport.
- No backend or form processing — form submissions are handled client-side only (currently log to console or show a confirmation message).
