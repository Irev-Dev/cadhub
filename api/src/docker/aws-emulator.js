const express = require('express')
var cors = require('cors')
const axios = require('axios')
const { restart } = require('nodemon')
const app = express()
const port = 8080
app.use(express.json())
app.use(cors())

const invocationURL = (port) =>
  `http://localhost:${port}/2015-03-31/functions/function/invocations`

app.post('/openscad/preview', async (req, res) => {
  try {
    const { data } = await axios.post(invocationURL(5052), {
      body: Buffer.from(JSON.stringify(req.body)).toString('base64'),
    })
    res.status(data.statusCode)
    res.send(data.body)
  } catch (e) {
    res.status(500)
    res.send()
  }
})
app.post('/cadquery/stl', async (req, res) => {
  console.log('making post request to 5060')
  try {
    const { data } = await axios.post(invocationURL(5060), {
      body: Buffer.from(JSON.stringify(req.body)).toString('base64'),
    })
    res.status(data.statusCode)
    res.send(data.body)
  } catch (e) {
    res.status(500)
    res.send()
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
