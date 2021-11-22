import { runCQ } from './runCQ'
import middy from 'middy'
import { cors } from 'middy/middlewares'
import { loggerWrap, storeAssetAndReturnUrl } from '../common/utils'

const stl = async (req, _context, callback) => {
  _context.callbackWaitsForEmptyEventLoop = false
  const eventBody = Buffer.from(req.body, 'base64').toString('ascii')
  console.log('eventBody', eventBody)

  const { file, settings } = JSON.parse(eventBody)
  const { error, consoleMessage, fullPath, tempFile } = await runCQ({ file, settings })
  await storeAssetAndReturnUrl({
    error,
    callback,
    fullPath,
    consoleMessage,
    tempFile
  })
}

module.exports = {
  stl: middy(loggerWrap(stl)).use(cors()),
}
