import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    posts: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        excerpt: fields.text({
          label: 'Excerpt (Anlesetext)',
          description: 'Wird in der Blog-Übersicht und auf der Detailseite unter dem Titel angezeigt.',
          multiline: true,
        }),
        summary: fields.text({
          label: 'Summary / Kurzfassung (GEO)',
          description: 'TL;DR für AI Overviews. Markdown: **fett**, *kursiv*, [Link](url), - Liste',
          multiline: true,
        }),
        metaTitle: fields.text({
          label: 'SEO: Meta Title',
          description: 'Überschreibt den Titel für <title> und Social Sharing. Leer = Fallback auf Title.',
        }),
        metaDescription: fields.text({
          label: 'SEO: Meta Description',
          description: 'Überschreibt die Description für <meta> und Social Sharing. Leer = Fallback auf Excerpt.',
          multiline: true,
        }),
        pubDate: fields.date({ label: 'Publication Date' }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Visionen', value: 'vision' },
            { label: 'Takes', value: 'takes' },
            { label: 'Experimente', value: 'experiments' },
            { label: 'Building', value: 'building' },
            { label: 'Persönlich', value: 'personal' },
          ],
          defaultValue: 'takes',
        }),
        featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
        heroImage: fields.image({
          label: 'Hero Image',
          directory: 'src/assets/images/posts',
          publicPath: '@assets/images/posts/',
        }),
        tags: fields.array(
            fields.text({ label: 'Tag' }),
            {
                label: 'Tags',
                itemLabel: props => props.value
            }
        ),
        readTime: fields.text({ label: 'Read Time (e.g. "6 min")' }),
        ogImage: fields.text({
          label: 'OG Image Path',
          description: 'Überschreibt das Standard-OG-Bild. Pfad relativ zu /public/images/og/ (z.B. /images/og/mein-post.png)',
        }),
        audioSrc: fields.text({
          label: 'Audio Summary Path',
          description: 'Pfad zur Audio-Datei in /public/audio/ (z.B. /audio/ki-governance.mp3)',
        }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        content: fields.markdoc({
          label: 'Content',
        }),
      },
    }),
  },
});
