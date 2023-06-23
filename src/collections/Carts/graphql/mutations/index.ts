import { GraphQLExtension } from 'payload/config'
import addCartItems from './addCartItems'
import removeCartItem from './removeCartItem'
import updateCartItem from './updateCartItem'
import clearCart from './clearCart'

const cartGraphQLMutations: GraphQLExtension = (GraphQL, payload) => {
  return {
    ...removeCartItem(GraphQL, payload),
    ...addCartItems(GraphQL, payload),
    ...updateCartItem(GraphQL, payload),
    ...clearCart(GraphQL, payload),
  }
}

export default cartGraphQLMutations
