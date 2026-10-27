import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { parseHTML } from 'linkedom';

const tests = dirname(fileURLToPath(import.meta.url));
const theme = resolve(tests, '..');
const work = join(tests, '.work');
const fixture = readFileSync(join(theme, 'exampleSite/content/post/bidirectional-text/index.md'), 'utf8');
const rtl = new Set(['ar', 'ckb', 'fa', 'he', 'pnb', 'ur']);
const localeCodes = [
  'ar', 'be', 'bg', 'bn', 'ca', 'ckb', 'cs', 'da', 'de', 'el', 'en', 'eo',
  'es', 'fa', 'fi', 'fr', 'he', 'hi', 'hr', 'hu', 'id', 'it', 'ja', 'ko',
  'ku', 'mn', 'ms', 'nl', 'no', 'oc', 'pa', 'pl', 'pnb', 'pt', 'ro', 'ru',
  'sk', 'sv', 'sw', 'th', 'tr', 'uk', 'uz', 'vi', 'zh-tw', 'zh',
];

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function build(name, options = {}) {
  const codes = options.codes ?? ['en', 'fa'];
  const source = join(work, name);
  rmSync(source, { recursive: true, force: true });
  const output = join(source, 'public');
  const basePath = options.basePath ?? '/blog/';
  const defaultLanguage = codes[0];
  const languagePath = code => code === defaultLanguage && !options.subdir ? '' : `${code}/`;
  const languages = Object.fromEntries(codes.map((code, index) => {
    const menu = [
      { name: 'Home', pageRef: '/' },
      { name: 'About', pageRef: '/about' },
      { name: 'Custom', url: '/post/mixed/' },
      { name: 'Prefixed', url: `/${languagePath(code)}post/mixed/` },
      { name: 'Base prefixed', url: `${basePath}${languagePath(code)}post/mixed/` },
      { name: 'Base home', url: basePath.replace(/\/$/, '') || '/' },
      { name: 'Base home slash', url: basePath },
      { name: 'External', url: 'https://example.net/' },
      { name: 'Mail', url: 'mailto:test@example.net' },
      { name: 'Fragment', url: '#local' },
    ];
    return [code, { locale: code, label: code, direction: rtl.has(code) ? 'rtl' : 'ltr',
      weight: index + 1, menus: { main: menu, sidebar: menu.filter(entry => ['Home', 'About', 'Base home', 'Base home slash'].includes(entry.name)) } }];
  }));
  const config = {
    baseURL: `https://example.org${basePath}`, title: 'Integration test',
    theme: basename(theme), themesDir: dirname(theme),
    defaultContentLanguage: defaultLanguage, defaultContentLanguageInSubdir: !!options.subdir,
    languages, pagination: { pagerSize: 1 },
    params: { mainSections: ['post'], rss: true, sidebarRecentLimit: 2,
      sidebarMenuEnabled: true, sidebarMenuHeader: 'Links', author: 'Test author',
      searchEngineURL: 'https://example.net/search', compactIndex: !!options.compact,
      navigationNewWindow: true, ...options.params },
  };
  write(join(source, 'hugo.json'), JSON.stringify(config, null, 2));
  for (const code of codes) {
    write(join(source, `content/post/mixed.${code}.md`), fixture);
    write(join(source, `content/post/second.${code}.md`), '+++\ntitle="Second"\ndate=2026-10-24\n+++\nSecond article.');
    write(join(source, `content/about.${code}.md`), '+++\ntitle="About"\ntype="page"\ndate=2026-10-24\n+++\nAbout this site.');
  }
  if (codes.includes('en')) {
    write(join(source, 'content/license.en.md'), '+++\ntitle="License"\ntype="license"\n+++\nLicense text.');
    write(join(source, 'content/post/unpaired.en.md'), '+++\ntitle="Unpaired"\ndate=2026-10-23\n+++\nEnglish only.');
  }
  if (options.invalid) {
    write(join(source, `content/invalid.${defaultLanguage}.md`), '+++\ntitle="Invalid"\n+++\n{{< bidi dir="sideways" >}}Wrong{{< /bidi >}}');
  }
  const result = spawnSync('hugo', ['--source', source, '--destination', output, '--panicOnWarning'], { encoding: 'utf8' });
  assert.ifError(result.error);
  if (options.invalid) {
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /invalid direction/);
    return;
  }
  assert.equal(result.status, 0, result.stdout + result.stderr);
  function htmlFor(url) {
    const pathname = new URL(url, config.baseURL).pathname;
    assert.ok(pathname.startsWith(basePath), `Lost base path: ${url}`);
    const relative = pathname.slice(basePath.length);
    const file = relative.endsWith('.html') ? relative : `${relative}index.html`;
    return readFileSync(join(output, file), 'utf8');
  }
  function documentFor(url) {
    return parseHTML(htmlFor(url)).document;
  }
  for (const code of codes) {
    const home = `${basePath}${languagePath(code)}`;
    const persianLabels = code === 'fa' || (defaultLanguage === 'fa' && code !== 'en');
    const homepage = documentFor(home);
    const article = documentFor(`${home}post/mixed/`);
    assert.equal(article.documentElement.getAttribute('lang'), code);
    assert.equal(article.documentElement.getAttribute('dir'), rtl.has(code) ? 'rtl' : 'ltr');
    assert.equal(article.querySelector('body>header h1 a').getAttribute('href'), home);
    assert.equal(article.querySelector('.subscription a').getAttribute('href'), `${home}index.xml`);
    assert.equal(article.querySelector('input.search').getAttribute('dir'), 'auto');
    assert.ok(!/^\s/.test(article.querySelector('time').textContent), `${code}: missing month`);
    for (const month of documentFor(`${home}post/`).querySelectorAll('.month')) assert.ok(month.textContent.trim(), `${code}: empty archive month`);
    if (code === 'en') assert.equal(article.querySelector('time').textContent, 'Oct 25, 2026');
    assert.equal(article.querySelector('#recent_posts').parentElement.querySelector('h1').textContent.trim(), persianLabels ? 'نوشته‌های تازه' : 'Recent Posts');
    assert.equal(article.querySelector('.entry-content bdi strong').textContent, 'C++ (v1.2)');
    assert.equal(article.querySelector('.entry-content div[dir="ltr"] bdi[dir="rtl"]').textContent, 'שלום!');
    assert.equal(article.querySelector('bdi bdi[dir="ltr"]').textContent, 'C++');
    assert.equal(article.querySelector('bdi p'), null);
    assert.ok(!article.documentElement.textContent.includes('OCTODIRECTION'));
    assert.equal(article.querySelector('.entry-content h2 code').textContent, 'curl -I');
    assert.equal(article.querySelector('.entry-content div[dir="rtl"][lang="fa"] td code').textContent, 'curl -I');
    assert.deepEqual(Array.from(article.querySelectorAll('.entry-content h2 code'), code => code.textContent), ['curl -I', 'C++']);
    assert.deepEqual(Array.from(article.querySelectorAll('.entry-content div[dir="rtl"][lang="fa"] td code'), code => code.textContent), ['curl -I', 'C++', '--help']);
    assert.equal(article.querySelector('.entry-content div[dir="rtl"][lang="fa"]').getAttribute('dir'), 'rtl');
    assert.ok(article.querySelector('.highlight table'));
    assert.ok(article.querySelector('.codewrapper table'));
    assert.equal(article.querySelector('figure.code figcaption').textContent.trim(), 'Caption');
    assert.ok(article.querySelector('div[dir="ltr"] figure.code'));
    assert.equal(article.querySelector('.entry-content div[dir="rtl"] > div[dir="ltr"] strong').textContent, 'block');
    assert.doesNotMatch(htmlFor(`${home}post/mixed/`), /<p>\s*<(?:div|figure)\b/);
    for (const selector of ['.main-navigation a', '.mobile-nav option', 'aside.sidebar a']) {
      for (const name of ['Base home', 'Base home slash']) {
        const link = Array.from(article.querySelectorAll(selector)).find(element => element.textContent.trim() === name);
        assert.ok(link, `${selector}: ${name}`);
        assert.equal(link.getAttribute(link.tagName === 'OPTION' ? 'value' : 'href'), home, `${code}: ${selector}: ${name}`);
      }
    }
    for (const menu of ['Home', 'About', 'Custom', 'Prefixed', 'Base prefixed']) {
      const link = article.querySelector(`.main-navigation a[title="${menu}"]`);
      const target = menu === 'Home' ? home : menu === 'About' ? `${home}about/` : `${home}post/mixed/`;
      assert.equal(link.getAttribute('href'), target, `${code} ${menu}`);
      if (menu === 'Home') assert.equal(link.getAttribute('target'), null);
    }
    assert.equal(article.querySelector('.main-navigation a[title="External"]').getAttribute('href'), 'https://example.net/');
    assert.equal(article.querySelector('.main-navigation a[title="Mail"]').getAttribute('href'), 'mailto:test@example.net');
    assert.equal(article.querySelector('.main-navigation a[title="Fragment"]').getAttribute('href'), '#local');
    assert.equal(!!article.querySelector(`link[href="${basePath}css/fonts.css"]`), !options.params?.disableGoogleFonts);
    assert.ok(article.querySelector(`link[href="${basePath}css/vazirmatn.css"]`));
    assert.ok(article.querySelector(`link[href="${basePath}css/fork-awesome.min.css"]`));
    for (const link of article.querySelectorAll('.label, .category')) {
      assert.ok(link.getAttribute('href').startsWith(home));
      documentFor(link.getAttribute('href'));
    }
    assert.equal(article.querySelectorAll('.language-switch').length, codes.length - 1);
    for (const link of article.querySelectorAll('.language-switch a')) {
      assert.equal(link.getAttribute('dir'), null);
      assert.equal(link.querySelector('bdi').getAttribute('dir'), rtl.has(link.getAttribute('hreflang')) ? 'rtl' : 'ltr');
    }
    assert.equal(article.querySelectorAll('link[hreflang]').length, codes.length - 1);
    assert.ok(documentFor(`${home}about/`).querySelector('article'));
    assert.ok(documentFor(`${home}404.html`).documentElement.textContent.includes(persianLabels ? 'صفحه پیدا نشد' : 'Not Found'));
    if (options.compact) {
      assert.ok(homepage.querySelector('table.allposts'));
      assert.equal(homepage.querySelector('.blog-index'), null);
    } else {
      assert.ok(homepage.querySelector('.pagination a'));
      const reading = article.querySelector('article header .meta').textContent;
      assert.ok(reading.includes(persianLabels ? 'دقیقه مطالعه' : 'minute read'), reading);
      const readOn = homepage.querySelector('[rel="full-article"]').textContent;
      assert.ok(readOn.includes(options.params?.continueReadingText ?? (persianLabels ? 'ادامه مطلب' : 'Read On')));
    }
  }
  const firstArticle = documentFor(`${basePath}${languagePath(defaultLanguage)}post/mixed/`);
  const stylesheet = firstArticle.querySelector('link[href*="/css/hugo-octopress"]');
  const stylesheetPath = new URL(stylesheet.getAttribute('href'), config.baseURL).pathname.slice(basePath.length);
  const styles = parseHTML(`<style>${readFileSync(join(output, stylesheetPath), 'utf8')}</style>`).document.querySelector('style');
  const codeRule = Array.from(styles.sheet.cssRules).find(rule => rule.selectorText === 'code');
  assert.ok(codeRule, 'All code elements must have direction rules');
  assert.equal(codeRule.style.direction, 'ltr');
  assert.equal(codeRule.style['unicode-bidi'], 'isolate');
  const searchRule = Array.from(styles.sheet.cssRules).find(rule => rule.selectorText === 'body>nav form .search');
  assert.equal(searchRule.style.padding, '.3em .5em');
  const desktopNavigation = Array.from(styles.sheet.cssRules).find(rule => rule.media?.mediaText.replace(/\s/g, '') === 'onlyscreenand(min-width:550px)');
  const searchFieldset = Array.from(desktopNavigation.cssRules).find(rule => rule.selectorText === 'body>nav fieldset[role=search]');
  assert.equal(searchFieldset.style['padding-top'], '.15em');
  const fieldsetReset = Array.from(styles.sheet.cssRules).find(rule => rule.selectorText === 'fieldset,img');
  assert.equal(fieldsetReset.style.border, '0');
  const fonts = join(output, 'fonts/vazirmatn');
  const files = {
    'Vazirmatn-Regular.woff2': 'e382101336c6eb32cfb31381c027d02d2e0354bad08f6a395d4088beb3db3d91',
    'Vazirmatn-Bold.woff2': '836fae7d42d83faa249bc00e0099592be98a1fa260d22d82f269b6091e585627',
    'OFL.txt': '17e355067c8284f47743a1ee3b1ef7ff684ff0601eda357f9353b10b3016ab31',
  };
  for (const [file, expected] of Object.entries(files)) {
    const content = readFileSync(join(fonts, file));
    assert.equal(createHash('sha256').update(content).digest('hex'), expected, file);
    if (file.endsWith('.woff2')) assert.equal(content.subarray(0, 4).toString(), 'wOF2');
  }
  const css = readFileSync(join(output, 'css/vazirmatn.css'), 'utf8');
  assert.ok(css.includes('unicode-range:'));
  for (const file of Object.keys(files).filter(file => file.endsWith('.woff2'))) {
    assert.ok(css.includes(`../fonts/vazirmatn/${file}`));
  }
  if (codes.includes('en')) {
    const englishHome = `${basePath}${languagePath('en')}`;
    const unpaired = documentFor(`${englishHome}post/unpaired/`);
    assert.equal(unpaired.querySelector('.language-switch'), null);
    assert.ok(unpaired.querySelector('footer[role="contentinfo"] a[href$="/license/"]'));
  }
  return { source, output };
}

for (const basePath of ['/', '/blog/']) {
  for (const subdir of [false, true]) {
    test(`routing ${basePath} default subdirectory=${subdir}`, () => build(`routing-${basePath === '/' ? 'root' : 'blog'}-${subdir}`, { basePath, subdir }));
  }
}
test('46 reference locales plus Urdu', () => {
  assert.equal(localeCodes.length, 46);
  build('all-locales', { codes: ['en', ...localeCodes.filter(code => code !== 'en'), 'ur'] });
});
test('single RTL language with English fallback', () => build('arabic-only', { codes: ['ar'] }));
test('missing labels use the non-English default language', () => build('persian-default', { codes: ['fa', 'ar'] }));
test('multihost translation and fallback license links retain their hosts', () => {
  const { source, output } = build('multihost');
  const configPath = join(source, 'hugo.json');
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  for (const code of ['en', 'fa']) config.languages[code].baseURL = `https://${code}.example.org/blog/`;
  write(configPath, JSON.stringify(config, null, 2));
  const result = spawnSync('hugo', ['--source', source, '--destination', output, '--panicOnWarning'], { encoding: 'utf8' });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const links = [];
  for (const code of ['en', 'fa']) {
    const article = parseHTML(readFileSync(join(output, code, 'post/mixed/index.html'), 'utf8')).document;
    const other = code === 'en' ? 'fa' : 'en';
    links.push({
      language: code,
      desktop: article.querySelector('.language-switch a').getAttribute('href'),
      mobile: article.querySelector(`.mobile-nav option[lang="${other}"]`).getAttribute('value'),
      license: article.querySelector('footer[role="contentinfo"] a[href$="/license/"]').getAttribute('href'),
    });
  }
  assert.deepEqual(links, ['en', 'fa'].map(code => ({
    language: code,
    desktop: `https://${code === 'en' ? 'fa' : 'en'}.example.org/blog/post/mixed/`,
    mobile: `https://${code === 'en' ? 'fa' : 'en'}.example.org/blog/post/mixed/`,
    license: 'https://en.example.org/blog/license/',
  })));
});
test('compact index', () => build('compact', { compact: true }));
test('custom continue-reading label', () => build('custom', { params: { continueReadingText: 'Custom read label' } }));
test('invalid shortcode direction rejected', () => build('invalid', { invalid: true }));
test('bundled Vazirmatn at site root', () => build('vazirmatn-root', { basePath: '/' }));
test('bundled Vazirmatn under deployment prefix without PT fonts', () => build('vazirmatn-prefix', { params: { disableGoogleFonts: true } }));
test('bundled example site', () => {
  mkdirSync(work, { recursive: true });
  const result = spawnSync('hugo', ['--source', join(theme, 'exampleSite'),
    '--themesDir', dirname(theme), '--theme', basename(theme),
    '--destination', join(work, 'example-site'), '--panicOnWarning'], { encoding: 'utf8' });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stdout + result.stderr);
});