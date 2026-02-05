# Loschke Stack Boilerplate

A modern, minimalist starter template based on Astro, Tailwind v4, Keystatic, Resend, and Umami.
Optimized for developer experience, performance, and GDPR compliance.

## 🚀 Features

*   **Astro v5** - Fast static site generation.
*   **Tailwind CSS v4** - Styling via `@tailwindcss/vite`.
*   **Keystatic** - Git-based CMS for managing content.
*   **Umami Analytics** - Privacy-friendly analytics (no cookie banner required).
*   **Resend** - Email sending for contact forms.
*   **React** - For interactive components (Contact Form, Keystatic).
*   **SEO Optimized** - Meta tags, OG images, Sitemap.

## 🛠 Setup

1.  **Clone & Install**
    ```bash
    git clone <repo-url> my-new-project
    cd my-new-project
    pnpm install
    ```

2.  **Environment Variables**
    Copy `.env.example` to `.env` and fill in your keys:
    ```bash
    cp .env.example .env
    ```
    *   `RESEND_API_KEY`: Get from [Resend](https://resend.com).
    *   `PUBLIC_UMAMI_SCRIPT_URL`: Your self-hosted or cloud Umami script URL.
    *   `PUBLIC_UMAMI_WEBSITE_ID`: Your Website ID.

3.  **Run Development Server**
    ```bash
    pnpm dev
    ```
    Open http://localhost:4321.

## ⚙️ Configuration

*   **Site Info:** Edit `src/config.ts` to change the site name, description, and navigation.
*   **Content:** Manage posts via Keystatic at `/keystatic` (local mode by default).
*   **Styles:** Edit `src/styles/global.css` or `astro.config.mjs` (Tailwind plugin) for design tokens.

## 📄 Pages included

*   `src/pages/index.astro` - Landing page.
*   `src/pages/blog/...` - Blog with overview and post layout.
*   `src/pages/contact.astro` - Contact form with Resend integration.
*   `src/pages/datenschutz.astro` - GDPR Privacy Policy (generic template).
*   `src/pages/impressum.astro` - Imprint (generic template).
*   `src/pages/404.astro` - Custom error page.

## 📝 License

MIT
