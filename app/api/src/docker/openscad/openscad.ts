import { runScad, stlExport } from './runScad'
import middy from 'middy'
import { cors } from 'middy/middlewares'
import { loggerWrap, storeAssetAndReturnUrl } from '../common/utils'

const preview = async (req, _context, callback) => {
  _context.callbackWaitsForEmptyEventLoop = false
  const eventBody = Buffer.from(req.body, 'base64').toString('ascii')
  console.log('eventBody', eventBody)

  const { file, settings } = JSON.parse(eventBody)
  const { error, consoleMessage, fullPath, tempFile } = await runScad({
    file,
    settings,
  })
  await storeAssetAndReturnUrl({
    error,
    callback,
    fullPath,
    consoleMessage,
    tempFile,
  })
}

const stl = async (req, _context, callback) => {
  _context.callbackWaitsForEmptyEventLoop = false
  const eventBody = Buffer.from(req.body, 'base64').toString('ascii')

  console.log(eventBody, 'eventBody')

  const { file, settings } = JSON.parse(eventBody)
  const { error, consoleMessage, fullPath, tempFile } = await stlExport({
    file,
    settings,
  })
  await storeAssetAndReturnUrl({
    error,
    callback,
    fullPath,
    consoleMessage,
    tempFile,
  })
}

module.exports = {
  stl: middy(loggerWrap(stl)).use(cors()),
  preview: middy(loggerWrap(preview)).use(cors()),
}
