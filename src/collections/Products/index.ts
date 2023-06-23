import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'
import { anyone } from '../../access/anyone'
import { Archive } from '../../blocks/Archive'
import { CallToAction } from '../../blocks/CallToAction'
import { Content } from '../../blocks/Content'
import { MediaBlock } from '../../blocks/Media'
import { slugField } from '../../fields/slug'
import { populateArchiveBlock } from '../../hooks/populateArchiveBlock'
import { populatePublishedDate } from '../../hooks/populatePublishedDate'
import { beforeProductChange } from './hooks/beforeChange'
import { deleteProductFromCarts } from './hooks/deleteProductFromCarts'
import { RowLabelArgs } from 'payload/dist/admin/components/forms/RowLabel/types'
import { meta } from '../../fields/meta'

export const ProductFields: CollectionConfig['fields'] = [
  {
    name: 'title',
    type: 'text',
    required: true,
  },
  {
    name: 'publishedDate',
    type: 'date',
    admin: {
      position: 'sidebar',
    },
  },
  {
    type: 'tabs',
    tabs: [
      {
        label: 'Description',
        fields: [
          {
            name: 'shortDescription',
            type: 'textarea',
            admin: { description: 'Shown on product card.' },
          },
          {
            name: 'layout',
            type: 'blocks',
            required: true,
            blocks: [CallToAction, Content, MediaBlock, Archive],
            admin: { description: 'Shown on product details page.' },
          },
        ],
      },
      {
        label: 'Images',
        description:
          'Used for gallery on product details page. \
          First image in gallery will be the featured image, then the images here will be added.',
        fields: [
          {
            name: 'gallery',
            label: 'Product Images',
            type: 'array',
            labels: {
              singular: 'Slide',
              plural: 'Slides',
            },
            fields: [{ name: 'image', type: 'upload', relationTo: 'media' }],
            admin: {
              components: {
                RowLabel: ({ data, index }: RowLabelArgs) => {
                  return data?.title || `Slide ${String(index).padStart(2, '0')}`
                },
              },
            },
          },
        ],
      },
      {
        label: 'Variations',
        description: 'Add variations such as Size, Color, etc.',
        fields: [
          {
            name: 'variations',
            type: 'array',
            fields: [
              { name: 'name', type: 'text' },
              slugField('name'),
              {
                type: 'array',
                name: 'options',
                fields: [
                  { name: 'label', type: 'text' },
                  { name: 'sku', type: 'text', unique: true },
                ],
              },
            ],
          },
          {
            name: 'hasVariation',
            type: 'checkbox',
            hidden: false,
            admin: { readOnly: true, hidden: true },
          },
        ],
      },
    ],
  },
  { name: 'sku', type: 'text', unique: true, admin: { position: 'sidebar' } },
  {
    name: 'categories',
    type: 'relationship',
    relationTo: 'categories',
    hasMany: true,
    admin: {
      position: 'sidebar',
    },
  },
  slugField(),
  {
    name: 'featuredImage',
    type: 'upload',
    relationTo: 'media',
    admin: {
      position: 'sidebar',
    },
  },
  meta({
    generateTitle: ({ doc }) => `${(doc as { title: { value: string } }).title.value} - Ronatec`,
    generateDescription: ({ doc }) =>
      (doc as { shortDescription: { value: string } }).shortDescription.value,
    generateImage: ({ doc }) => (doc as { featuredImage: { value: string } }).featuredImage?.value,
    generateURL: async ({ doc }) => {
      const baseURL = process.env.PAYLOAD_PUBLIC_SITE_URL

      const fields = (doc as { fields: { slug: { value: string } } }).fields

      return `${baseURL}/products/${fields.slug.value}`
    },
  }),
]

const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'stripeProductID', '_status'],
  },
  hooks: {
    beforeChange: [populatePublishedDate, beforeProductChange],
    afterRead: [populateArchiveBlock],
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
