// Turns the custom markdown blocks (:::paper, :::course) into HTML,
// and prefixes site-relative links with the configured `base`.
import { visit } from 'unist-util-visit';

const el = (tag, cls, children = [], props = {}) => ({
  type: 'paragraph',
  data: { hName: tag, hProperties: { ...(cls ? { class: cls } : {}), ...props } },
  children,
});
const text = (value) => ({ type: 'text', value });

// Link keys usable on any block -> label shown on the page.
const LINKS = {
  pdf: 'Paper', paper: 'Paper', code: 'Code', slides: 'Slides',
  video: 'Video', poster: 'Poster', talk: 'Talk', url: 'Link', page: 'Page',
};

const isExternal = (u) => /^([a-z][a-z0-9+.-]*:|#|\/\/)/i.test(u);

export function remarkBlocks({ base = '/' } = {}) {
  const root = base.endsWith('/') ? base : base + '/';
  const fix = (u = '') => (isExternal(u) ? u : root + u.replace(/^\/+/, ''));

  return (tree) => {
    // Normal markdown links like [x](/papers/a.pdf) or ![](images/a.png)
    visit(tree, ['link', 'image'], (node) => {
      if (node.url && !isExternal(node.url)) node.url = fix(node.url);
    });

    visit(tree, 'containerDirective', (node) => {
      if (node.name !== 'paper' && node.name !== 'course') return;
      const a = node.attributes ?? {};
      const kind = node.name;

      const head = [el('p', 'item-title', [text(a.title ?? '(untitled)')])];
      const meta = kind === 'paper'
        ? [a.authors, a.venue]
        : [a.code, a.term, a.role];
      const metaText = meta.filter(Boolean).join(' · ');
      if (metaText) head.push(el('p', 'item-meta', [text(metaText)]));

      // action row: [+] Synopsis  [↗] Paper  [↗] Code ...
      const actions = [];
      const body = node.children;
      if (body.length) {
        actions.push({
          type: 'paragraph',
          data: { hName: 'button', hProperties: { class: 'syn-toggle', type: 'button', 'aria-expanded': 'false' } },
          children: [text('[+] Synopsis')],
        });
      }
      for (const [key, label] of Object.entries(LINKS)) {
        if (!a[key]) continue;
        actions.push({
          type: 'link',
          url: fix(a[key]),
          data: { hProperties: { class: 'item-link', target: '_blank', rel: 'noopener' } },
          children: [text(`[↗] ${label}`)],
        });
      }
      // Any extra links: links="Slides|https://...;Poster|papers/p.pdf"
      if (a.links) {
        for (const pair of a.links.split(';')) {
          const [label, url] = pair.split('|').map((s) => s?.trim());
          if (!label || !url) continue;
          actions.push({
            type: 'link', url: fix(url),
            data: { hProperties: { class: 'item-link', target: '_blank', rel: 'noopener' } },
            children: [text(`[↗] ${label}`)],
          });
        }
      }

      const children = [...head];
      if (actions.length) children.push(el('div', 'item-actions', actions));
      if (body.length) {
        children.push({
          type: 'paragraph',
          data: { hName: 'div', hProperties: { class: 'synopsis', hidden: true } },
          children: body,
        });
      }

      node.data = { hName: 'article', hProperties: { class: `item ${kind}` } };
      node.children = children;
    });
  };
}
