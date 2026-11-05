import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

export interface Social { label: string; icon: string; url: string }
export interface SiteConfig {
  name: string; tagline?: string; photo?: string; nameIcon?: string;
  pages: string[]; socials: Social[];
  navPosition?: 'top' | 'left' | 'menu';
}

export function loadSite(): SiteConfig {
  const file = path.join(process.cwd(), 'content', 'site.yaml');
  return parse(fs.readFileSync(file, 'utf8')) as SiteConfig;
}

/** '/' + 'images/a.png' -> '<base>images/a.png' */
export const asset = (p = '') =>
  /^([a-z][a-z0-9+.-]*:|\/\/)/i.test(p)
    ? p
    : import.meta.env.BASE_URL.replace(/\/?$/, '/') + p.replace(/^\/+/, '');
