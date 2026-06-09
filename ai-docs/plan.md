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

## Validation summary

* `hugo --panicOnWarning` passed after the warning fix and after later CSS pipeline changes.
* Visual checks passed after dead CSS cleanup, prefix cleanup, reset cleanup, grid layout, asset pipeline conversion, and CSS splitting.
* Generated `public/**/*.html` checks confirmed `.gist` is used in the current view and `.blog-index` is used when classic index is enabled.
* Split source totals about `29,921` bytes versus the old `40,459` byte static source, about `26.0%` smaller.
* Gzipped shipped CSS dropped from about `8,107` bytes to `4,891` bytes, about `39.7%` smaller over the wire.
* Estimated savings from deleting the remaining PurgeCSS table are only about `1,118` bytes of source CSS, with likely gzip savings of only a few hundred bytes.

## Current next step

* Review `ai-docs/commit-summary.md`, `ai-docs/plan.md`, and `ai-docs/purgecss-report.md`.
* Commit the current documentation checkpoint in the theme repo.

## Condensed activity log

* 2026-06-08: Created the working plan and used it as the running log for the refactor.
* 2026-06-08: Removed dead feature CSS, redundant prefixes, and the old inherited reset.
* 2026-06-08: Fixed Hugo's `IsSet` warning in `layouts/partials/post_footer.html`.
* 2026-06-08: Replaced the old float-based desktop layout with grid.
* 2026-06-08: Moved stylesheet delivery into Hugo Pipes, split CSS into `assets/css/parts/*.css`, and removed the old static fallback.
* 2026-06-08: Ran report-only PurgeCSS analysis, checked both compact and classic index output, and kept the remaining candidates.
