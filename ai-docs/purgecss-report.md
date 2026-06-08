# PurgeCSS report
This is a report-only review of selectors PurgeCSS did not find in generated `public/**/*.html`. No CSS was deleted from this report.

Command shape:

```bash
npx --yes purgecss \
  --css 'themes/Hugo-Octopress/assets/css/parts/*.css' \
  --content 'public/**/*.html' \
  --safelist gist gist-meta gist-data gist-highlighttable highlight highlighttable chroma fa fa-rss-square fa-lg fa-3x caption-wrapper codewrapper label header-link fill-current o-60 hover-accent-color-light basic-alignment left right center \
  --rejected
```

## Summary
Treat this as a manual review list, not a deletion list. Many candidates are legacy or dynamic features that may only appear in old posts, shortcode output, embedded gists, alternate config paths, or future posts.

Estimated savings are small. The remaining documented candidates below add up to roughly `1.1 KB` of source CSS before minification and gzip. The likely shipped gzip savings would probably be only a few hundred bytes. Even deleting broader risky groups would only remove a few KB of source CSS, and several groups preserve legacy behavior.

Recommendation: keep these rules for now unless a future cleanup has a specific reason to remove one group.

## Generated HTML usage check
Checked generated `public/**/*.html` for candidate selectors and elements. This excludes generated CSS files so matches below mean the selector or element appears in rendered HTML, not just in the stylesheet.

Anything used in either compact-index or classic-index generated HTML has been removed from the candidate table below and moved to the kept list.

The detailed GitHub gist syntax classes such as `blob-num`, `blob-code-inner`, `pl-c1`, and `pl-k` do not appear in generated HTML because GitHub gist scripts can load markup at runtime.

Temporary classic-index check: with `compactIndex` disabled, `.blog-index` appears in 17 generated pages. It is not an unused selector group as long as classic index remains supported.

Kept because generated HTML uses them in at least one supported view:

| Selector group | View where it appears | Generated HTML hits | Status                                      |
| -------------- | --------------------- | ------------------: | ------------------------------------------- |
| `.gist`        | Compact/current view  | 7                   | Keep gist wrapper styling.                  |
| `.blog-index`  | Classic-index view    | 17                  | Keep while classic index remains supported. |

Documented below for future review only. Keep all of these selectors for now.

Estimated savings for the table below are about `1.1 KB` of source CSS. Most of that comes from full-rule removals for pullquotes, `.no-placeholder`, `.flash-video` iframe helpers, and `#fb-root`. The rest is selector-only cleanup inside mixed rules, such as removing only `tt` from the mono font group or `.force-wrap` from the wrapping group. After minification and gzip, expected transfer savings are probably only a few hundred bytes.

| Candidate             | Public HTML hits | Status                              |
| --------------------- | ---------------: | ----------------------------------- |
| `tt`                  | 0                | Not used in current generated HTML. |
| `dfn`                 | 0                | Not used in current generated HTML. |
| `abbr`                | 0                | Not used in current generated HTML. |
| `acronym`             | 0                | Not used in current generated HTML. |
| `.pullquote-right`    | 0                | Not used in current generated HTML. |
| `.pullquote-left`     | 0                | Not used in current generated HTML. |
| `.force-wrap`         | 0                | Not used in current generated HTML. |
| `.flex-content`       | 0                | Not used in current generated HTML. |
| `.flash-video`        | 0                | Not used in current generated HTML. |
| `.no-placeholder`     | 0                | Not used in current generated HTML. |
| `#fb-root`            | 0                | Not used in current generated HTML. |
| `.download-source`    | 0                | Not used in current generated HTML. |
| `.side-shadow-border` | 0                | Not used in current generated HTML. |
| `.post-date a.label`  | 0                | Not used in current generated HTML. |

Approximate source-byte breakdown:

* Full-rule removals: `897` bytes.
* Selector-only cleanup in mixed rules: `221` bytes.
* Total: `1,118` bytes out of `29,928` bytes of split CSS source, or about `3.7%` of source CSS.

Decision: keep all remaining candidates for now. The savings are too small to justify another manual deletion pass without a more specific cleanup goal.
