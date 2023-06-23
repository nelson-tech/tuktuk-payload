// import { payloadCloud } from '@payloadcms/plugin-cloud'
import nestedDocs from '@payloadcms/plugin-nested-docs'
import stripePlugin from '@payloadcms/plugin-stripe'
import { cloudStorage } from '@payloadcms/plugin-cloud-storage'
import path from 'path'
import { buildConfig } from 'payload/config'

import Categories from './collections/Categories'
import { Media } from './collections/Media'
import Orders from './collections/Orders'
import { Pages } from './collections/Pages'
import Products from './collections/Products'
import Users from './collections/Users'
import Logo from './components/Logo'
import BeforeDashboard from './components/BeforeDashboard'
import Menus from './globals/Menus'
import { Settings } from './globals/Settings'
import { checkout } from './routes/checkout'
import { invoiceCreatedOrUpdated } from './stripe/webhooks/invoiceCreatedOrUpdated'
import { priceUpdated } from './stripe/webhooks/priceUpdated'
import { productUpdated } from './stripe/webhooks/productUpdated'
import adapter from './s3/adapter'
import { Carts } from './collections/Carts'
import customGraphQLOperations from './graphql'
import AfterDashboard from './components/AfterDashboard'

const mockModulePath = path.resolve(__dirname, './emptyModuleMock.js')

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      // The BeforeDashboard component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import BeforeDashboard statement on line 15.
      beforeDashboard: [BeforeDashboard],
      afterDashboard: [AfterDashboard],
      graphics: {
        Logo,
        Icon: Logo,
      },
    },
    css: path.resolve(__dirname, 'styles.scss'),
    meta: {
      titleSuffix: ` - Ronatec`,
    },
    webpack: config => ({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          [path.resolve(__dirname, 'collections/Products/hooks/beforeChange')]: mockModulePath,
          [path.resolve(__dirname, 'collections/Users/hooks/createStripeCustomer')]: mockModulePath,
          [path.resolve(__dirname, 'routes/checkout')]: mockModulePath,
          stripe: mockModulePath,
          express: mockModulePath,
        },
      },
    }),
  },
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  cookiePrefix: 'ronatec',
  collections: [Pages, Media, Products, Categories, Users, Carts, Orders],
  globals: [Menus, Settings],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
    ...customGraphQLOperations,
  },
  cors: ['https://checkout.stripe.com', process.env.PAYLOAD_PUBLIC_SITE_URL].filter(Boolean),
  csrf: ['https://checkout.stripe.com', process.env.PAYLOAD_PUBLIC_SITE_URL].filter(Boolean),
  endpoints: [
    {
      path: '/checkout',
      method: 'post',
      handler: checkout,
    },
  ],
  plugins: [
    stripePlugin({
      stripeSecretKey: process.env.STRIPE_SECRET_KEY,
      isTestKey: Boolean(process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY),
      stripeWebhooksEndpointSecret: process.env.STRIPE_WEBHOOKS_ENDPOINT_SECRET,
      webhooks: {
        'invoice.created': invoiceCreatedOrUpdated,
        'invoice.updated': invoiceCreatedOrUpdated,
        'product.created': productUpdated,
        'product.updated': productUpdated,
        'price.updated': priceUpdated,
      },
    }),
    nestedDocs({
      collections: ['categories'],
    }),
    cloudStorage({
      collections: {
        media: {
          adapter,
        },
      },
    }),
  ],
})
