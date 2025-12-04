# Backend: Node + Express + LowDB (JSON file storage)

/*
Project structure (single-file representation for the canvas):

/backend
  |-- package.json
  |-- tsconfig.json
  |-- src
      |-- index.ts
      |-- db.ts
      |-- routes
          |-- posts.ts
  |-- README.md
  |-- .gitignore
*/

// package.json
{
  "name": "crud-backend",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "lowdb": "^3.0.0",
    "nanoid": "^4.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.1.6"
  }
}

// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2019",
    "module": "commonjs",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}

// src/db.ts
import { LowSync, JSONFileSync } from 'lowdb'
import { join } from 'path'

type Post = {
  id: string
  title: string
  body: string
}

type Schema = {
  posts: Post[]
}

const file = join(process.cwd(), 'db.json')
const adapter = new JSONFileSync<Schema>(file)
const db = new LowSync(adapter)

db.read()
if (!db.data) {
  db.data = { posts: [] }
  db.write()
}

export { db, type Post }

// src/routes/posts.ts
import { Router } from 'express'
import { db, type Post } from '../db'
import { nanoid } from 'nanoid'

const router = Router()

// GET /posts
router.get('/', (req, res) => {
  db.read()
  res.json(db.data!.posts)
})

// GET /posts/:id
router.get('/:id', (req, res) => {
  const id = req.params.id
  db.read()
  const post = db.data!.posts.find(p => p.id === id)
  if (!post) return res.status(404).json({ message: 'Not found' })
  res.json(post)
})

// POST /posts
router.post('/', (req, res) => {
  const { title, body } = req.body
  if (!title) return res.status(400).json({ message: 'title is required' })
  const newPost: Post = { id: nanoid(), title, body: body || '' }
  db.read()
  db.data!.posts.push(newPost)
  db.write()
  res.status(201).json(newPost)
})

// PUT /posts/:id
router.put('/:id', (req, res) => {
  const id = req.params.id
  const { title, body } = req.body
  db.read()
  const idx = db.data!.posts.findIndex(p => p.id === id)
  if (idx === -1) return res.status(404).json({ message: 'Not found' })
  const updated = { ...db.data!.posts[idx], title: title ?? db.data!.posts[idx].title, body: body ?? db.data!.posts[idx].body }
  db.data!.posts[idx] = updated
  db.write()
  res.json(updated)
})

// DELETE /posts/:id
router.delete('/:id', (req, res) => {
  const id = req.params.id
  db.read()
  const idx = db.data!.posts.findIndex(p => p.id === id)
  if (idx === -1) return res.status(404).json({ message: 'Not found' })
  const removed = db.data!.posts.splice(idx, 1)[0]
  db.write()
  res.json(removed)
})

export default router

// src/index.ts
import express from 'express'
import cors from 'cors'
import postsRouter from './routes/posts'
import { join } from 'path'

const app = express()
const PORT = process.env.PORT || 3333

app.use(cors())
app.use(express.json())

app.use('/posts', postsRouter)

app.get('/', (req, res) => res.json({ message: 'API up' }))

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

// .gitignore
node_modules
dist
db.json
.env

// README.md
# CRUD Backend (Node + Express + LowDB)

Este backend implementa um CRUD simples para a entidade `Post` usando **Express** e **lowdb** (armazenamento em arquivo JSON). Ideal para testes locais rápidos e integração com app mobile.

## Endpoints
- GET /posts -> lista todos
- GET /posts/:id -> pega por id
- POST /posts -> cria { title, body }
- PUT /posts/:id -> atualiza { title?, body? }
- DELETE /posts/:id -> deleta

## Rodando localmente
1. `npm install`
2. `npm run dev` (usa ts-node-dev)

O arquivo `db.json` será criado automaticamente.

*/
