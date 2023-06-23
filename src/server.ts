import express from 'express'
import payload from 'payload'
import path from 'path'

// eslint-disable-next-line
require('dotenv').config()

const PORT = process.env.PORT || 3000

const app = express()

app.use('/assets', express.static(path.resolve(__dirname, './assets')))

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin')
})

const start = async (): Promise<void> => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    mongoURL: process.env.MONGODB_URI,
    express: app,
    onInit: () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  app.listen(PORT)
}

start()
