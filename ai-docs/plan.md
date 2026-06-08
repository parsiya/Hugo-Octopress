# CSS refactor plan
Best path: do not start with a broad refactor. Delete dead CSS first. The
current stylesheet has inherited Octopress-era code that the current templates
do not appear to emit.

## Current observations

* `hugo-octopress.css` is loaded directly from `themes/Hugo-Octopress/static/css/hugo-octopress.css` via `themes/Hugo-Octopress/layouts/partials/header.html`.
* The site uses a plain `<body>` tag in `themes/Hugo-Octopress/layouts/partials/header.html`.
* No JavaScript files were found in the theme.
* `config.yaml` has `compactIndex: true`.
* Disqus is disabled in `config.yaml`.
* The sidebar is rendered through `themes/Hugo-Octopress/layouts/partials/sidebar.html`.
* The current CSS includes old reset rules, legacy vendor prefixes, float-based layout, clearfix hacks, commented-out rules, and old Octopress feature blocks.
* Original source is Octopress classic Sass, not this Hugo theme's `master` branch. Relevant source files are under `imathis/octopress/.themes/classic/sass/`.
* Octopress docs say custom overrides belonged in `sass/custom/_styles.scss`; layout variables belonged in `sass/base/_layout.scss` and could be overridden in `sass/custom/_layout.scss`.

## Working rule
Update this plan after each investigation, decision, edit, or validation step so
it stays aligned with the current refactor state. Ignore markdownlint warnings,
they will be autocorrected.

After each activity, also state:

* What the user should check or do now.
* What the next refactor step should be.

Current user action: none before checkpoint.

Current next step: checkpoint this refactor. Further CSS deletion should be a
separate, manual review task.

## Recommended order

1. Remove unused feature blocks.
2. Replace the old reset with a small modern base.
3. Delete legacy vendor prefixes.
4. Convert the float layout to flex or grid.
5. Move CSS into the Hugo asset pipeline.
6. Split source CSS into smaller files while shipping one minified file.
7. Use PurgeCSS carefully, only after the manual cleanup.

## 1. Remove unused feature blocks
Status: complete.

High-confidence dead selectors and blocks:

* `.collapse-sidebar`.
* `.toggle-sidebar`.
* `.no-sidebar`.
* `.sidebar-footer`.
* `.maskImage`.
* `.maskImage` subscribe-email and masked RSS styling.
* Old IE clearfix bits like `*zoom`.
* Commented-out CSS blocks.

Keep separate for now:

* Plain `rel="subscribe-rss"` fallback styling, because `themes/Hugo-Octopress/layouts/partials/navigation.html` still has a text RSS fallback path.

Why this looks safe:

* Templates show plain `<body>`.
* No template search found body classes for `collapse-sidebar`, `maskImage`, `no-sidebar`, or `sidebar-footer`.
* No sidebar toggle markup was found.
* No JS files were found that could dynamically add those classes.
* Exact searches found those names only in `hugo-octopress.css` and this plan, except for the plain `rel="subscribe-rss"` fallback in `navigation.html`.
* Generated `public/**/*.html` did not contain those dead classes or `rel="subscribe-rss"` for the current config.

Mobile note:

* Mobile media queries do not create missing classes. If `.collapse-sidebar`, `.toggle-sidebar`, `.no-sidebar`, `.sidebar-footer`, or `.maskImage` are absent from generated or runtime HTML, their mobile rules cannot apply.

Validation needed:

* Screenshot home page on desktop and mobile.
* Screenshot a single post on desktop and mobile.
* Screenshot archive/category pages on desktop and mobile.

## 2. Replace the old reset
Status: complete.

The first part of the file uses a large old reset and assigns the serif font to almost every element. Replace it with a compact modern base.

Candidate shape:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  line-height: 1.5;
}

body {
  margin: 0;
  color: #222;
  font-family: "PT Serif", Georgia, Times, "Times New Roman", serif;
}

img,
video {
  max-width: 100%;
  height: auto;
}
```

Keep only reset behavior the site actually needs, especially list, table, heading, image, and code defaults.

## 3. Delete legacy vendor prefixes
Status: complete for the agreed duplicate groups. This was done before the reset rewrite because it is lower risk.

Remove old prefixed versions for properties that modern browsers support without prefixes:

* `-webkit-border-radius`.
* `-moz-border-radius`.
* `-ms-border-radius`.
* `-o-border-radius`.
* `-webkit-box-shadow`.
* `-moz-box-shadow`.
* `-webkit-transition`.
* `-moz-transition`.
* `-o-transition`.
* Old prefixed gradients.
* Old prefixed `box-sizing`.

Potential exceptions:

* Keep WebKit scrollbar styling if the visual behavior matters.
* Keep `-webkit-text-size-adjust` for now because it controls mobile browser behavior.
* Keep old prefixed `white-space` fallbacks for now because they are harmless and not part of the obvious duplicate property groups.
* Keep old prefixed `background-clip` for now because it is harmless and tied to existing search input styling.
* Keep any prefix only if current browser testing proves it still matters.

## 4. Convert float layout to grid
Status: complete.

Current layout uses floats, negative margins, clearfixes, and repeated sidebar variants. Since the current site consistently renders `#main`, `#content`, and `aside.sidebar`, use one grid layout.

Original Octopress source explains the current layout:

* `sass/base/_layout.scss` sets `$max-width: 1200px`, `$sidebar-width-medium: 240px`, `$sidebar-width-wide: 300px`, `$sidebar-pad-medium: 15px`, and `$sidebar-pad-wide: 20px`.
* At `min-width: 768px`, `#content` gets `margin-right: $sidebar-width-medium`, article content floats left, and `aside.sidebar` floats left with `margin: 0 -100% 0 0`.
* At `min-width: 992px`, `#content` gets `margin-right: $sidebar-width-wide`, and the sidebar width becomes `$sidebar-width-wide - $sidebar-pad-wide * 2`.
* This confirms the old layout is a Sass-generated float/negative-margin layout, so grid should replace that mechanism directly instead of preserving its float hacks.

Candidate shape:

```css
#main {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
}

#content {
  min-width: 0;
}

aside.sidebar {
  width: auto;
}

@media (max-width: 767px) {
  #main {
    display: block;
  }
}
```

After this, delete most old float, negative margin, clearfix, collapse sidebar, and duplicate sidebar media query code.

## 5. Move CSS into Hugo asset pipeline
Status: complete for code cleanup; visual browser comparison pending.

Current header links static CSS directly:

```html
<link rel="stylesheet" href="/css/hugo-octopress.css">
```

Better long-term path:

* Move source CSS to `themes/Hugo-Octopress/assets/css/`.
* Use Hugo `resources.Get`.
* Use `minify`.
* Use `fingerprint`.
* Link the generated asset from the header partial.

This keeps source readable while shipping smaller CSS.

## 6. Split source CSS, ship one file
Status: complete for code cleanup; visual browser comparison pending.

Suggested source files:

* `base.css`.
* `layout.css`.
* `nav.css`.
* `article.css`.
* `code.css`.
* `sidebar.css`.
* `archive.css`.
* `utilities.css`.

Hugo can concatenate and minify these into one served stylesheet.

## 7. Use PurgeCSS carefully
Status: report-only analysis complete; no CSS deleted.

PurgeCSS can help, but this site has Markdown-generated HTML, shortcodes, Chroma/highlight output, GitHub gists, Font Awesome, and historical inline HTML in posts.

Use report mode first. Safelist at least:

* `.gist` and `.gist-*`.
* `.highlight` and `.highlight*`.
* `.chroma` and `.chroma*`.
* `.fa` and `.fa-*`.
* `.caption-wrapper`.
* `.codewrapper`.
* `.label`.

Do not make PurgeCSS the first cleanup step. Manual deletion of known dead theme features is safer.

## First concrete pass
Start with a low-risk cleanup:

1. Remove dead Octopress feature CSS.
2. Remove old vendor prefixes.
3. Remove comments that only describe old experiments.
4. Build and visually compare key pages.

Then do the grid layout pass separately.

## Activity log

* 2026-06-08: Created initial CSS refactor plan.
* 2026-06-08: Verified Step 1 selectors across theme templates, content, layouts, and generated `public/**/*.html`. Marked sidebar collapse and `maskImage` blocks high-confidence dead. Kept plain `rel="subscribe-rss"` fallback separate because `navigation.html` still contains that alternate path.
* 2026-06-08: Step 1 CSS edit removed `.collapse-sidebar`, `.toggle-sidebar`, `.no-sidebar`, `.sidebar-footer`, `.maskImage`, old `*zoom` hacks, and disabled/commented-out CSS rule blocks. Kept plain RSS fallback behavior and active subscription/nav rules.
* 2026-06-08: Step 1 validation passed. `hugo` build completed successfully with only the existing `IsSet` warning. Follow-up searches found no removed dead selectors left in `hugo-octopress.css`, and `git diff --check` reported no whitespace errors.
* 2026-06-08: Status check showed Step 1 changes are scoped to the theme: `static/css/hugo-octopress.css` modified and `ai-docs/` added. Root repository also has unrelated content edits that were not touched.
* 2026-06-08: User visually checked Step 1 pages and reported they look fine. Decision: do legacy vendor prefix cleanup before reset rewrite to keep risk lower.
* 2026-06-08: Prefix inventory found old transition, border radius, box shadow, box sizing, and gradient duplicates. Kept WebKit scrollbar styling, `-webkit-text-size-adjust`, and old prefixed `white-space` fallbacks out of this pass.
* 2026-06-08: Prefix cleanup edit removed old prefixed `transition`, `border-radius`, `box-shadow`, `box-sizing`, and gradient duplicates while keeping the unprefixed rules. Remaining prefixed rules are intentional conservative leftovers: `white-space` fallbacks, `-webkit-text-size-adjust`, prefixed `background-clip`, and WebKit scrollbar selectors.
* 2026-06-08: Prefix cleanup validation passed. `hugo` build completed successfully with only the existing `IsSet` warning. Targeted search found no removed duplicate prefix groups left. Broader prefix search only found intentional conservative leftovers. `git diff --check` reported no whitespace errors.
* 2026-06-08: Status check after prefix cleanup showed theme changes are limited to `ai-docs/plan.md` and `static/css/hugo-octopress.css`.
* 2026-06-08: Added workflow rule to tell the user what to check or do now and what the next refactor step should be after each activity.
* 2026-06-08: User visually checked prefix cleanup and reported it looks good. Decision: proceed with Step 2 reset cleanup.
* 2026-06-08: Reset review found the old reset still provides useful behavior: zeroing margins and padding, keeping list and table defaults controlled, and setting the base serif font. Reset replacement will preserve those behaviors while removing the huge inherited selector list.
* 2026-06-08: Reset cleanup edit replaced the inherited full-element reset with a compact base reset: universal `box-sizing`, focused margin/padding reset, body serif font, form font inheritance, border reset for fieldset/images, and preserved list/table/quote/HTML5 display rules.
* 2026-06-08: Reset cleanup validation passed. `hugo` build completed successfully with only the existing `IsSet` warning. Sanity checks confirmed the old inherited selector list is gone and compact reset behaviors remain. `git diff --check` reported no whitespace errors.
* 2026-06-08: Status check after reset cleanup showed theme changes remain limited to `ai-docs/plan.md` and `static/css/hugo-octopress.css`. Diff stat for those files: 48 insertions and 150 deletions.
* 2026-06-08: Investigated the Hugo `IsSet` warning with `hugo --panicOnWarning`. Source was `layouts/partials/post_footer.html`, where `isset .Site "disqusshortname"` tried to inspect Hugo's site wrapper pointer.
* 2026-06-08: Replaced the invalid Disqus condition with `or .Site.Config.Services.Disqus.Shortname .Site.Params.disqusShortname`, preserving both modern config and existing theme-param fallback behavior.
* 2026-06-08: `hugo --panicOnWarning` passed after the Disqus condition fix. `git diff --check` reported no whitespace errors. A remaining `isset .Site` string exists only inside a commented-out block in `post_header.html`, so it is not executed.
* 2026-06-08: Status check after the warning fix showed theme changes in `ai-docs/plan.md`, `layouts/partials/post_footer.html`, and `static/css/hugo-octopress.css`.
* 2026-06-08: User verified reset cleanup and the `IsSet` warning fix look good. Decision: proceed to Step 4, converting the float-based layout to grid.
* 2026-06-08: Clarified that "original" means Octopress classic, not this Hugo theme's `master`. Read Octopress styles docs and fetched original Sass snippets. Conclusion: use Octopress Sass as layout documentation, especially `sass/base/_layout.scss`, but continue editing this Hugo CSS directly and preserve local site-specific adjustments.
* 2026-06-08: Grid pass decision: apply grid to `#content` because it directly contains the main article wrapper and `aside.sidebar`. Preserve the old effective sidebar tracks: `240px` at `min-width: 768px` and `320px` at `min-width: 992px`.
* 2026-06-08: Grid layout edit replaced the desktop `#content` margin-right plus floated sidebar with `#content` grid columns. Kept mobile stacked layout, preserved `240px` and `320px` sidebar tracks, moved the main-column background/border to the content grid item, and removed obsolete `#main:after`/`#content:after` clearfix pseudo-elements so they do not become grid items.
* 2026-06-08: Grid layout validation passed. `hugo --panicOnWarning` completed successfully. Residue search found no old negative-margin sidebar placement, no `#content` margin-right layout, and no `#main:after`/`#content:after` grid pseudo-element leftovers. Remaining floats are unrelated alignment/nav/archive/sidebar-section rules. `git diff --check` reported no whitespace errors.
* 2026-06-08: Status check after grid pass showed theme changes are limited to `ai-docs/plan.md` and `static/css/hugo-octopress.css`.
* 2026-06-08: User visually checked grid layout and reported it works. Decision: proceed to Step 5, moving CSS into Hugo's asset pipeline.
* 2026-06-08: Asset pipeline plan: copy current stylesheet source into `assets/css/hugo-octopress.css`, update `header.html` to use `resources.Get`, `minify`, and `fingerprint`, and keep `static/css/hugo-octopress.css` in place for now as a conservative fallback.
* 2026-06-08: Asset pipeline edit copied the current stylesheet into `assets/css/hugo-octopress.css` and changed `layouts/partials/header.html` to load `resources.Get "css/hugo-octopress.css" | minify | fingerprint` with `RelPermalink` and SRI integrity.
* 2026-06-08: Asset pipeline validation passed. `hugo --panicOnWarning` completed successfully. Generated `public/index.html` links to `/css/hugo-octopress.min.<hash>.css` with an integrity attribute, and the generated minified CSS file exists. `git diff --check` reported no whitespace errors.
* 2026-06-08: User visually checked the asset-pipeline change and reported it looks good. Decision: proceed to Step 6, splitting CSS source while shipping one generated stylesheet.
* 2026-06-08: Split `assets/css/hugo-octopress.css` mechanically into ordered files under `assets/css/parts/`: `01-base.css`, `02-layout.css`, `03-navigation.css`, `04-article.css`, `05-code.css`, `06-archive.css`, `07-sidebar-footer.css`, and `08-custom.css`. Updated `header.html` to concatenate those parts with `resources.Concat "css/hugo-octopress.css"`, then minify and fingerprint. Removed the monolithic asset source copy so the split files are the asset source of truth.
* 2026-06-08: Split CSS validation passed. `hugo --panicOnWarning` completed successfully. Generated `public/index.html` still links to the fingerprinted minified CSS with integrity. Concatenating `assets/css/parts/*.css` matches `static/css/hugo-octopress.css` byte-for-byte, confirming the split did not change CSS content. `git diff --check` reported no whitespace errors.
* 2026-06-08: User visually checked the split CSS source and reported it looks good. Decision: remove `static/css/hugo-octopress.css` so `assets/css/parts/` is the only stylesheet source of truth.
* 2026-06-08: Static CSS fallback removal validation passed. Deleted `static/css/hugo-octopress.css`; `hugo --panicOnWarning` completed successfully and static file count dropped by one. No template links directly to `/css/hugo-octopress.css`; `public/index.html` still links to the fingerprinted minified CSS generated from the asset pipeline. `git diff --check` reported no whitespace errors.
* 2026-06-08: Started Step 7 with report-only PurgeCSS analysis against generated `public/**/*.html` and conservative safelist entries for gists, highlights, Font Awesome, captions, code wrappers, labels, and heading anchors. The first runs found two split-boundary issues where individual CSS part files were not valid standalone CSS even though concatenation worked: `01-base.css`/`02-layout.css` split the `.force-wrap, article a, aside.sidebar a` group, and `06-archive.css`/`07-sidebar-footer.css` split the `.side-shadow-border, aside.sidebar section h1, aside.sidebar li` group. Fixed both boundaries.
* 2026-06-08: PurgeCSS report-only run completed after boundary fixes. No CSS was deleted. Rejected selectors were mostly risky or optional legacy/dynamic areas: `h6`, `tt`, `dfn`, `abbr`, `acronym`, pullquotes, `.force-wrap`, `.flex-content`, `.flash-video`, subscription email/no-placeholder nav fallbacks, classic `.blog-index`, `#fb-root`, `.code-title`, `.download-source`, `.side-shadow-border`, `.post-date a.label`, `.sidebar-sticky`, and many GitHub gist syntax selectors. Conclusion: do not auto-delete from this report; use it only as a manual review list after checkpoint.
