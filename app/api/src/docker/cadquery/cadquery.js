const { runCQ } = require('./runCQ')
const middy = require('middy')
const { cors } = require('middy/middlewares')
const AWS = require('aws-sdk')
const tk = require('timekeeper')
const {
  makeHash,
  checkIfAlreadyExists,
  getObjectUrl,
  loggerWrap,
  storeAssetAndReturnUrl,
} = require('../common/utils')

const s3 = new AWS.S3()

const stl = async (req, _context, callback) => {
  _context.callbackWaitsForEmptyEventLoop = false
  const eventBody = req.body
  console.log('eventBody', eventBody)
  const key = `${makeHash(eventBody)}.stl`
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
        url: getObjectUrl(params, s3, tk),
      }),
    }
    callback(null, response)
    return
  }

  const { file, settings } = JSON.parse(eventBody)
  const { error, consoleMessage, fullPath } = await runCQ({ file, settings })
  await storeAssetAndReturnUrl({
    error,
    callback,
    fullPath,
    consoleMessage,
    key,
    s3,
    params,
    tk,
  })
}

module.exports = {
  stl: middy(loggerWrap(stl)).use(cors()),
}
