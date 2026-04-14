# Instructional Designer Portfolio Demo

This repository contains a static HTML/CSS/JavaScript portfolio site for an instructional designer.

## What’s in this repo

- `portfolio/` — the website source (static pages + assets)
  - `index.html` — home page
  - `portfolio.html` — portfolio overview page
  - `onboarding-course.html` — detailed case study / demo page (includes interactive scenario elements implemented in vanilla JS)
  - `resume.html` — resume page
  - `contact.html` — contact page
  - `css/style.css` — site styling
  - `js/main.js` — site behavior (navigation + interactive elements)
- `img/` — image assets used by the site (referenced by pages in `portfolio/`)

## How to view locally

Because this is a static site, you can open it directly in a browser:

1. Open `portfolio/index.html` in your browser.

Recommended (to avoid any browser restrictions around local files):

- Run a simple local web server from the `portfolio/` directory, then visit the served URL.

## Notes

- Some footer text currently uses a placeholder ("Your Name. All rights reserved.") while the page titles/branding reference “Zacc Elliott”.
- Navigation links reference an `about.html` page, but `about.html` was not present in the directory listing.
