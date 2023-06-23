import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'
import { anyone } from '../../access/anyone'
import { slugField } from '../../fields/slug'
import { beforeProductChange } from './hooks/beforeChange'
import { deleteProductFromCarts } from './hooks/deleteProductFromCarts'

export const ProductFields: CollectionConfig['fields'] = [
  {
    name: 'title',
    type: 'text',
    required: true,
  },
  {
    name: 'image',
    type: 'upload',
    relationTo: 'media',
  },
  {
    name: 'description',
    type: 'textarea',
  },
  slugField(),
  { name: 'sku', type: 'text', unique: true, admin: { position: 'sidebar' } },
  { name: 'stock', type: 'number', min: 0, defaultValue: 1, admin: { position: 'sidebar' } },
  { name: 'price', type: 'number', defaultValue: '2', admin: { position: 'sidebar' } },
  {
    name: 'categories',
    type: 'relationship',
    relationTo: 'categories',
    hasMany: true,
    admin: {
      position: 'sidebar',
    },
  },
]

const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'stripeProductID', '_status'],
  },
  hooks: {
    beforeChange: [beforeProductChange],
    afterRead: [],
    afterDelete: [deleteProductFromCarts],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: anyone,
    create: admins,
    update: admins,
    delete: admins,
  },
  fields: ProductFields,
}

export default Products
