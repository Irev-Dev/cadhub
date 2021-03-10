const express = require('express')
var cors = require('cors')
const axios = require('axios')
const stream = require('stream')
const app = express()
const port = 8080
app.use(express.json())
app.use(cors())

const invocationURL = (port) =>
  `http://localhost:${port}/2015-03-31/functions/function/invocations`

app.post('/render', async (req, res) => {
  const { data } = await axios.post(invocationURL(5052), {
    body: Buffer.from(JSON.stringify(req.body)).toString('base64'),
  })
  if (data.statusCode !== 200) {
    res.status(data.statusCode)
    res.send(res.body)
  } else {
    const fileContents = Buffer.from(data.body, 'base64')

    const readStream = new stream.PassThrough()
    readStream.end(fileContents)

    res.set('Content-disposition', 'attachment; filename=' + 'output')
    res.set('Content-Type', 'image/png')
    readStream.pipe(res)
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
