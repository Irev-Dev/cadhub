import {
  lambdaBaseURL,
  stlToGeometry,
  createHealthyResponse,
  createUnhealthyResponse,
  timeoutErrorMessage,
  RenderArgs,
  splitGziped,
} from '../common'

export const render = async ({ code, settings }: RenderArgs) => {
  const pixelRatio = window.devicePixelRatio || 1
  const size = {
    x: Math.round(settings.viewerSize?.width * pixelRatio),
    y: Math.round(settings.viewerSize?.height * pixelRatio),
  }
  const body = JSON.stringify({
    settings: {
      size,
    },
    file: code,
  })
  try {
    const response = await fetch(lambdaBaseURL + '/curv/preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
    if (response.status === 400) {
      const { error } = await response.json()
      const cleanedErrorMessage = cleanError(error)
      return createUnhealthyResponse(new Date(), cleanedErrorMessage)
    }
    if (response.status === 502) {
      return createUnhealthyResponse(new Date(), timeoutErrorMessage)
    }
    const blob = await response.blob()
    const text = await new Response(blob).text()
    const { consoleMessage, type } = splitGziped(text)
    return createHealthyResponse({
      type: type !== 'stl' ? 'png' : 'geometry',
      data:
        type !== 'stl'
          ? blob
          : await stlToGeometry(window.URL.createObjectURL(blob)),
      consoleMessage,
      date: new Date(),
    })
  } catch (e) {
    return createUnhealthyResponse(new Date())
  }
}

export const stl = async ({ code /*settings*/ }: RenderArgs) => {
  const body = JSON.stringify({
    settings: {},
    file: code,
  })
  try {
    const response = await fetch(lambdaBaseURL + '/curv/stl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
    if (response.status === 400) {
      const { error } = await response.json()
      const cleanedErrorMessage = cleanError(error)
      return createUnhealthyResponse(new Date(), cleanedErrorMessage)
    }
    if (response.status === 502) {
      return createUnhealthyResponse(new Date(), timeoutErrorMessage)
    }
    const blob = await response.blob()
    const text = await new Response(blob).text()
    const { consoleMessage, type } = splitGziped(text)
    return createHealthyResponse({
      type: type !== 'stl' ? 'png' : 'geometry',
      data:
        type !== 'stl'
          ? blob
          : await stlToGeometry(window.URL.createObjectURL(blob)),
      consoleMessage,
      date: new Date(),
    })
  } catch (e) {
    return createUnhealthyResponse(new Date())
  }
}

const curv = {
  render,
  stl,
}

export default curv

function cleanError(error) {
  return error.replace(/["|']\/tmp\/.+\/main.curv["|']/g, "'main.curv'")
}
