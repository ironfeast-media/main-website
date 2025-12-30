import * as adapter from '@astrojs/netlify/netlify-functions.js';
import { renderers } from './renderers.mjs';
import { manifest } from './manifest_b0042c01.mjs';

const _page0  = () => import('./chunks/generic_dfe357cb.mjs');
const _page1  = () => import('./chunks/index_896b1f63.mjs');
const _page2  = () => import('./chunks/feed_bca44367.mjs');
const _page3  = () => import('./chunks/index_e5533e2d.mjs');
const _page4  = () => import('./chunks/index_7a5f32a9.mjs');
const _page5  = () => import('./chunks/_page__398b288e.mjs');
const _page6  = () => import('./chunks/index_cca223ac.mjs');
const _page7  = () => import('./chunks/_slug__0494eefd.mjs');
const _page8  = () => import('./chunks/index_716c7cdb.mjs');const pageMap = new Map([["node_modules/astro/dist/assets/endpoint/generic.js", _page0],["src/pages/index.astro", _page1],["src/pages/feed.xml.ts", _page2],["src/pages/gaming/index.astro", _page3],["src/pages/blog/index.astro", _page4],["src/pages/blog/page/[page].astro", _page5],["src/pages/blog/tag/[tag]/index.astro", _page6],["src/pages/blog/[slug].astro", _page7],["src/pages/labs/index.astro", _page8]]);
const _manifest = Object.assign(manifest, {
	pageMap,
	renderers,
});
const _args = {};

const _exports = adapter.createExports(_manifest, _args);
const handler = _exports['handler'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { handler, pageMap };
