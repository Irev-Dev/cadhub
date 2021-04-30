const { runScad, stlExport } = require('./runScad')
const middy = require('middy')
const { cors } = require('middy/middlewares')

const health = async () => {
  console.log('Health endpoint')
  return {
    statusCode: 200,
    body: 'ok',
  }
}

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

const preview = async (req, _context, callback) => {
  _context.callbackWaitsForEmptyEventLoop = false
  const eventBody = Buffer.from(req.body, 'base64').toString('ascii')
  console.log(eventBody, 'eventBody')
  const { file, settings } = JSON.parse(eventBody)
  const { error, result, tempFile } = await runScad({ file, settings })
  if (error) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({ error, tempFile }),
    }
    callback(null, response)
  } else {
    console.log(`got result in route: ${result}, file is: ${tempFile}`)
    const fs = require('fs')
    const image = fs.readFileSync(`/tmp/${tempFile}/output.png`, {
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

const stl = async (req, _context, callback) => {
  _context.callbackWaitsForEmptyEventLoop = false
  const eventBody = Buffer.from(req.body, 'base64').toString('ascii')
  console.log(eventBody, 'eventBody')
  const { file } = JSON.parse(eventBody)
  const { error, result, tempFile } = await stlExport({ file })
  if (error) {
    const response = {
      statusCode: 400,
      body: { error, tempFile },
    }
    callback(null, response)
  } else {
    console.log(`got result in route: ${result}, file is: ${tempFile}`)
    const fs = require('fs')
    const stl = fs.readFileSync(`/tmp/${tempFile}/output.stl`, {
      encoding: 'base64',
    })
    console.log('encoded stl', stl)
    const response = {
      statusCode: 200,
      headers: {
        'content-type': 'application/stl',
      },
      body: stl,
      isBase64Encoded: true,
    }
    console.log('callback fired')
    callback(null, response)
  }
}

module.exports = {
  health: middy(health).use(cors()),
  stl: middy(stl).use(cors()),
  preview: middy(preview).use(cors()),
  preflightOptions,
}
