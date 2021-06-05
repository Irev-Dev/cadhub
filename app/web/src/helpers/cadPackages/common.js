import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'

export const lambdaBaseURL =
  process.env.CAD_LAMBDA_BASE_URL ||
  'https://2inlbple1b.execute-api.us-east-1.amazonaws.com/prod2'

export const stlToGeometry = (url) =>
  new Promise((resolve, reject) => {
    new STLLoader().load(url, resolve, null, reject)
  })

export function createHealthyResponse({ date, data, consoleMessage, type }) {
  return {
    status: 'healthy',
    objectData: {
      type,
      data: data,
    },
    message: {
      type: 'message',
      message: consoleMessage,
      time: date,
    },
  }
}

export function createUnhealthyResponse(date, message = 'network issue') {
  // TODO handle errors better
  // I think we should display something overlayed on the viewer window something like "network issue try again"
  // and in future I think we need timeouts differently as they maybe from a user trying to render something too complex
  // or something with minkowski in it :/ either way something like "render timed out, try again or here are tips to reduce part complexity" with a link talking about $fn and minkowski etc
  return {
    status: 'error',
    message: {
      type: 'error',
      message,
      time: date,
    },
  }
}
