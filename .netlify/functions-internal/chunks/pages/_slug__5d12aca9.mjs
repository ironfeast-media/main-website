import { f as createComponent, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML, e as createAstro, i as renderComponent } from '../astro_e215eea9.mjs';
import 'clsx';
import { $ as $$BaseLayout } from './_page__cb01cfd8.mjs';

const html$1 = "<p>The Carvel-Nixify project aims to create a reproducible, auditable pipeline that produces OCI artifacts from Nix builds, signs them, and makes them discoverable and verifiable by Carvel tooling such as <code>kbld</code> and <code>imgpkg</code>.</p>\n<p>Key pieces include: creating a trusted builder configuration, adding Sigstore/Cosign attestations, and wrapping deployments with a verification step.</p>";

				const frontmatter$1 = {"title":"Bridging the Gap: How we plan to integrate Nix into kbld","date":"2025-12-27","category":"Infrastructure & Security","tags":["nix","carvel","kbld"],"summary":"An outline of the Carvel-Nixify approach to make Nix-built artifacts consumable by `kbld` and `imgpkg`."};
				const file$1 = "E:/code/ironfeast/website-media/src/content/blog/2025-12-27-bridging-nix-kbld.md";
				const url$1 = undefined;
				function rawContent$1() {
					return "\r\nThe Carvel-Nixify project aims to create a reproducible, auditable pipeline that produces OCI artifacts from Nix builds, signs them, and makes them discoverable and verifiable by Carvel tooling such as `kbld` and `imgpkg`.\r\n\r\nKey pieces include: creating a trusted builder configuration, adding Sigstore/Cosign attestations, and wrapping deployments with a verification step.\r\n";
				}
				function compiledContent$1() {
					return html$1;
				}
				function getHeadings$1() {
					return [];
				}

				const Content$1 = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter$1;
					content.file = file$1;
					content.url = url$1;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html$1)}`;
				});

const __vite_glob_0_0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	Content: Content$1,
	compiledContent: compiledContent$1,
	default: Content$1,
	file: file$1,
	frontmatter: frontmatter$1,
	getHeadings: getHeadings$1,
	rawContent: rawContent$1,
	url: url$1
}, Symbol.toStringTag, { value: 'Module' }));

const html = "<p>SLSA Level 4 represents a strong pedigree of supply chain security guarantees. For Kubernetes deployments, reaching this bar involves reproducible builds, authenticated provenance, and auditable deployment verification.</p>\n<p>This post will outline why these guarantees matter for projects that bridge reproducible builders (like Nix) and OCI/Carvel deployment patterns.</p>";

				const frontmatter = {"title":"Why SLSA Level 4 Matters for Kubernetes","date":"2025-12-27","category":"Infrastructure & Security","tags":["slsa","supply-chain","kubernetes"],"summary":"Contextualizing SLSA Level 4 for Kubernetes deployments and supply chain integrity."};
				const file = "E:/code/ironfeast/website-media/src/content/blog/2025-12-27-why-slsa-level-4.md";
				const url = undefined;
				function rawContent() {
					return "\r\nSLSA Level 4 represents a strong pedigree of supply chain security guarantees. For Kubernetes deployments, reaching this bar involves reproducible builds, authenticated provenance, and auditable deployment verification.\r\n\r\nThis post will outline why these guarantees matter for projects that bridge reproducible builders (like Nix) and OCI/Carvel deployment patterns.\r\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

const __vite_glob_0_1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	Content,
	compiledContent,
	default: Content,
	file,
	frontmatter,
	getHeadings,
	rawContent,
	url
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro = createAstro("https://ironfeast.tv");
const $$slug = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const modules = /* #__PURE__ */ Object.assign({"../../content/blog/2025-12-27-bridging-nix-kbld.md": __vite_glob_0_0,"../../content/blog/2025-12-27-why-slsa-level-4.md": __vite_glob_0_1});
  const slug = Astro2.params.slug;
  const match = Object.entries(modules).find(([path]) => path.endsWith(`/${slug}.md`));
  let post = null;
  if (match) {
    const mod = match[1];
    post = { ...mod.frontmatter ?? {}, Content: mod.default };
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": post ? post.title : "Post Not Found" }, { "default": ($$result2) => renderTemplate`${post ? renderTemplate`${maybeRenderHead()}<article> <h1>${post.title}</h1> <p class="sub">${post.date} — ${post.category}</p> ${renderComponent($$result2, "post.Content", post.Content, {})} </article>` : renderTemplate`<p>Post not found.</p>`}` })}`;
}, "E:/code/ironfeast/website-media/src/pages/blog/[slug].astro", void 0);

const $$file = "E:/code/ironfeast/website-media/src/pages/blog/[slug].astro";
const $$url = "/blog/[slug]";

const _slug_ = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$slug,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { __vite_glob_0_0 as _, __vite_glob_0_1 as a, _slug_ as b };
