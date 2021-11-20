import { runCQ } from './runCQ'
import middy from 'middy'
import { cors } from 'middy/middlewares'
import { loggerWrap, storeAssetAndReturnUrl } from '../common/utils'

const _stl = async (req, _context, callback) => {
  _context.callbackWaitsForEmptyEventLoop = false
  const eventBody = Buffer.from(req.body, 'base64').toString('ascii')
  console.log('eventBody', eventBody)

  const { file, settings } = JSON.parse(eventBody)
  const { error, consoleMessage, fullPath } = await runCQ({ file, settings })
  await storeAssetAndReturnUrl({
    error,
    callback,
    fullPath,
    consoleMessage,
  })
}

export const stl = middy(loggerWrap(_stl)).use(cors())
