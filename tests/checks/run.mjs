// ITCS333 A1 autograder — content checks 1–6 (rubric in README).
// DO NOT MODIFY: official grading uses the instructor's pristine copy.
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHTML } from 'linkedom';
import { HtmlValidate } from 'html-validate';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const results = [];
function check(id, points, fn) {
  try {
    const r = fn();
    const passed = r === true;
    results.push({ id, status: passed ? 'PASS' : 'FAIL', got: passed ? points : 0, max: points, detail: passed ? '' : String(r ?? '') });
  } catch (e) {
    results.push({ id, status: 'FAIL', got: 0, max: points, detail: String(e.message || e) });
  }
}
const read = (f) => {
  const p = join(ROOT, f);
  if (!existsSync(p)) throw new Error(`missing file: ${f}`);
  return readFileSync(p, 'utf8');
};
const load = (f) => parseHTML(read(f));

// ---------- Check 1 (15 pts): valid boilerplate + parses clean ----------
check('html_valid_boilerplate', 15, () => {
  const hv = new HtmlValidate({
    extends: ['html-validate:recommended'],
    rules: {
      'no-trailing-whitespace': 'off',
      'void-style': 'off',
      'attribute-boolean-style': 'off',
      'no-implicit-button-type': 'off',
      'heading-level': 'off', // checked separately
      'wcag/h30': 'off',
      'prefer-native-element': 'off',
      'no-redundant-role': 'off',
      'require-sri': 'off'
    }
  });
  let pts = 0;
  for (const f of ['index.html', 'about.html']) {
    const src = read(f);
    if (!/<!doctype html>/i.test(src)) return `FAIL: ${f} missing <!DOCTYPE html>`;
    if (!/<html[^>]*lang=/i.test(src)) return `FAIL: ${f} missing lang attribute`;
    const { document } = load(f);
    if (!document.querySelector('title')?.textContent.trim()) return `FAIL: ${f} missing non-empty <title>`;
    const report = hv.validateStringSync(src, f);
    const errs = report.results.flatMap((r) => r.messages).filter((m) => m.severity === 2);
    if (errs.length > 0) return `FAIL: ${f} invalid HTML: ${errs[0].message} (line ${errs[0].line})`;
    pts += 7.5;
  }
  return pts === 15 ? true : 'FAIL: incomplete';
});

// ---------- Check 2 (15 pts): semantic elements ----------
check('semantic_elements', 15, () => {
  for (const f of ['index.html', 'about.html']) {
    const { document } = load(f);
    for (const tag of ['header', 'nav', 'main', 'footer']) {
      if (!document.querySelector(tag)) return `FAIL: ${f} missing <${tag}>`;
    }
  }
  return true;
});

// ---------- Check 3 (10 pts): heading hierarchy ----------
check('heading_hierarchy', 10, () => {
  for (const f of ['index.html', 'about.html']) {
    const { document } = load(f);
    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => Number(h.tagName[1]));
    if (headings.length === 0) return `FAIL: ${f} has no headings`;
    if (headings[0] !== 1) return `FAIL: ${f} first heading must be h1`;
    for (let i = 1; i < headings.length; i++) {
      if (headings[i] > headings[i - 1] + 1) return `FAIL: ${f} skips a heading level (h${headings[i - 1]} → h${headings[i]})`;
    }
  }
  return true;
});

// ---------- Check 4 (10 pts): internal + external links ----------
check('links', 10, () => {
  const idx = load('index.html').document;
  const abt = load('about.html').document;
  const hrefs = (d) => [...d.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));
  const ih = hrefs(idx), ah = hrefs(abt);
  if (!ih.some((h) => /about\.html/.test(h))) return 'FAIL: index.html must link to about.html';
  if (!ah.some((h) => /index\.html/.test(h))) return 'FAIL: about.html must link to index.html';
  if (![...ih, ...ah].some((h) => /^https?:\/\//.test(h))) return 'FAIL: need at least one external link (http/https)';
  return true;
});

// ---------- Check 5 (10 pts): image with alt ----------
check('image_alt', 10, () => {
  for (const f of ['index.html', 'about.html']) {
    const { document } = load(f);
    const imgs = [...document.querySelectorAll('img')];
    if (imgs.some((i) => (i.getAttribute('alt') ?? '').trim().length > 0)) return true;
  }
  return 'FAIL: need at least one <img> with non-empty alt across the two pages';
});

// ---------- Check 6 (10 pts): ordered + unordered lists ----------
check('lists', 10, () => {
  const docs = ['index.html', 'about.html'].map((f) => load(f).document);
  const has = (sel) => docs.some((d) => d.querySelector(sel));
  if (!has('ol li')) return 'FAIL: no ordered list with items found';
  if (!has('ul li')) return 'FAIL: no unordered list with items found';
  return true;
});

// ---------- report ----------
let got = 0, max = 0;
for (const r of results) {
  got += r.got; max += r.max;
  console.log(`CHECK ${r.id} ${r.status} ${r.got}/${r.max}${r.detail ? ' -- ' + r.detail : ''}`);
}
console.log(`TOTAL ${got}/${max}`);
process.exit(got === max ? 0 : 1);
