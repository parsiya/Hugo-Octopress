# Theme Tests and Rendering Checks
Run commands from the theme repository root. Tests do not require the parent
blog, the Persian site, a PaperMod checkout, or any files outside this repository.

## Setup
Install Hugo `0.168.0` or newer and Node.js `20.12.0` or newer. The lockfile pins
development-only dependencies; theme users do not need Node.js to build a site.

```sh
npm ci --prefix tests
npm test --prefix tests
```

The runner resolves paths relative to itself, not the shell's working directory.
It requires the `hugo` executable on `PATH`. Generated sites are recreated inside
ignored `tests/.work/`; installed packages stay in ignored `tests/node_modules/`.
Do not run concurrent copies of this suite against the same working tree.

## Shared Examples
[Bidirectional Text](../exampleSite/content/post/bidirectional-text/index.md)
is a readable public demo and the content fixture for multilingual tests. The
runner copies it unchanged into generated language-specific sites, then adds
small routing fixtures for paired/unpaired posts, about, and license pages.
Those generated pages are test setup, not additional public demo posts.

Keep useful authoring examples in `exampleSite/content/`; keep runner code,
dependencies, generated configuration, and assertion logic under `tests/`.
Do not put intentionally invalid shortcodes in published example content. The
runner generates the invalid-direction case only in its disposable test site.

Preview examples:

```sh
hugo server --source exampleSite
```

To inspect a generated Persian fixture after running tests:

```sh
hugo server --source tests/.work/routing-blog-false --port 1317 --baseURL http://localhost:1317/blog/ --renderToMemory --disableFastRender
```

Open `/blog/fa/post/mixed/`. For the locale matrix, use source
`tests/.work/all-locales` and visit `/blog/ar/post/mixed/`, for example.

## Automated Coverage
The eighteen tests cover:

- Root and `/blog/` deployments with default-language subdirectories on/off.
- Resolved menu page references, custom URLs, already-prefixed URLs, external
  destinations, email links, fragments, and generated shared-asset URLs.
- Exact deployment-root menu URLs with/without a trailing slash in desktop,
  mobile, and sidebar menus.
- Configured document language/direction, translation links, unpaired pages,
  RSS destinations, taxonomy links, page/404 output, and license fallback.
- Nonempty localized labels, English fallback in an Arabic-only site, localized
  dates with numeric-month fallback, and custom continue-reading labels.
- Default-language fallback when Persian is the default and Arabic has no labels.
- Desktop/mobile translation links and fallback license links across two hosts.
- Classic pagination and compact-index output.
- Default-right and explicit left/right sidebar configuration in both directions,
  case-insensitive values, content-before-sidebar document order, named grid areas,
  and compact indexes.
- Inline/block Markdown, nested direction shortcodes, and invalid directions.
- Captioned code inside direction wrappers under safe Markdown settings, and
  raw-HTML checks that nested blocks are not wrapped in paragraphs.
- Heading/table inline-code content, fenced highlighted code, line-number tables,
  code captions, and removal of internal shortcode placeholder tokens.
- Parsed generated CSS requires LTR direction and Unicode isolation for all code.
- Automatically loaded bundled Vazirmatn at root/prefixed URLs, independent of PT-font settings,
  with exact SHA-256 checks for both WOFF2 files and the upstream OFL notice.
- A strict build of the bundled example site.

The locale inventory is checked into the runner: the 46 PaperMod dictionary codes
inspected at revision `1181196`, plus Urdu. It is reference data, not copied
translations or an RTL allowlist used by the theme. Fixtures explicitly configure
`ar`, `ckb`, `fa`, `he`, `pnb`, and `ur` as RTL; `ku` and `pa` remain LTR.

Hugo warnings fail the build. HTML assertions use `linkedom@0.18.12`; they do not
calculate CSS, check font shaping, make asset requests, or access the clipboard.
All 47 locale codes passing does not mean 47 translated or visually reviewed UIs.

## Browser Checks
For CSS or direction changes, inspect both English and RTL examples at desktop,
tablet, and narrow mobile widths. Record actual CSS viewport widths, not only
requested browser dimensions.

- Check sidebar placement, navigation wrapping, compact dates/titles, lists,
  tables, captions, and document horizontal overflow.
- Check `C++ (v1.2)`, Latin-first Persian sentences, nested phrases, full URLs,
  query strings, and parentheses belonging to either language.
- Check single-backtick code in paragraphs, lists, headings, and table cells
  separately from triple-backtick fenced blocks and line-numbered code tables.
- Confirm code stays LTR and line numbers stay before source columns, while
  surrounding Persian captions remain RTL.
- Compare English font metrics and layout with the unmodified theme. Loading an
  Arabic-script font must not replace Latin fonts; use `unicode-range` when needed.
- Select and copy commands, URLs, and mixed-script text into a plain-text editor.
  Compare pasted characters with source, not merely their visible positions.
- Check Chromium, Firefox, and WebKit where available; report unavailable engines
  rather than implying cross-browser coverage.

Current automated tests do not certify clipboard round-trips or arbitrary
unmarked mixed prose. Browser selection text was checked during development;
OS clipboard behavior and Firefox/WebKit remain unverified.

## Inline-Code Isolation
All `code` elements use `direction: ltr` and `unicode-bidi: isolate`. Visual
styling remains scoped to its existing selectors; headings and table cells do
not acquire paragraph/list code backgrounds, borders, or padding.

The shared example includes `C++` in a heading/table and `--help` in a table.
Integrated-browser checks in English and Persian at actual CSS widths of 1152,
768, and 312 pixels reproduced misplaced punctuation under the old rules and
verified left-to-right character order with the fix. Fonts, spacing, layout,
and line-number placement stayed unchanged, with no page horizontal overflow.
These browser checks are manual; the shipped suite checks content and the
generated CSS rule, not rendered character positions.

## Deferred Summary Fix
This is a separate theme HTML bug, not an RTL bug. It affects English too. Do not
fold its template change into the multilingual/RTL commit.

`layouts/partials/classic_index.html` currently emits
`<p>{{ .Summary }}</p>`. Hugo summaries can already contain paragraphs, headings,
lists, and other block elements. Nesting those inside `<p>` is invalid; browsers
repair the markup. Automatic and `<!--more-->` summaries are both relevant.

Recommended separate change: replace the outer paragraph with a dedicated
`<div class="summary">{{ .Summary }}</div>`. Preserve summary HTML, links, and
direction wrappers. Do not solve nesting by using `plainify`: that would remove
formatting and directional isolation, which is a different product decision.

Acceptance checks for that future commit:

- Generate automatic, front-matter, and manual-divider summaries containing
  paragraphs, headings, lists, links, and inline direction shortcodes.
- Check raw generated HTML as well as parsed DOM, since parsers repair bad nesting.
- Verify summaries, read-on links, and `truncate=false` in English and RTL sites.
- Compare classic-index spacing before/after; compact index must remain unchanged.
- Decide preview heading sizes separately. A valid wrapper does not make headings
  smaller, and a front-matter summary is an authoring option, not the template fix.

No summary-template behavior is changed by the test/documentation work.