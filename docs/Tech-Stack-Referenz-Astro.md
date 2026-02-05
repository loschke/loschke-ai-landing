---
tags:
  - tech
  - astro
  - reference
  - claude-code
status: living
created: '2026-02-04'
---
# Tech-Stack Referenz: Astro + Keystatic (Lean)

> Technische Referenz für Claude Code zum Aufsetzen von loschke.ai und unlearn.how.
> Stack: Astro 5, Tailwind CSS, Keystatic, Vercel, GitHub
> Prinzip: So wenig wie möglich, so viel wie nötig.

---

## 1. Stack-Übersicht

| Komponente | Zweck |
|------------|-------|
| Astro 5 | Framework (Static Site) |
| Tailwind CSS | Styling |
| Keystatic | Git-basiertes CMS |
| React | Nur für Keystatic Admin UI |
| Markdoc | Content-Format |
| Vercel | Hosting |
| GitHub | Repo + Keystatic Storage |

**Bewusst weggelassen:**
- Shadcn/UI (Overkill für Content Sites)
- Komplexe State Management
- Client-side Routing

---

## 2. Projekt-Initialisierung

```bash
# Astro mit Tailwind
pnpm create astro@latest site-name --template with-tailwindcss --install --git
cd site-name

# React + Markdoc für Keystatic
pnpm astro add react markdoc

# Keystatic
pnpm add @keystatic/core @keystatic/astro

# SEO
pnpm astro add sitemap
```

---

## 3. Verzeichnisstruktur

```
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/images/
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── Card.astro
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   └── SEO.astro
│   ├── content/posts/
│   ├── layouts/
│   │   ├── Base.astro
│   │   └── Article.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── blog/
│   │   └── keystatic/[...params].astro
│   └── styles/globals.css
├── astro.config.mjs
├── keystatic.config.ts
└── tsconfig.json
```

---

## 4. Konfiguration

### 4.1 astro.config.mjs

```javascript
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import keystatic from "@keystatic/astro";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
  site: "https://loschke.ai",
  output: isDev ? "hybrid" : "static",
  
  integrations: [
    react(),           // Nur für Keystatic Admin
    markdoc(),
    tailwind(),
    sitemap(),
    ...(isDev ? [keystatic()] : []),
  ],
  
  trailingSlash: "never",
});
```

### 4.2 tsconfig.json

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@layouts/*": ["./src/layouts/*"]
    }
  }
}
```

### 4.3 keystatic.config.ts

```typescript
import { config, collection, fields } from "@keystatic/core";

export default config({
  storage: import.meta.env.PROD
    ? { kind: "github", repo: { owner: "loschke", name: "loschke-ai" } }
    : { kind: "local" },

  collections: {
    posts: collection({
      label: "Blog Posts",
      slugField: "title",
      path: "src/content/posts/*",
      format: { contentField: "content" },
      entryLayout: "content",
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        description: fields.text({ label: "Description", multiline: true }),
        pubDate: fields.date({ label: "Publication Date" }),
        heroImage: fields.image({
          label: "Hero Image",
          directory: "src/assets/images/posts",
          publicPath: "@assets/images/posts/",
        }),
        draft: fields.checkbox({ label: "Draft", defaultValue: false }),
        content: fields.markdoc({ label: "Content" }),
      },
    }),
  },
});
```

### 4.4 src/content.config.ts

```typescript
import { defineCollection } from "astro:content";
import { z } from "astro:zod";

const posts = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      heroImage: image().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { posts };
```

---

## 5. Basis-Komponenten

### 5.1 src/layouts/Base.astro

```astro
---
import "@/styles/globals.css";
import SEO from "@components/SEO.astro";
import Nav from "@components/Nav.astro";
import Footer from "@components/Footer.astro";

interface Props {
  title: string;
  description: string;
  image?: string;
}

const { title, description, image } = Astro.props;
---

<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <SEO title={title} description={description} image={image} />
  </head>
  <body class="min-h-screen flex flex-col">
    <Nav />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

### 5.2 src/components/SEO.astro

```astro
---
interface Props {
  title: string;
  description: string;
  image?: string;
  article?: boolean;
}

const { title, description, image = "/og-default.jpg", article = false } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const ogImage = new URL(image, Astro.site);
const siteName = "Rico Loschke";
---

<title>{title} | {siteName}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalURL} />

<meta property="og:type" content={article ? "article" : "website"} />
<meta property="og:url" content={canonicalURL} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImage} />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />
```

### 5.3 src/components/Nav.astro

```astro
---
const links = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "Über mich" },
];
---

<nav class="border-b">
  <div class="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
    <a href="/" class="font-bold text-xl">Rico Loschke</a>
    <ul class="flex gap-6">
      {links.map(({ href, label }) => (
        <li>
          <a href={href} class="hover:underline">{label}</a>
        </li>
      ))}
    </ul>
  </div>
</nav>
```

### 5.4 src/components/Footer.astro

```astro
---
const year = new Date().getFullYear();
---

<footer class="border-t mt-auto">
  <div class="max-w-4xl mx-auto px-4 py-8 text-center text-sm text-gray-600">
    <p>© {year} Rico Loschke</p>
    <p class="mt-2">
      <a href="/impressum" class="hover:underline">Impressum</a>
      {" · "}
      <a href="/datenschutz" class="hover:underline">Datenschutz</a>
    </p>
  </div>
</footer>
```

### 5.5 src/components/Card.astro

```astro
---
interface Props {
  title: string;
  description: string;
  href: string;
  date?: Date;
  image?: ImageMetadata;
}

const { title, description, href, date, image } = Astro.props;
import { Image } from "astro:assets";
---

<article class="group">
  <a href={href} class="block">
    {image && (
      <Image
        src={image}
        alt={title}
        class="w-full aspect-video object-cover rounded-lg mb-4"
        widths={[400, 800]}
        sizes="(max-width: 800px) 100vw, 800px"
      />
    )}
    <h2 class="text-xl font-semibold group-hover:underline">{title}</h2>
    {date && (
      <time class="text-sm text-gray-500">
        {date.toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}
      </time>
    )}
    <p class="mt-2 text-gray-600 line-clamp-2">{description}</p>
  </a>
</article>
```

---

## 6. Seiten

### 6.1 src/pages/index.astro

```astro
---
import Base from "@layouts/Base.astro";
import Card from "@components/Card.astro";
import { getCollection } from "astro:content";

const posts = (await getCollection("posts"))
  .filter((post) => !post.data.draft)
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
  .slice(0, 3);
---

<Base title="Home" description="AI Transformation Consultant">
  <section class="max-w-4xl mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold mb-4">Rico Loschke</h1>
    <p class="text-xl text-gray-600 mb-12">
      AI Transformation Consultant – Ich helfe Menschen und Organisationen, 
      mit KI wirksam zu werden.
    </p>
    
    <h2 class="text-2xl font-semibold mb-6">Aktuelle Artikel</h2>
    <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Card
          title={post.data.title}
          description={post.data.description}
          href={`/blog/${post.slug}`}
          date={post.data.pubDate}
          image={post.data.heroImage}
        />
      ))}
    </div>
  </section>
</Base>
```

### 6.2 src/pages/blog/[...slug].astro

```astro
---
import { getCollection } from "astro:content";
import Base from "@layouts/Base.astro";
import { Image } from "astro:assets";

export async function getStaticPaths() {
  const posts = await getCollection("posts");
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: post,
  }));
}

const post = Astro.props;
const { Content } = await post.render();
---

<Base title={post.data.title} description={post.data.description} article>
  <article class="max-w-3xl mx-auto px-4 py-16">
    {post.data.heroImage && (
      <Image
        src={post.data.heroImage}
        alt={post.data.title}
        class="w-full aspect-video object-cover rounded-lg mb-8"
        widths={[800, 1200]}
      />
    )}
    
    <h1 class="text-4xl font-bold mb-4">{post.data.title}</h1>
    
    <time class="text-gray-500">
      {post.data.pubDate.toLocaleDateString("de-DE", { 
        day: "numeric", month: "long", year: "numeric" 
      })}
    </time>
    
    <div class="prose prose-lg mt-8 max-w-none">
      <Content />
    </div>
  </article>
</Base>
```

---

## 7. Keystatic Admin Setup

### 7.1 src/pages/keystatic/[...params].astro

```astro
---
import { Keystatic } from "../../../keystatic.page";
---
<Keystatic client:only="react" />
```

### 7.2 keystatic.page.tsx (Projekt-Root)

```tsx
import { makePage } from "@keystatic/astro/ui";
import keystaticConfig from "./keystatic.config";
export const Keystatic = makePage(keystaticConfig);
```

---

## 8. Deployment

### Vercel Environment Variables

```env
PUBLIC_GITHUB_OWNER=loschke
PUBLIC_GITHUB_REPO=loschke-ai
```

### Build

```bash
pnpm build    # Production Build (statisch)
pnpm preview  # Lokal testen
```

---

## 9. Checkliste

- [ ] Astro Projekt mit Tailwind erstellen
- [ ] React + Markdoc + Keystatic hinzufügen
- [ ] Sitemap Integration
- [ ] tsconfig Paths konfigurieren
- [ ] keystatic.config.ts erstellen
- [ ] content.config.ts erstellen
- [ ] Base Layout + SEO Komponente
- [ ] Nav + Footer
- [ ] Card Komponente
- [ ] Blog Index + Post Pages
- [ ] Keystatic Admin Route
- [ ] GitHub Repo erstellen
- [ ] Vercel verbinden + Env Vars
- [ ] Erster Deploy

---

*Erstellt: 2026-02-04*
*Für: loschke.ai, unlearn.how*
