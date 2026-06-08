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

## Working rule
Update this plan after each investigation, decision, edit, or validation step so
it stays aligned with the current refactor state. Ignore markdownlint warnings,
they will be autocorrected.

## Recommended order

1. Remove unused feature blocks.
2. Replace the old reset with a small modern base.
3. Delete legacy vendor prefixes.
4. Convert the float layout to flex or grid.
5. Move CSS into the Hugo asset pipeline.
6. Split source CSS into smaller files while shipping one minified file.
7. Use PurgeCSS carefully, only after the manual cleanup.

## 1. Remove unused feature blocks
Status: complete for code cleanup; visual browser comparison still recommended before larger refactors.

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
* Keep any prefix only if current browser testing proves it still matters.

## 4. Convert float layout to grid
Current layout uses floats, negative margins, clearfixes, and repeated sidebar variants. Since the current site consistently renders `#main`, `#content`, and `aside.sidebar`, use one grid layout.

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
