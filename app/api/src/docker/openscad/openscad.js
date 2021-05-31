const { runScad, stlExport } = require('./runScad')
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

const openScadStlKey = (eventBody) => {
  const { file } = JSON.parse(eventBody)
  return `${makeHash(JSON.stringify(file))}.stl`
}

const preview = async (req, _context, callback) => {
  _context.callbackWaitsForEmptyEventLoop = false
  const eventBody = req.body
  console.log('eventBody', eventBody)
  const key = `${makeHash(eventBody)}.png`
  const stlKey = openScadStlKey(eventBody)

  console.log('key', key)

  const stlParams = {
    Bucket: process.env.BUCKET,
    Key: stlKey,
  }

  const params = {
    Bucket: process.env.BUCKET,
    Key: key,
  }
  const [previousAssetStl, previousAssetPng] = await Promise.all([
    checkIfAlreadyExists(stlParams, s3),
    checkIfAlreadyExists(params, s3),
  ])
  const type = previousAssetStl.isAlreadyInBucket ? 'stl' : 'png'
  const previousAsset = previousAssetStl.isAlreadyInBucket
    ? previousAssetStl
    : previousAssetPng
  if (previousAsset.isAlreadyInBucket) {
    console.log('already in bucket')
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        url: getObjectUrl(
          {
            Bucket: process.env.BUCKET,
            Key: previousAssetStl.isAlreadyInBucket ? stlKey : key,
          },
          s3,
          tk
        ),
        consoleMessage:
          previousAsset.consoleMessage || previousAssetPng.consoleMessage,
        type,
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
    tk,
  })
}

const stl = async (req, _context, callback) => {
  _context.callbackWaitsForEmptyEventLoop = false
  const eventBody = req.body
  console.log(eventBody, 'eventBody')
  const stlKey = openScadStlKey(eventBody)

  console.log('key', stlKey)

  const params = {
    Bucket: process.env.BUCKET,
    Key: stlKey,
  }
  console.log('original params', params)
  const previousAsset = await checkIfAlreadyExists(params, s3)
  if (previousAsset.isAlreadyInBucket) {
    console.log('already in bucket')
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        url: getObjectUrl({ ...params }, s3, tk),
        consoleMessage: previousAsset.consoleMessage,
      }),
    }
    callback(null, response)
    return
  }
  const { file } = JSON.parse(eventBody)
  const { error, consoleMessage, fullPath } = await stlExport({ file })
  await storeAssetAndReturnUrl({
    error,
    callback,
    fullPath,
    consoleMessage,
    key: stlKey,
    s3,
    params,
    tk,
  })
}

module.exports = {
  stl: middy(stl).use(cors()),
  preview: middy(loggerWrap(preview)).use(cors()),
}
