const { runCQ } = require('./runCQ')
const middy = require('middy')
const { cors } = require('middy/middlewares')

// cors true does not seem to work in serverless.yml, perhaps docker lambdas aren't covered by that config
// special lambda just for responding to options requests
const preflightOptions = (req, _context, callback) => {
  const response = {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': '*',
    },
  }
  callback(null, response)
}

const stl = async (req, _context, callback) => {
  _context.callbackWaitsForEmptyEventLoop = false
  const eventBody = Buffer.from(req.body, 'base64').toString('ascii')
  console.log(eventBody, 'eventBody')
  const { file, settings } = JSON.parse(eventBody)
  const { error, result, tempFile } = await runCQ({ file, settings })
  if (error) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({ error, tempFile }),
    }
    callback(null, response)
  } else {
    console.log(`got result in route: ${result}, file is: ${tempFile}`)
    const fs = require('fs')
    const image = fs.readFileSync(`/tmp/${tempFile}/output.stl`, {
      encoding: 'base64',
    })
    console.log(image, 'encoded image')
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        imageBase64: image,
        result,
        tempFile,
      }),
    }
    callback(null, response)
  }
}

module.exports = {
  stl: middy(stl).use(cors()),
  preflightOptions,
}
