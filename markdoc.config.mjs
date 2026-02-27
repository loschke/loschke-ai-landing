import { defineMarkdocConfig, component, nodes } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
  tags: {
    cta: {
      render: component('./src/components/content/CTA.astro'),
      attributes: {
        title: { type: String, required: true },
        link: { type: String, required: true },
        linkText: { type: String, default: 'Mehr erfahren →' },
        brand: {
          type: String,
          default: 'loschke',
          matches: ['loschke', 'unlearn', 'lernen'],
        },
      },
    },
    infobox: {
      render: component('./src/components/content/Infobox.astro'),
      attributes: {
        type: {
          type: String,
          default: 'info',
          matches: ['info', 'tip', 'warning'],
        },
        title: { type: String },
      },
    },
    divider: {
      render: component('./src/components/content/Divider.astro'),
      selfClosing: true,
      attributes: {},
    },
  },
});
