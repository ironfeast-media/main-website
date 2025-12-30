import { f as createComponent, r as renderTemplate, i as renderComponent, m as maybeRenderHead, e as createAstro, j as addAttribute } from '../astro_e215eea9.mjs';
import 'clsx';
import { $ as $$BaseLayout } from './_page__cb01cfd8.mjs';
import { _ as __vite_glob_0_0, a as __vite_glob_0_1 } from './_slug__5d12aca9.mjs';

const $$Index$4 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Ironfeast \xB7 Building Digital Empires" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="hero"> <section class="hero-left"> <h1>Building Digital Empires</h1> <p class="sub">Gaming & Community</p> <a class="cta" href="/gaming/">Explore Gaming</a> </section> <section class="hero-right"> <h1>Securing Digital Infrastructure</h1> <p class="sub">Open Source & Research</p> <a class="cta" href="/labs/">Explore Labs</a> </section> </div> <section class="brand"> <p>A digital production and engineering entity focused on systemic mastery—whether in high-fidelity simulation gaming or Kubernetes supply chain security.</p> </section> ` })}`;
}, "E:/code/ironfeast/website-media/src/pages/index.astro", void 0);

const $$file$4 = "E:/code/ironfeast/website-media/src/pages/index.astro";
const $$url$4 = "";

const index$4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index$4,
  file: $$file$4,
  url: $$url$4
}, Symbol.toStringTag, { value: 'Module' }));

const $$Index$3 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Gaming \xB7 Ironfeast" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h2>Ironfeast Entertainment</h2> <p class="section">Recent highlights: Anno 117, Vintage Story, Stoneblock 4.</p> <section class="section"> <h3>Library of Strategy</h3> <p>Searchable archive placeholder for Geologic Reviews and Military Tech Strategies.</p> </section> <section class="section"> <h3>Survival Logs</h3> <p>Chronological series for Vintage Story (e.g., "Day 3: First Meal").</p> </section> <section class="section"> <h3>Community</h3> <ul> <li>Discord: <a href="#">Join</a></li> <li>Live Schedule: Twitch/Kick schedule placeholder</li> <li>About Ironfeast (Gamer): Legacy in Tarkov and community background.</li> </ul> </section> ` })}`;
}, "E:/code/ironfeast/website-media/src/pages/gaming/index.astro", void 0);

const $$file$3 = "E:/code/ironfeast/website-media/src/pages/gaming/index.astro";
const $$url$3 = "/gaming";

const index$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index$3,
  file: $$file$3,
  url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

const $$Index$2 = createComponent(($$result, $$props, $$slots) => {
  const modules = Object.entries(/* #__PURE__ */ Object.assign({"../../content/blog/2025-12-27-bridging-nix-kbld.md": __vite_glob_0_0,"../../content/blog/2025-12-27-why-slsa-level-4.md": __vite_glob_0_1}));
  modules.map(([path, mod]) => {
    const slug = path.split("/").pop().replace(".md", "");
    return { slug, ...mod.frontmatter ?? {}, Content: mod.default };
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Blog \xB7 Ironfeast" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h2>Technical Journal</h2> <p>Redirecting to paginated view — <a href="/blog/page/1/">open page 1</a>.</p> <meta http-equiv="refresh" content="0; url=/blog/page/1/"> ` })}
---
import BaseLayout from '../../layouts/BaseLayout.astro'
---
${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Blog \xB7 Ironfeast" }, { "default": ($$result2) => renderTemplate` <h2>Technical Journal</h2> <section class="section"> <h3>Infrastructure & Security</h3> <ul> <li><a href="#">Why SLSA Level 4 Matters for Kubernetes</a></li> <li><a href="#">Bridging the Gap: How we plan to integrate Nix into kbld</a></li> </ul> </section> <section class="section"> <h3>Creative Engineering</h3> <ul> <li><a href="#">Automation in Stoneblock 4: Applying Engineering Logic to Modded Minecraft</a></li> <li><a href="#">The Tech Stack of Streaming: Automating OBS and DaVinci Resolve Workflows</a></li> </ul> </section> ` })}`;
}, "E:/code/ironfeast/website-media/src/pages/blog/index.astro", void 0);

const $$file$2 = "E:/code/ironfeast/website-media/src/pages/blog/index.astro";
const $$url$2 = "/blog";

const index$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index$2,
  file: $$file$2,
  url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro = createAstro("https://ironfeast.tv");
const $$Index$1 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index$1;
  const tag = Astro2.params.tag;
  const modules = Object.entries(/* #__PURE__ */ Object.assign({}));
  const posts = modules.map(([path, mod]) => {
    const slug = path.split("/").pop().replace(".md", "");
    return { slug, ...mod.frontmatter ?? {}, Content: mod.default };
  }).filter((p) => Array.isArray(p.tags) ? p.tags.includes(tag) : false).sort((a, b) => new Date(b.date) - new Date(a.date));
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `Posts tagged ${tag}` }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h2>Posts tagged «${tag}»</h2> ${posts.length === 0 ? renderTemplate`<p>No posts found for this tag.</p>` : renderTemplate`<ul> ${posts.map((p) => renderTemplate`<li><a${addAttribute(`/blog/${p.slug}/`, "href")}>${p.title}</a> — <small>${p.date}</small></li>`)} </ul>`}` })}`;
}, "E:/code/ironfeast/website-media/src/pages/blog/tag/[tag]/index.astro", void 0);

const $$file$1 = "E:/code/ironfeast/website-media/src/pages/blog/tag/[tag]/index.astro";
const $$url$1 = "/blog/tag/[tag]";

const index$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index$1,
  file: $$file$1,
  url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Labs \xB7 Ironfeast" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h2>Ironfeast Labs</h2> <section class="section"> <h3>Research — Carvel-Nixify</h3> <p>Project: Carvel-Nixify — End-to-End Verifiable Kubernetes Deployments.</p> <p>The problem: last-mile incompatibility between Nix reproducible builds and OCI/Kubernetes standards.</p> <p>The solution: modular workflow using kbld, imgpkg, and kapp to enforce cryptographic integrity.</p> </section> <section class="section"> <h3>Technology Objectives</h3> <ol> <li>Integrate Nix as a Trusted Builder.</li> <li>Signatures & Attestations (Sigstore/Cosign integration).</li> <li>Deployment Verification Wrapper.</li> </ol> </section> <section class="section"> <h3>Team</h3> <p>PI: João Pereira — Core Contributor/Engineer on the Carvel project team.</p> </section> ` })}`;
}, "E:/code/ironfeast/website-media/src/pages/labs/index.astro", void 0);

const $$file = "E:/code/ironfeast/website-media/src/pages/labs/index.astro";
const $$url = "/labs";

const index = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { index$3 as a, index$2 as b, index$1 as c, index as d, index$4 as i };
