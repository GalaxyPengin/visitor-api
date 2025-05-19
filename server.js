import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'

const app = express()
app.use(cors())
app.set('trust proxy', true)

const DATA = path.resolve('visitors.json')

let store = { ips: [], count: 0 }
if (fs.existsSync(DATA)) {
  store = JSON.parse(fs.readFileSync(DATA, 'utf-8'))
}

app.get('/api/visitors', (req, res) => {
  const ip = req.ip
  if (!store.ips.includes(ip)) {
    store.ips.push(ip)
    store.count++
    fs.writeFileSync(DATA, JSON.stringify(store), 'utf-8')
  }
  res.json({ count: store.count })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on ${port}`))
