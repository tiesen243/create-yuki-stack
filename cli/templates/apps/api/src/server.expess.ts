import '@{{ name }}/validators/env'

import cors from 'cors'
import express from 'express'

const PORT = process.env.PORT ?? 8080

const server = express()
  .use(
    cors({
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
      ],
      credentials: true,
    }),
  )
  .get('/api/health', (_, res) => {
    res.json({
      message: 'OK',
    })
  })

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
