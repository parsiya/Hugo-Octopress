# CSS refactor plan
This document records the final state of the Hugo-Octopress CSS refactor and the current checkpoint scope.

## Current state

* CSS source of truth is `assets/css/parts/*.css`.
* `layouts/partials/header.html` concatenates, minifies, fingerprints, and serves those parts through Hugo Pipes.
* Desktop layout now uses grid instead of the old float and negative-margin sidebar placement.
* The old static stylesheet `static/css/hugo-octopress.css` has been removed.
* The Hugo `IsSet` warning in `layouts/partials/post_footer.html` is fixed.
* PurgeCSS work stayed report-only. Remaining candidates are documented in `ai-docs/purgecss-report.md` and intentionally kept.

## Completed work

* Removed dead Octopress-era feature CSS, including unused sidebar toggle, mask, old IE clearfix, and commented-out rule blocks.
* Replaced the inherited reset with a smaller base reset while preserving the site's required defaults.
* Removed redundant legacy prefixes while keeping conservative exceptions such as `-webkit-text-size-adjust`.
* Replaced the old desktop float sidebar layout with grid.
* Moved CSS delivery into Hugo Pipes with minify, fingerprint, and integrity attributes.
* Split source CSS into ordered files under `assets/css/parts/` while still shipping one generated stylesheet.
* Ran report-only PurgeCSS analysis and kept the remaining candidates because expected savings are small.
* Second cleanup pass:
  * Added `:root` custom properties for font stacks, code colors, link hover color, and responsive gutters.
  * Replaced four repeated padding and margin media blocks with `--gutter` and `--pagination-gutter`.
  * Removed rules that were never applied: hyde-x `.sidebar` and `.sidebar-sticky`, `aside.sidebar a` color and hover, `body>header h2` in the sans list, the 550px header font size, and `h3.filename+pre` radius.
  * Merged duplicate rules: `em`, `strong`, `#blog-archives h1`, `#blog-archives` hover rules, `.gist .gist-meta`, `.label`, and `body>nav ul li`.
  * Removed invalid or obsolete declarations: `white-space: no-wrap`, `box-shadow: 0px`, `-webkit-` and `-moz-background-clip: padding`, `-moz-`, `-o-`, and `-pre-wrap`, `top left` without background images, and duplicate `box-sizing`.
  * Rewrote the broken `div.entry-content > h1, h2, ...` selector. Only `h1` was scoped, so `h2`-`h6` got `0.8em`/`0.5em` margins globally. The base heading rule now states this directly.

## Validation summary

* `hugo --panicOnWarning` passed after the warning fix and after later CSS pipeline changes.
* Visual checks passed after dead CSS cleanup, prefix cleanup, reset cleanup, grid layout, asset pipeline conversion, and CSS splitting.
* Generated `public/**/*.html` checks confirmed `.gist` is used in the current view and `.blog-index` is used when classic index is enabled.
* Split source totals about `29,921` bytes versus the old `40,459` byte static source, about `26.0%` smaller.
* Gzipped shipped CSS dropped from about `8,107` bytes to `4,891` bytes, about `39.7%` smaller over the wire.
* Estimated savings from deleting the remaining PurgeCSS table are only about `1,118` bytes of source CSS, with likely gzip savings of only a few hundred bytes.
* Second cleanup pass: minified CSS dropped from `20,883` to `19,055` bytes, and gzip size dropped from `4,886` to `4,747` bytes. A Playwright computed-style diff against the previous build showed zero differences on 8 pages at widths 400, 600, 760, 800, and 1100. It also matched live parsiya.net except for load-timing noise. Classic index (`compactIndex: false`) was checked the same way on `/`, `/page/2/`, `/page/10/`, `/archive/`, and one post: zero differences. Removals were limited to rules overridden or redundant in the cascade, not rules unused by this site's HTML.

## Known quirks kept on purpose

* `imgcap` images (`img.caption`) still get the frame shadow because the original `box-shadow: 0px` was invalid. Use `box-shadow: none` if the shadow should be removed.
* `aside.sidebar.thirds section` overrides the 48% two-column sidebar width with 30% between 750px and 767px.
* `body` uses `line-height: 1.5em`, which inherits as a fixed length. A unitless `1.5` would be cleaner but would change rendering.

## Condensed activity log

* 2026-06-08: Created the working plan and used it as the running log for the refactor.
* 2026-06-08: Removed dead feature CSS, redundant prefixes, and the old inherited reset.
* 2026-06-08: Fixed Hugo's `IsSet` warning in `layouts/partials/post_footer.html`.
* 2026-06-08: Replaced the old float-based desktop layout with grid.
* 2026-06-08: Moved stylesheet delivery into Hugo Pipes, split CSS into `assets/css/parts/*.css`, and removed the old static fallback.
* 2026-06-08: Ran report-only PurgeCSS analysis, checked both compact and classic index output, and kept the remaining candidates.
* 2026-10-25: Second cleanup pass with custom properties, dead-rule removal, and dedupe; verified with computed-style diffs in compact and classic index.
