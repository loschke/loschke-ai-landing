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
        description: fields.text({ label: 'Description', multiline: true }),
        pubDate: fields.date({ label: 'Publication Date' }),
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
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        content: fields.markdoc({
          label: 'Content',
        }),
      },
    }),
  },
});
