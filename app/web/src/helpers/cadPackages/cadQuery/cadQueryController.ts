import {
  lambdaBaseURL,
  stlToGeometry,
  createHealthyResponse,
  createUnhealthyResponse,
  timeoutErrorMessage,
  RenderArgs,
  DefaultKernelExport,
  splitGziped,
} from '../common'
import { CadQueryToCadhubParams } from './cadQueryParams'

export const render: DefaultKernelExport['render'] = async ({
  code,
  settings: { quality = 'low', parameters },
}: RenderArgs) => {
  const body = JSON.stringify({
    settings: {
      deflection: quality === 'low' ? 0.35 : 0.11,
      parameters,
    },
    file: code,
  })
  try {
    const response = await fetch(lambdaBaseURL + '/cadquery/stl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
    if (response.status === 400) {
      const { error } = await response.json()
      return {
        status: 'error',
        message: {
          type: 'error',
          message: error,
          time: new Date(),
        },
      }
    }
    if (response.status === 502) {
      return createUnhealthyResponse(new Date(), timeoutErrorMessage)
    }
    const blob = await response.blob()
    const text = await new Response(blob).text()
    const { consoleMessage, customizerParams } = splitGziped(text)
    return createHealthyResponse({
      type: 'geometry',
      data: await stlToGeometry(window.URL.createObjectURL(blob)),
      consoleMessage,
      date: new Date(),
      customizerParams: CadQueryToCadhubParams(customizerParams),
    })
  } catch (e) {
    return createUnhealthyResponse(new Date())
  }
}

const cadQuery: DefaultKernelExport = {
  render,
}

export default cadQuery
