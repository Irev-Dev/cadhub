const { runScad } = require('./runScad')
const middy = require('middy')
const { cors } = require('middy/middlewares')
const AWS = require('aws-sdk')
const {
  makeHash,
  checkIfAlreadyExists,
  getObjectUrl,
  loggerWrap,
  storeAssetAndReturnUrl,
} = require('../common/utils')

const s3 = new AWS.S3()

const preview = async (req, _context, callback) => {
  _context.callbackWaitsForEmptyEventLoop = false
  const eventBody = req.body
  console.log('eventBody', eventBody)
  const key = `${makeHash(eventBody)}.png`
  console.log('key', key)

  const params = {
    Bucket: process.env.BUCKET,
    Key: key,
  }
  const previousAsset = await checkIfAlreadyExists(params, s3)
  if (previousAsset.isAlreadyInBucket) {
    console.log('already in bucket')
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        url: getObjectUrl(params, s3),
        consoleMessage: previousAsset.consoleMessage,
      }),
    }
    callback(null, response)
    return
  }

  const { file, settings } = JSON.parse(eventBody)
  const { error, consoleMessage, fullPath } = await runScad({ file, settings })
  await storeAssetAndReturnUrl({
    error,
    callback,
    fullPath,
    consoleMessage,
    key,
    s3,
    params,
  })
}

// const stl = async (req, _context, callback) => {
//   _context.callbackWaitsForEmptyEventLoop = false
//   const eventBody = Buffer.from(req.body, 'base64').toString('ascii')
//   console.log(eventBody, 'eventBody')
//   const { file } = JSON.parse(eventBody)
//   const { error, result, tempFile } = await stlExport({ file })
//   if (error) {
//     const response = {
//       statusCode: 400,
//       body: { error, tempFile },
//     }
//     callback(null, response)
//   } else {
//     console.log(`got result in route: ${result}, file is: ${tempFile}`)
//     const fs = require('fs')
//     const stl = fs.readFileSync(`/tmp/${tempFile}/output.stl`, {
//       encoding: 'base64',
//     })
//     console.log('encoded stl', stl)
//     const response = {
//       statusCode: 200,
//       headers: {
//         'content-type': 'application/stl',
//       },
//       body: stl,
//       isBase64Encoded: true,
//     }
//     console.log('callback fired')
//     callback(null, response)
//   }
// }

module.exports = {
  // stl: middy(stl).use(cors()),
  preview: middy(loggerWrap(preview)).use(cors()),
}
