import { CollectionConfig } from 'payload/dist/collections/config/types'
import { PayloadRequest } from 'payload/types'

import { User } from 'payload/generated-types'

import adminsAndUser from './access/adminsAndUser'
import beforeChange from './hooks/beforeChange'
import afterChange from './hooks/afterChange'
import afterDelete from './hooks/afterDelete'
import afterRead from './hooks/afterRead'

export const Carts: CollectionConfig = {
  slug: 'carts',
  fields: [
    {
      name: 'items',
      label: 'Items',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
        },
        {
          name: 'quantity',
          type: 'number',
          min: 1,
          admin: {
            step: 1,
          },
        },
      ],
    },
    {
      name: 'count',
      label: 'Items in cart',
      type: 'number',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      hasMany: false,
      admin: { hidden: false, position: 'sidebar' },
    },
    {
      name: 'lastEdit',
      type: 'number',
      hidden: true,
    },
    { name: 'total', type: 'number', admin: { readOnly: true, position: 'sidebar' } },
    { name: 'reset', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
  access: {
    read: adminsAndUser,
    create: adminsAndUser,
    update: adminsAndUser,
    delete: adminsAndUser,
  },
  hooks: { afterRead, beforeChange, afterChange, afterDelete },
  admin: { hidden: false },
  endpoints: [
    {
      path: '/:id/reset',
      method: 'get',
      handler: async (req: PayloadRequest<User>, res, next) => {
        const cartID = req.params.id
        if (cartID) {
          const cart = await req.payload.findByID({ collection: 'carts', id: cartID as string })

          if (cart?.reset) {
            res.status(200).setHeader('content', 'application/json').send({ reset: true })
          } else {
            res.status(200).setHeader('content', 'application/json').send({ reset: false })
          }
        }
      },
    },
  ],
}
