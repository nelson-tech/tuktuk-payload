import { CollectionBeforeChangeHook } from 'payload/types'
import { Cart } from '../../../../payload-types'

const updateTotal: CollectionBeforeChangeHook<Cart> = async ({ data, req: { payload } }) => {
  let total = 0

  const productIDs = data.items.map(item => item.product as string)
  const products = await payload.find({ collection: 'products', where: { id: { in: productIDs } } })
  data?.items &&
    data?.items.length > 0 &&
    data.items.forEach(item => {
      const product = products.docs.find(element => element.id === item.product)

      total += item.quantity * product.price
    })

  const updatedCart = { ...data, total }

  return updatedCart
}

export default updateTotal
