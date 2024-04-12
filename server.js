import { fastify } from 'fastify'
// import { DatabaseMemory } from './database-memory.js'
import {DatabasePostgres} from './database-postgres.js'


const server = fastify()

const database = new DatabasePostgres()

// POST http://localhost:3333/videos -> Criar Video

// Para mandar os dados/videos diferentes usamos o Request Body

server.get('/videos', async (request, reply) => {
  const search = request.query.search

  const videos = await database.list(search)
  return videos
})

server.post('/videos', async (request, reply) => {

  const {title, description, duration} = request.body

  await database.create({
    // No js quando a chave tem o mesmo nome que o valor, não precisa colocar 2x. (short syntax)
    title,
    description,
    duration,
  })

  return reply.status(201).send()
})

server.put('/videos/:id', async (request, reply) => {
  const videoId = request.params.id
  const {title, description, duration} = request.body

  const video = await database.update(videoId, {
    title,
    description,
    duration,
  })

  return reply.status(204).send()
})

server.delete('/videos/:id', async (request, reply) => {
  const videoId = request.params.id

  await database.delete(videoId)

  reply.status(204).send()
})

// GET http://localhost:3333/videos -> VÊ Video

server.listen({
  host: '0.0.0.0',
  port: process.env.PORT ?? 3333,
}).then(console.log('Server online em http://localhost:'+ process.env.PORT ?? 3333))