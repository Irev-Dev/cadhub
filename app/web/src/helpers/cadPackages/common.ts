import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { State } from 'src/helpers/hooks/useIdeState'

export const lambdaBaseURL =
  process.env.CAD_LAMBDA_BASE_URL ||
  'https://2inlbple1b.execute-api.us-east-1.amazonaws.com/prod2'

export const stlToGeometry = (url) =>
  new Promise((resolve, reject) => {
    new STLLoader().load(url, resolve, null, reject)
  })

export interface RenderArgs {
  code: State['code']
  parameters: any
  settings: {
    camera: State['camera']
    viewerSize: State['viewerSize']
    quality: State['objectData']['quality']
  }
}

export interface HealthyResponse {
  status: 'healthy'
  message: {
    type: 'message'
    message: string
    time: Date
  }
  objectData: {
    data: any
    type: 'stl' | 'png' | 'geometry'
  }
  customizerParams?: any
  lastParameters?: any
}

export function createHealthyResponse({
  date,
  data,
  consoleMessage,
  type,
  customizerParams,
  lastParameters,
}: {
  date: Date
  data: any
  consoleMessage: string
  type: HealthyResponse['objectData']['type']
  customizerParams?: any
  lastParameters?: any
}): HealthyResponse {
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
    customizerParams,
    lastParameters,
  }
}

export interface ErrorResponse {
  status: 'error'
  message: {
    type: 'error'
    message: string
    time: Date
  }
}

export function createUnhealthyResponse(
  date: Date,
  message = 'network issue'
): ErrorResponse {
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

export const timeoutErrorMessage = `timeout: We're currently limited to a 30s execution time. You can try again, sometimes it works the second time`

export interface DefaultKernelExport {
  render: (arg: RenderArgs) => Promise<HealthyResponse | ErrorResponse>
}
