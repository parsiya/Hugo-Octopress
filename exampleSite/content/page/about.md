---
title: "Single Page"
date: "2021-02-14"
url: "/about/"
---

This is a single page. To create a page similar to this:

1. Create a new markdown file in `contents/page/about.md`.
    1. Alternatively, create a [page bundle][page-bundle-link] `contents/page/about/index.md`.
2. In the frontmatter of the page, set the value of `url` to your desired relative path.
    1. E.g., for this page we have `url = "/about/"`.
3. Now you can access the website at `baseurl/about` and you can link to it from the main menu or sidebar using the relative path.

[page-bundle-link]: https://gohugo.io/content-management/page-bundles/

Linkify URL: https://example.net. It opens in a new tab only if using
Blackfriday and not Goldmark (at the time of writing).

markdown URL: [example.net](https://example.net). It should open in a new tab
with both Blackfriday and Goldmark.
