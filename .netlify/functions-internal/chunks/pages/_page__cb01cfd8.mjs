import { e as createAstro, f as createComponent, r as renderTemplate, g as renderHead, h as renderSlot, i as renderComponent, m as maybeRenderHead, j as addAttribute } from '../astro_e215eea9.mjs';
import 'clsx';

const $$Astro$1 = createAstro("https://ironfeast.tv");
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title = "Ironfeast" } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><link rel="stylesheet" href="/styles.css">${renderHead()}</head> <body> <nav class="site-nav"> <a href="/">Home</a> <a href="/gaming/">Gaming</a> <a href="/labs/">Labs</a> <a href="/blog/">Blog</a> </nav> <main class="container"> ${renderSlot($$result, $$slots["default"])} </main> </body></html>`;
}, "E:/code/ironfeast/website-media/src/layouts/BaseLayout.astro", void 0);

const $$Astro = createAstro("https://ironfeast.tv");
const $$page = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$page;
  const page = Number(Astro2.params.page || 1);
  const pageSize = 5;
  const modules = Object.entries(/* #__PURE__ */ Object.assign({}));
  const posts = modules.map(([path, mod]) => {
    const slug = path.split("/").pop().replace(".md", "");
    return { slug, ...mod.frontmatter ?? {}, Content: mod.default };
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
  const total = posts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const pagePosts = posts.slice(start, start + pageSize);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `Blog \xB7 Page ${page}` }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h2>Technical Journal — Page ${page}</h2> <section class="section"> <ul> ${pagePosts.map((post) => renderTemplate`<li> <a${addAttribute(`/blog/${post.slug}/`, "href")}>${post.title}</a> — <small>${post.date}</small> <p class="sub">${post.summary}</p> </li>`)} </ul> </section> <nav class="pagination-nav"> ${page > 1 ? renderTemplate`<a${addAttribute(`/blog/page/${page - 1}/`, "href")}>← Prev</a>` : renderTemplate`<span class="disabled">← Prev</span>`} ${Array.from({ length: totalPages }).map((_, i) => {
    const p = i + 1;
    return p === page ? renderTemplate`<span class="current">${p}</span>` : renderTemplate`<a${addAttribute(`/blog/page/${p}/`, "href")}>${p}</a>`;
  })} ${page < totalPages ? renderTemplate`<a${addAttribute(`/blog/page/${page + 1}/`, "href")}>Next →</a>` : renderTemplate`<span class="disabled">Next →</span>`} </nav> ` })}`;
}, "E:/code/ironfeast/website-media/src/pages/blog/page/[page].astro", void 0);

const $$file = "E:/code/ironfeast/website-media/src/pages/blog/page/[page].astro";
const $$url = "/blog/page/[page]";

const _page_ = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$page,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { $$BaseLayout as $, _page_ as _ };
