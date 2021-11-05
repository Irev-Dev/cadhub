import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { State } from 'src/helpers/hooks/useIdeState'
import { CadhubParams } from 'src/components/Customizer/customizerConverter'
import type { Camera } from 'src/helpers/hooks/useIdeState'

export const lambdaBaseURL =
  process.env.CAD_LAMBDA_BASE_URL ||
  'https://oxt2p7ddgj.execute-api.us-east-1.amazonaws.com/prod'

export const stlToGeometry = (url) =>
  new Promise((resolve, reject) => {
    new STLLoader().load(url, resolve, null, reject)
  })

export interface RenderArgs {
  code: State['code']
  settings: {
    parameters?: RawCustomizerParams
    camera: State['camera']
    viewerSize: State['viewerSize']
    quality: State['objectData']['quality']
    viewAll: boolean
  }
}

export type ArtifactTypes = 'stl' | 'png' | 'geometry' | 'primitive-array'

export interface HealthyResponse {
  status: 'healthy'
  message: {
    type: 'message'
    message: string
    time: Date
  }
  objectData: {
    data: any
    type: ArtifactTypes
  }
  customizerParams?: any[]
  currentParameters?: RawCustomizerParams
  camera?: Camera
}

export interface RawCustomizerParams {
  [paramName: string]: number | string | boolean
}

export function createHealthyResponse({
  date,
  data,
  consoleMessage,
  type,
  customizerParams,
  camera,
}: {
  date: Date
  data: any
  consoleMessage: string
  type: HealthyResponse['objectData']['type']
  customizerParams?: CadhubParams[]
  camera?: Camera
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
    camera,
    customizerParams,
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

export type RenderResponse = HealthyResponse | ErrorResponse
export interface DefaultKernelExport {
  render: (arg: RenderArgs) => Promise<RenderResponse>
}

export const splitGziped = (text: string) => {
  const concatSplitStr = 'cadhub-concat-split'
  const splitIndex = text.indexOf(concatSplitStr)
  const json = text.slice(splitIndex + concatSplitStr.length)

  try {
    return JSON.parse(json)
  } catch (e) {
    return {}
  }
}
