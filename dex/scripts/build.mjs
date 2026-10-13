#!/usr/bin/env node
// Dependency-free static site build: site/landing.html + docs/*.md -> index.html + docs/*.html.
// Design rationale: DESIGN-LOG.md. Run: node scripts/build.mjs
import { readFileSync, writeFileSync, readdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const cfg = JSON.parse(readFileSync(join(ROOT, 'site/site.json'), 'utf8'));
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const slug = (s) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function inline(s) {
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push('<code>' + esc(c) + '</code>'); return '\u0000' + (codes.length - 1) + '\u0000'; });
  s = esc(s)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*\w])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => {
      const href = /^https?:/.test(u) ? u : u.replace(/(^|\/)([A-Za-z0-9_-]+)\.md(#.*)?$/, (m, a, b, h) => a + b + '.html' + (h || ''));
      return '<a href="' + href + '"' + (/^https?:/.test(u) ? ' rel="noopener"' : '') + '>' + t + '</a>';
    })
    .replace(/&lt;br\/?&gt;/g, '<br>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => codes[+i]);
}

export function markdown(md) {
  const lines = md.replace(/\r/g, '').split('\n');
  const out = []; const toc = [];
  let i = 0;
  const isTable = (l) => /^\s*\|.*\|\s*$/.test(l);
  while (i < lines.length) {
    const l = lines[i];
    if (/^```/.test(l)) {
      const lang = l.slice(3).trim(); const buf = [];
      for (i++; i < lines.length && !/^```/.test(lines[i]); i++) buf.push(lines[i]);
      i++;
      out.push(lang === 'mermaid' ? '<figure class="diagram"><pre class="mermaid">' + esc(buf.join('\n')) + '</pre></figure><p class="scroll-hint">Diagram scrolls sideways →</p>' : '<pre><code>' + esc(buf.join('\n')) + '</code></pre>');
      continue;
    }
    const h = /^(#{1,4})\s+(.*)$/.exec(l);
    if (h) { const level = h[1].length; const text = inline(h[2]); const id = slug(h[2]); if (level === 2) toc.push({ id, text }); out.push('<h' + level + ' id="' + id + '">' + text + '</h' + level + '>'); i++; continue; }
    if (/^\s*(---|\*\*\*)\s*$/.test(l)) { out.push('<hr>'); i++; continue; }
    if (isTable(l) && i + 1 < lines.length && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      const cells = (r) => r.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = cells(l); i += 2; const rows = [];
      while (i < lines.length && isTable(lines[i])) rows.push(cells(lines[i++]));
      const empty = head.every((c) => !c);
      out.push('<div class="table"><table>' + (empty ? '' : '<thead><tr>' + head.map((c) => '<th>' + inline(c) + '</th>').join('') + '</tr></thead>') + '<tbody>' + rows.map((r) => '<tr>' + r.map((c) => '<td>' + inline(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>');
      continue;
    }
    if (/^>\s?/.test(l)) { const buf = []; while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, '')); out.push('<blockquote>' + inline(buf.join(' ')) + '</blockquote>'); continue; }
    if (/^\s*([-*]|\d+\.)\s+/.test(l)) {
      const ordered = /^\s*\d+\./.test(l); const items = [];
      while (i < lines.length && (/^\s*([-*]|\d+\.)\s+/.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
        const m = /^(\s*)([-*]|\d+\.)\s+(.*)$/.exec(lines[i]);
        if (m) items.push({ depth: m[1].length >= 2 ? 1 : 0, text: m[3] }); else items[items.length - 1].text += ' ' + lines[i].trim();
        i++;
      }
      let html = ''; let open = false;
      for (const it of items) {
        if (it.depth && !open) { html = html.replace(/<\/li>$/, '') + '<ul>'; open = true; }
        if (!it.depth && open) { html += '</ul></li>'; open = false; }
        html += '<li>' + inline(it.text) + '</li>';
      }
      if (open) html += '</ul></li>';
      out.push((ordered ? '<ol>' : '<ul>') + html + (ordered ? '</ol>' : '</ul>'));
      continue;
    }
    if (!l.trim()) { i++; continue; }
    const buf = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|```|>|\s*([-*]|\d+\.)\s)/.test(lines[i]) && !isTable(lines[i])) buf.push(lines[i++].trim());
    out.push('<p>' + inline(buf.join(' ')) + '</p>');
  }
  return { html: out.join('\n'), toc };
}

const docs = cfg.docs.map((d) => ({ ...d, md: readFileSync(join(ROOT, 'docs', d.file), 'utf8') }));
const header = (depth, active) => {
  const up = depth ? '../' : '';
  return '<header class="masthead"><a class="brand" href="' + up + 'index.html"><span class="brand-dot" aria-hidden="true"></span>' + cfg.brand + '<span class="brand-sub">' + cfg.product + '</span></a>'
    + '<nav aria-label="Documents">' + docs.map((d) => '<a href="' + up + 'docs/' + d.file.replace(/\.md$/, '.html') + '"' + (active === d.file ? ' aria-current="page"' : '') + '>' + d.title + '</a>').join('') + '</nav></header>';
};
const footer = (depth) => '<footer class="foot"><div>' + cfg.footer + '</div><div><a href="' + cfg.repo + '">Source on GitHub</a>' + (cfg.related ? ' · <a href="' + cfg.related.url + '">' + cfg.related.title + '</a>' : '') + '</div></footer>';
const page = (title, body, depth, extraHead = '') => '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(title) + '</title><meta name="description" content="' + esc(cfg.description) + '"><link rel="stylesheet" href="' + (depth ? '../' : '') + 'site/style.css">' + extraHead + '</head><body>' + body + '</body></html>\n';
const mermaid = '<script type="module">import m from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";m.initialize({startOnLoad:true,flowchart:{useMaxWidth:false},sequence:{useMaxWidth:false},theme:"base",themeVariables:{fontFamily:"Helvetica Neue, Helvetica, Arial, sans-serif",primaryColor:"#ffffff",primaryBorderColor:"#111111",primaryTextColor:"#111111",lineColor:"#111111",clusterBkg:"#f2f1ec",clusterBorder:"#c9c7bf",tertiaryColor:"#f2f1ec",actorBkg:"#ffffff",actorBorder:"#111111",noteBkgColor:"#fff6d6"}});</script>';

for (const d of docs) {
  const { html, toc } = markdown(d.md);
  const aside = toc.length > 1 ? '<aside class="toc" aria-label="On this page"><div class="toc-label">On this page</div>' + toc.map((t) => '<a href="#' + t.id + '">' + t.text + '</a>').join('') + '</aside>' : '<aside class="toc"></aside>';
  const idx = docs.indexOf(d); const next = docs[idx + 1];
  const body = header(1, d.file) + '<main class="doc"><div class="doc-line" style="--line:' + d.color + '" aria-hidden="true"></div>' + aside + '<article class="prose"><div class="kicker" style="--line:' + d.color + '">' + String(idx + 1).padStart(2, '0') + ' · ' + cfg.product + '</div>' + html
    + (next ? '<a class="next" href="' + next.file.replace(/\.md$/, '.html') + '"><span>Next</span>' + next.title + ' →</a>' : '') + '</article></main>' + footer(1);
  writeFileSync(join(ROOT, 'docs', d.file.replace(/\.md$/, '.html')), page(d.title + ' — ' + cfg.product, body, 1, d.md.includes('```mermaid') ? mermaid : ''));
}
let landing = readFileSync(join(ROOT, 'site/landing.html'), 'utf8');
landing = landing.replace('{{header}}', header(0, null)).replace('{{footer}}', footer(0))
  .replace('{{doccards}}', docs.map((d, i) => '<a class="card" href="docs/' + d.file.replace(/\.md$/, '.html') + '" style="--line:' + d.color + '"><span class="card-no">' + String(i + 1).padStart(2, '0') + '</span><span class="card-title">' + d.title + '</span><span class="card-text">' + esc(d.summary) + '</span></a>').join(''));
writeFileSync(join(ROOT, 'index.html'), page(cfg.product + ' — ' + cfg.tagline, landing, 0));
writeFileSync(join(ROOT, '.nojekyll'), '');
console.log('built index.html + ' + docs.length + ' docs');
