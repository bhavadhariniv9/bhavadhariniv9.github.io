# bhavadhariniv9.github.io

Static site (Astro) → GitHub Pages. You only edit files in `content/` and `public/`.

## Where things live
| What | File |
|---|---|
| Name, photo, **tab order**, **social icons/links** | `content/site.yaml` |
| Bio (header text, supports links) | `content/bio.md` |
| One tab = one file | `content/pages/<name>.md` (`title:` in frontmatter = tab label) |
| Colours / fonts | `src/styles/tokens.css` |
| PDFs | `public/papers/` → refer to as `papers/<file>.pdf` |
| Images, icons | `public/images/`, `public/icons/` |

## Add a tab
1. Create `content/pages/talks.md` with `---\ntitle: talks\n---` and any markdown.
2. Add `- talks` to `pages:` in `content/site.yaml`. Done. (More tabs than fit → scroll arrows appear.)

### Page layout
The first page in `pages:` (home) shows the full header (photo, bio, socials). Every other page is *compact*:
a big title + orange line, then your content. The title defaults to the tab label with a capital letter;
set `heading: My Title` in the page's frontmatter to change it, or `compact: false` to give that page the full header.

## Add a paper / course (inside any page)
```md
:::paper{title="My Paper" authors="w/ A, B" venue="USENIX 2026" pdf="papers/my-paper.pdf" code="https://github.com/..." links="Talk|https://youtu.be/x;Poster|papers/poster.pdf"}
Synopsis text, **markdown** allowed. Shown under "[+] Synopsis".
:::

:::course{title="Computer Architecture" code="CS 305" term="Autumn 2025" role="TA" url="https://..."}
Optional description.
:::
```
Link keys: `pdf code slides video poster talk url page`, plus `links="Label|url;Label|url"`. (In a `:::course`, `code` is the course number, so use `url` or `links=` for web links.)

## Social icons
In `content/site.yaml`: `icon:` is any image in `public/`, `url:` is a link or `mailto:you@x.com`.

## Run locally
```
npm install
npm run dev      # http://localhost:4321
```

## Publish (one-time)
1. On GitHub create a **public** repo named exactly `bhavadhariniv9.github.io` (your username must be `bhavadhariniv9`).
2. `git init -b main && git add . && git commit -m "site" && git remote add origin git@github.com:bhavadhariniv9/bhavadhariniv9.github.io.git && git push -u origin main`
3. Repo → Settings → Pages → **Source: GitHub Actions**.
4. Every push to `main` rebuilds and redeploys (about 1 min). Watch it in the Actions tab.

Using a different repo name? Set `base: '/<repo-name>'` and `site` in `astro.config.mjs`.
