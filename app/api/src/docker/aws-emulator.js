const express = require('express')
var cors = require('cors')
const axios = require('axios')
const app = express()
const port = 8080
app.use(express.json())
app.use(cors())

const invocationURL = (port) =>
  `http://localhost:${port}/2015-03-31/functions/function/invocations`

const makeRequest = (route, port) => [
  route,
  async (req, res) => {
    console.log(`making post request to ${port}, ${route}`)
    try {
      const { data } = await axios.post(invocationURL(port), {
        body: Buffer.from(JSON.stringify(req.body)).toString('base64'),
      })
      res.status(data.statusCode)
      res.setHeader('Content-Type', 'application/javascript')
      if (data.headers && data.headers['Content-Encoding'] === 'gzip') {
        res.setHeader('Content-Encoding', 'gzip')
        res.send(Buffer.from(data.body, 'base64'))
      } else {
        res.send(Buffer.from(data.body, 'base64'))
      }
    } catch (e) {
      res.status(500)
      res.send()
    }
  },
]

app.post(...makeRequest('/openscad/preview', 5052))
app.post(...makeRequest('/openscad/stl', 5053))

app.post(...makeRequest('/cadquery/stl', 5060))

app.post(...makeRequest('/curv/preview', 5070))
app.post(...makeRequest('/curv/stl', 5071))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
