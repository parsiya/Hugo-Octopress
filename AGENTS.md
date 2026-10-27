# Hugo-Octopress Agent Guide
This is the theme repository; parent-site overrides are separate. Run commands
from this directory. Require Hugo `0.168.0` and Node.js `20.12.0` or newer.

## Commands

```sh
npm ci --prefix tests
npm test --prefix tests
git diff --check
```

Preview: `hugo server --source exampleSite`.

## Code Map

* Edit CSS sources in `assets/css/parts/`, not generated CSS.
* Templates live in `layouts/`; shortcode rendering uses `partials/direction.html`.
* Labels use `i18n/` plus English fallback in `data/hugoOctopress.yaml`.
* Shared fixtures live in `exampleSite/`; runners in `tests/`; output in ignored
  `tests/.work/`. Tests must work without another checkout or parent-site files.

## Change Rules

* Preserve English fonts/layout. Use configured direction and logical CSS, not
  language allowlists. Preserve physical `.left`/`.right` author utilities.
* Use generated permalinks, modern language/pagination settings, and `hugo.Data`.
* Do not reverse text or enable unsafe HTML. Keep `.Inner` in shortcode entries.
* Bundled Vazirmatn loads automatically; preserve its OFL notice,
  pinned binaries, and Arabic-only Unicode ranges. Never replace Latin fonts.
* Keep the deferred summary fix separate from RTL changes.
* Before finishing, rerun tests and whitespace checks above. For CSS changes,
  verify desktop/mobile rendering in both directions; report untested cases.
* Ignore Markdown lint warnings and avoid unrelated formatting.

See [README.md](README.md) for authoring and [ai-docs/testing.md](ai-docs/testing.md)
for coverage, browser checks, and deferred issues.