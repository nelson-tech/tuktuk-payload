import type { CollectionConfig } from 'payload/types'

const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    { name: 'slug', type: 'text', unique: true, required: true, admin: { position: 'sidebar' } },
  ],
}

export default Categories
