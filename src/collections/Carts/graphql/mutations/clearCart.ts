import getCart from '../utils/getCart'
import { CustomGraphQLMutationType } from '../../../../graphql/types'

export type ResolverArgs = {}

const clearCart: CustomGraphQLMutationType<ResolverArgs, 'carts'> = (GraphQL, payload) => {
  return {
    clearCart: {
      args: {},
      resolve: async (obj, args, context, info) => {
        const cart = await getCart(context)

        const updatedCart = await payload.update({
          collection: 'carts',
          id: cart.id,
          data: { items: [], reset: false },
          depth: 0,
        })

        return updatedCart
      },
      type: payload.collections['carts'].graphQL?.type,
    },
  }
}

export default clearCart
