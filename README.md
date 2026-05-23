# Lance Abuan — Portfolio

Personal portfolio and blog built with **Next.js 16**, **shadcn/ui**, **Tailwind CSS 4**, and **Framer Motion**.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Animations:** Framer Motion
- **Blog:** MDX with `next-mdx-remote` + `gray-matter`
- **Icons:** Lucide React
- **Themes:** next-themes (system dark/light)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main portfolio page
│   ├── layout.tsx         # Root layout + providers
│   ├── globals.css        # Tailwind + theme vars
│   ├── not-found.tsx      # 404 page
│   └── blogs/
│       ├── page.tsx       # Blog index
│       └── [slug]/page.tsx # Dynamic blog post
├── components/
│   ├── sections/          # Portfolio sections (Hero, About, etc.)
│   ├── ui/                # shadcn/ui components
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── background.tsx     # Animated particle canvas
│   └── providers.tsx      # Theme + tooltip providers
├── lib/
│   ├── blog.ts            # MDX blog utilities
│   └── utils.ts
└── mdx-components.tsx     # Custom MDX component mapping
```

## Blog

Blog posts live in the `blogs/` directory as `.mdx` files with frontmatter:

```mdx
---
title: "Post Title"
date: "2026-05-22"
excerpt: "A short excerpt"
tags: ["tag1", "tag2"]
---

Content here...
```

## Deploy

Deploy on Vercel with zero configuration, or run `npm run build && npm start` for production.
