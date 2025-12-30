Content system (Markdown posts)

Location: `src/content/blog/`

Add a markdown file with frontmatter at the top. Example frontmatter:

---
title: "Post Title"
date: "2025-12-27"
category: "Infrastructure & Security"
summary: "Short summary for listing"
---

Write content in markdown below the frontmatter. The site uses `import.meta.glob` to collect posts and automatically lists them on `/blog/`.

To add a post:

1. Create `src/content/blog/YYYY-MM-DD-slug.md` with frontmatter.
2. Run `npm run dev` or `npm run build`.
3. Visit `/blog/` to see the post listed and `/blog/slug/` to view the post.
