# Hugo-Octopress
Hugo-Octopress is a port of the classic [Octopress][octopress-link] theme to [Hugo][hugo-link].

For a demo website using the vanilla theme please visit [http://parsiya.io.s3-website-us-east-1.amazonaws.com/](http://parsiya.io.s3-website-us-east-1.amazonaws.com/).

My personal website runs a modified version of the theme (mainly modified index): [https://parsiya.net](https://parsiya.net).

## Contents
- [Config file parameters](#config)
- [Code highlight](#highlight)
- [Navigation menu](#menu)
- [Markdown options](#markdown)
- [CSS override](#cssoverride)
- [Sidebar](#sidebarlinks)
  - [Sidebar text](#sidebartext)
  - [Social network icons](#sidebarsocial)
  - [Sidebar menu](#sidebarmenu)
  - [Recent posts](#sidebarrecent)
- [Shortcodes](#shortcodes)
  - [Code caption](#codecaption)
  - [Image caption](#imgcap)
    - [Atom snippets for shortcodes](#snippets)
- [Hugo page summary bug](#summary)
- [License page](#licensepage)
- [Table of contents](#tableofcontents)
- [Not Found or 404.html](#notfound)
- [Taxonomy pages](#taxonomy)
- [Individual pages](#page)
- [Disqus](#disqus)
- [Issues/TODO](#issues)
- [Attribution](#attribution)
- [Ported by](#portedby)
- [Theme license](#themelicense)

![screenshot](https://raw.githubusercontent.com/parsiya/Hugo-Octopress/master/images/screenshot.png)

## <a name="config"></a>Configuration
Hugo-Octopress can be configured by modifying the parameters in the [configuration file](https://gohugo.io/overview/configuration/). A working config file `sample-config.toml` is provided. Some miscellaneous parameters are explained below:

``` toml
baseurl = "http://example.com"
disablePathToLower = false
languageCode = "en-us"
title = "Site title"
theme = "hugo-octopress"

# Disqus shortcode
# Disable comments for any individual post by adding "comments: false" in its frontmatter
disqusShortname = "Your disqus shortname"


# Number of blog posts in each pagination page
paginate = 6

[permalinks]
# Configures post URLs
post = "/blog/:year-:month-:day-:title/"

# Make tags and categories work
# As of Hugo v0.33 these are not needed anymore
# [indexes]
#   tag = "tags"
#   category = "categories"

[params]

  # If false, all of blog post will appear on front page (and in pagination)
  truncate = true

  # Author's name (appears in meta tags and under posts)
  author = "Author's name"

  # This text appears in site header under website title
  subtitle = "Subtitle appears under website title"

  # Search engine URL
  searchEngineURL = "https://www.google.com/search"

  # Text of the "Continue Reading" label. &rarr; == right arrow, but it gets messed up in the string so it was added to index.html manually
  continueReadingText = "Would you like to know more?"

  # Google analytics code - remove if you do not have/want Google Analytics - needs JavaScript
  googleAnalytics = "UA-XXXXX-X"

  # Optional piwik tracking
  #[params.analytics.piwik]
  #  URL = "https://stats.example.com"
  #  ID = "42"

  # Switch to true to enable RSS icon link
  rss = true

  # Set to true to use a text label for RSS instead of an icon
  # This is overwritten by the "rss" setting
  textrss = false

  # Website's default description
  defaultDescription = ""

  # Populate this with your own search keywords - these will appear in meta tags
  # defaultKeywords = ["keyword1" , "keyword2" , "keyword3" , "keyword4"]

  # Set to true to hide ReadingTime on posts
  disableReadingTime = false

  # Set to true to disable downloading of remote Google fonts
  disableGoogleFonts = false
```

## <a name="highlight"></a>Code highlight
Octopress classic theme uses the pygments' `solarized dark` for highlighting. It is not installed by default. You can get it from https://github.com/john2x/solarized-pygment. It has three options:

* solarized_light: default option after installation
* solarized_dark: use this to re-create the Octopress classic theme highlighting
* solarized_dark256

As on Hugo 0.28 the built-in Chroma highlighter is used by default. It does not support solarized dark yet. To keep using the highlighting by CSS add `pygmentsUseClassic=true` to the config file.

The following options control code highlighting:

``` toml
[params]
  # If nothing is set, then solarized_light is used
  pygmentsstyle = "solarized_dark"

  # Use internal highlighter instead of Chroma
  pygmentsUseClassic=true

  # Highlight shortcode and code fences (```) will be treated similarly
  pygmentscodefences = true

  # pygments options can be added here (and in the highlight shortcode in the markdown file)
  # Hugo supports these pygments options: style, encoding, noclasses, hl_lines, linenos
  # for example: pygmentsoptions = "linenos=true"
```

For more information see [Syntax Highlighting](https://gohugo.io/extras/highlighting/) in Hugo's documentation.

## <a name="markdown"></a>Markdown options

Blackfriday is Hugo's markdown engine. For a list of options see [Configure Blackfriday rendering](https://gohugo.io/overview/configuration/#configure-blackfriday-rendering). Blackfriday options can be set as follows:

``` toml
[blackfriday]
  hrefTargetBlank = true # open the external links in a new window
  fractions = false
```

## <a name="cssoverride"></a>CSS override
You can override the built-in CSS and use your own. Just put your own CSS files in the `static` directory of your website (the one in the theme directory also works but is not recommended for obvious reasons) and modify the `customCSS` parameter. The path should be relative to the `static` folder. These CSS files will be added through the `header` partial after the built-in CSS file.

For example, if your custom CSS files are `static/css/custom.css` and `static/css/custom2.css` then `customCSS` will look like this:

``` toml
[params]
  customCSS = ["css/custom.css","css/custom2.css"]
```

## <a name="menu"></a>Navigation menu
Links in the navigation menu (everything other than Google search and RSS icon) can be configured here. Navigation menu is generated using the `layouts/partials/navigation.html` template.

By default navigation menu links will open in the same window. You can change this behavior by setting the `navigationNewWindow` parameter to true. Links to root ("/") will always open in the same window. Currently Hugo does not support adding custom attributes to menus.

Links are sorted according to weight from left to right. For example a link with weight of `-10` will be to the left of links with weights `0` or `10`. Links can be added to the config file like this:

``` toml
[[menu.main]]
  Name = "Blog"
  URL = "/"
  weight = -10

[[menu.main]]
  Name = "The other guy from Wham!"
  URL = "https://www.google.com/search?q=andrew+ridgeley"
  weight = -5

[[menu.main]]
  Name = "This theme - add link"
  URL = "https://www.github.com"

[params]
  # If set to true, navigation menu links will open in a new window with the exception of links to root ("/")
  # If this item does not exist or is set to false, then navigation menu links will open in the same window
  navigationNewWindow = true
```

Search engine can also be customized:

``` toml
[params]
  searchEngineURL = "https://www.google.com/search"
```

## <a name="sidebarlinks"></a>Sidebar
Sidebar has four parts. From top to bottom it has:

* Sidebar header and text (optional).
* Social network icons (optional): Icons and links to Github, Bitbucket and more.
* Sidebar menu (optional): Links in sidebar (I use them for internal category pages but you can have external links).
* Recent posts: Displays last X (default is 5) posts.

The sidebar is generated using the partial template at `layouts/partials/sidebar.html`.

### <a name="sidebartext"></a>Sidebar text
Sidebar text has two parts and both can be configured. Both values are passed to `markdownify` so you can use markdown (e.g. add links or new lines).

* Sidebar header appears first in an `<h1>` tag. It can be configured through the `sidebarHeader` parameter.
* Sidebar text appears under the header and can be configured by modifying `sidebarText`.

New lines can be added with `</br>` or in markdown format (two spaces at the end of line or one empty line in between). When adding two new lines, remember to remove the indentation at the start of the new line otherwise the it will be treated as a codeblock.

``` toml
sidebarHeader = "Sidebar Header"

sidebarText = """Here's a [link to google](https://www.google.com)
</br>
Second line
</br>
Third line
This line has two spaces in the end to create a new line using markdown  
Forth line
"""
```

### <a name="sidebarsocial"></a>Social network icons
Sidebar social network icons are configured as follows:

``` toml
[params]
  github = "https://github.com/parsiya/"
  bitbucket = "https://bitbucket.org/parsiya/"
  gitlab = ""
  twitter = "https://twitter.com/cryptogangsta/"
  keybase = "https://keybase.io/parsiya/"
  stackoverflow = ""
  linkedin = ""
  googleplus = ""
  youtube = ""
  facebook = ""
  instagram = ""
```

Icon sequence can be configured in `layouts/partials/sidebar.html` (look for `<li class="sidebar-nav-item">`). Add a `</br>` tag to create a new line.

Code to display links (and the idea to use these icons) is from [Hyde-x](https://github.com/zyro/hyde-x/).

Icons are from [http://fontawesome.io](http://fontawesome.io) by Dave Gandy. To use icons with square dark backgrounds add `-square`. For example `<i class="fa fa-twitter-square fa-3x"></i>`. Size can be from 1 to 5 use `fa-lg` to make them adaptive.

### <a name="sidebarmenu"></a>Sidebar menu
This menu can be enabled by setting `sidebarMenuEnabled` to `true`. It has two parts:

* A header that appears inside the `<h1>` tag on top. It can be set by `sidebarMenuHeader`. This part only supports text.
* A series of links. They can be configured similar to navigation menu items by using the `[[menu.sidebar]]` tag. Set `sidebarNewWindow` to `true` to open these links in a new window

``` toml
[[menu.sidebar]]
  Name = "Google"
  URL = "https://www.google.com"
  weight = 0

[[menu.sidebar]]
  Name = "Hugo"
  URL = "/categories/hugo/"
  weight = 1
```

### <a name="sidebarrecent"></a>Recent posts
Last x posts can be displayed in the sidebar. This number is controlled by `sidebarRecentLimit`. To hide this section either remove `sidebarRecentLimit` from the config file or set it to zero.

## <a name="shortcodes"></a>Shortcodes
Creating [shortcodes](https://gohugo.io/extras/shortcodes/) in Hugo was surprisingly easy (and one of the reasons I switched to it). I used two plugins in Octopress that I re-created in Hugo using shortcodes. They add captions to code blocks and images. These shortcodes are located at `layouts/shortcodes/`.

I have created a repository for all of my Hugo shortcodes at [https://github.com/parsiya/Hugo-Shortcodes](https://github.com/parsiya/Hugo-Shortcodes).

### <a name="codecaption"></a>Code caption
This shortcode adds a caption to codeblocks. The codeblock is wrapped in a `<figure>` tag and caption is added using `<figcaption>`. It has two parameters, `title` which is the caption of the code block and `lang` which is the language that is passed to the Hugo's `highlight` function along with `linenos=true` to enable line numbers.

Shortcode usage (and source) is as follows (please note that parameters are named and not positional):

``` html
{{< codecaption lang="html" title="Code caption shortcode" >}}
<figure class="code">
  <figcaption>
    <span>{{ .Get "title" }}</span>
  </figcaption>
  <div class="codewrapper">
    {{ highlight .Inner (.Get "lang") "linenos=true" }}
  </div>
</figure>
{{< /codecaption >}}
```

And will look like:

![picture](https://raw.githubusercontent.com/parsiya/Hugo-Octopress/master/images/codecaption1.png).

If the code inside the tag overflows, a horizontal sidebar will be added to the table. It took me a while to achieve this as the `highlight` function created tables that were out of my control. The output from `highlight` is wrapped in `<div class="codewrapper">` and the scroll bar will be added for the whole `div`. The following in the CSS file (starting from line 2225) enables this behavior:

``` css
div.codewrapper {
    overflow-x: auto;
    overflow-y: hidden;
    background-color: #002B36;
}
```

### <a name="imgcap"></a>Image caption
This shortcode adds captions to pictures. Due to the way the original CSS file was organized, this shortcode does not use `<figure>` and `<figcaption>`. `Alt` tag is also set to `title`.

Usage is as follows (please note that parameters are named and not positional):

``` go
{{< imgcap title="Sample caption" src="/images/2016/thetheme/1.png" >}}
```

Will result in:

``` html
<span class="caption-wrapper">
  <img class="caption" src="/images/2016/thetheme/1.png" title="Sample caption" alt="Sample caption">
  <span class="caption-text">Sample caption</span>
</span>
```
#### <a name="snippets"></a>Atom snippets for shortcodes
In order to read about creating Atom snippets please see [Atom's Snippets package](https://github.com/atom/snippets).

Open your snippets file (`File > Open Your Snippets`) and paste the following:

``` coffee
'.source.gfm':
  'codecaption':
    'prefix': 'codecap'
    'body': """
    {{< codecaption title="$1" lang="$2"  >}}
    $3
    {{< /codecaption >}}
    """
  'imgcap':
    'prefix': 'imgcap'
    'body': '{{< imgcap title="$1" src="/images/2016/$2" >}}'
```

My original mistake was to repeat `'.source.gfm'` before the `imgcap` snippet, seems like [cson keys should not be repeated](https://atom.io/docs/latest/using-atom-basic-customization#id-D9ATX).

You can trigger the shortcodes by entering `imgcap` and `codecap` respectively and then pressing enter. You can change these keywords by modifying the `prefix` tag. After inserting the shortcode, the cursor will go to the first location which is designated by `$1`. After entering the first parameter you can go to `$2` and then `$3` using `tab`.

## <a name="summary"></a>Hugo page summary bug
Hugo will use first 70 words of the post if it does not have a summary divider. The result is usually not pretty and contains raw HTML. To avoid this, always use the summary divider `<!--more-->` to designate summary.

Hugo currently does not display reference style links in post summary. Because it takes everything before the summary divider and passes it to the Markdown engine (currently BlackFriday) and if your reference style links are at the bottom of the page (they usually are), they are not included. As a result your reference style links will be treated as unformatted text. You can read more about this bug [here](https://discuss.gohugo.io/t/markdown-content-renders-as-regular-text-in-summary/1396/12).

Reference style links look like this:

``` markdown
This is a link to [Example][example-link].

More stuff here.

Usually at the end of the markdown file.
[example-link]: https://www.example.com
```

There are two workarounds:

1. Do not use reference style links in summary. Use normal links like `[Example](https://www.example.com)`.
2. Put the reference links before the summary divider.

## <a name="licensepage"></a>License page
License page will be located at `baseurl/license/`. Markdown code for the license page can be anywhere in the content directory, however the type of the markdown file should be set to `license` in frontmatter. For example:

    ---
    title: "License"
    type: license
    ---

    License text

License page template is located at: `layouts/license/single.html`.

## <a name="tableofcontents"></a>Table of contents
The theme supports adding `Table of Contents (ToC)` to pages. This is done in `layouts/post/single.html`. The ToC does not appear in the summary but is on top of the actual page. Currently ToC is only accessible in the templates and there is no way to access it inside the page using shortcodes. This is a limitation of BlackFriday (Hugo's markdown engine).

There two ways to enable the ToC:

1. Each post/page can have a variable named `toc` in its frontmatter. This needs to be set to `true`.

    ``` yaml
    title: "title"
    date: 2016-04-01T20:22:37-04:00
    draft: false
    toc: true
    ```

2. Global setting is available in the config file, `tableOfContents` under `[Params]` needs to be set to `true`.

    ``` toml
    [Params]
      tableOfContents = true
    ```

The `toc` variable in frontmatter has priority. If it is set to `false` then `tableOfContents` in the config file is ignored. You skip it in the config file and set it for individual pages or enable it for all pages and disable it for specific pages in their frontmatter.

## <a name="notfound"></a>Not Found or 404.html
The `404.html` page has two optional parameters and both support markdown:

* `notFoundHeader`: 404 page title
* `notFoundText`: 404 page text

If they are not set in the config file, a default page is generated.

For extensive customization you can modify the template at `layouts/404.html`

## <a name="taxonomy"></a>Taxonomy pages
The theme can create pages that list all taxonomies (categories and tags) and their count. The taxonomy pages are at `baseURL/tags/` and `baseURL/categories`. They will be generated by `generateTaxonomyList = true`. By default items are sorted by count. `sortTaxonomyAlphabetical = true` changes the sort to alphabetical.

For example:

    [Params]
      generateTaxonomyList = true

      # Alphabetical sort
      # sortTaxonomyAlphabetical = true

To revert back to ByCount sort, remove `sortTaxonomyAlphabetical` or set it to false.

Note: As of Hugo 0.33, `indexes` has been removed. If your taxonomy pages are not rendered, please update to the latest version of Hugo. Templates are now at:

* `/layouts/category/category.html`
* `/layouts/tag/tag.html`

## <a name="page"></a>Individual pages
Individual pages can be created in two ways:

* Create a new content file in `content/page`.
* Set the type of page to `page` in frontmatter. E.g. `type: page`.

The template to individual page is at `Hugo-Octopress/layouts/page/single.html`. It can be overridden by a file in the website's `layouts/page/single.html`.

## <a name="disqus"></a>Disqus
Hugo supports Disqus. Note that previously Disqus short name was `[params]/disqusShortname` but it stopped working. It's most likely because my custom variable had the same name as Hugo's internal variable for Disqus. Disqus shortname is now directly in the config file (similar to baseurl for example):

``` toml
disqusShortname = "whatever"
```

The disqus partial is at `layouts/partials/disqus.html`. By default it does not add Disqus when you are testing on localhost using the test server. This can be disabled (e.g. if you want to test Disqus locally) by commenting the `if and return` lines in the partial above.

## <a name="issues"></a>Issues/TODO
If you discover any issues/bugs or want new features please use the Github issue tracker. Please keep in my mind that development has not been my day job for quite a while and I may be slow in fixing things (don't be surprised if I ask you about details).

**The css is a mess.** The CSS file is `screen.css` taken directly from the classic Octopress theme. I found it easier to just modify the templates to generate HTML code similar to Octopress' output and use the existing CSS file. It's bulky (around 53KBs and 2300 lines) and it probably has code for elements that are never used (also duplicates). It also contains the highlight code (contributes to size).

## <a name="attribution"></a>Attribution
* [Octopress](octopress-link) is created by [Brandon Mathis](https://github.com/imathis). Octopress source can be found on [https://github.com/imathis/octopress](https://github.com/imathis/octopress).
* Some code was taken from the [Hyde-x](https://github.com/zyro/hyde-x) Hugo theme by [Andrei Mihu](http://andreimihu.com/).
* Sidebar icons are from Font Awesome by Dave Gandy - http://fontawesome.io.
* Special thanks to everyone who has helped me with pull requests and issues.

## <a name="Ported by"></a>Ported by
Ported by Parsia Hakimian:

* website: [parsiya.net](https://parsiya.net)
* twitter: [@CryptoGangsta](https://twitter.com/cryptogangsta)

## <a name="themelicense"></a>Theme license
Open sourced under the [MIT license](https://github.com/parsiya/Hugo-Octopress/blob/master/LICENSE.md).

<!-- Links -->
[octopress-link]: http://octopress.org
[hugo-link]: https://gohugo.io
