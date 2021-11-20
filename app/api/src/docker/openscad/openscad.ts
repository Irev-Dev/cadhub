import { runScad, stlExport } from './runScad'
import middy from 'middy'
import { cors } from 'middy/middlewares'
import { loggerWrap, storeAssetAndReturnUrl } from '../common/utils'

const _preview = async (req, _context, callback) => {
  _context.callbackWaitsForEmptyEventLoop = false
  const eventBody = Buffer.from(req.body, 'base64').toString('ascii')
  console.log('eventBody', eventBody)

  const { file, settings } = JSON.parse(eventBody)
  const { error, consoleMessage, fullPath } = await runScad({
    file,
    settings,
  })
  await storeAssetAndReturnUrl({
    error,
    callback,
    fullPath,
    consoleMessage,
  })
}

const _stl = async (req, _context, callback) => {
  _context.callbackWaitsForEmptyEventLoop = false
  const eventBody = Buffer.from(req.body, 'base64').toString('ascii')

  console.log(eventBody, 'eventBody')

  const { file, settings } = JSON.parse(eventBody)
  const { error, consoleMessage, fullPath } = await stlExport({
    file,
    settings,
  })
  await storeAssetAndReturnUrl({
    error,
    callback,
    fullPath,
    consoleMessage,
  })
}

export const stl = middy(loggerWrap(_stl)).use(cors())
export const preview = middy(loggerWrap(_preview)).use(cors())
