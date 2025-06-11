import '@{{ name }}/env'

import cors from 'cors'
import express from 'express'

const server = express()
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
)

server.get('/api', (_, res) => {
  res.json({ message: 'Hello from Express!' })
})

server.listen(8080, () => {
  console.log('Server is running on http://localhost:8080')
})
