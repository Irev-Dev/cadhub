import {
  lambdaBaseURL,
  stlToGeometry,
  createHealthyResponse,
  createUnhealthyResponse,
  timeoutErrorMessage,
  RenderArgs,
  splitGziped,
} from '../common'
import { openScadToCadhubParams } from './openScadParams'

export const render = async ({ code, settings }: RenderArgs) => {
  const pixelRatio = window.devicePixelRatio || 1
  const size = {
    x: Math.round(settings.viewerSize?.width * pixelRatio),
    y: Math.round(settings.viewerSize?.height * pixelRatio),
  }
  const round1dec = (number) => Math.round((number + Number.EPSILON) * 10) / 10
  const body = JSON.stringify({
    settings: {
      size,
      parameters: settings.parameters,
      camera: {
        // rounding to give our caching a chance to sometimes work
        ...settings.camera,
        dist: round1dec(settings.camera.dist),
        position: {
          x: round1dec(settings.camera.position.x),
          y: round1dec(settings.camera.position.y),
          z: round1dec(settings.camera.position.z),
        },
        rotation: {
          x: round1dec(settings.camera.rotation.x),
          y: round1dec(settings.camera.rotation.y),
          z: round1dec(settings.camera.rotation.z),
        },
      },
    },
    file: code,
  })
  if (!settings.camera.position) {
    return
  }
  try {
    const response = await fetch(lambdaBaseURL + '/openscad/preview', {
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
    const data = await response.json()
    const type = data.type !== 'stl' ? 'png' : 'geometry'
    const newData = await fetch(data.url).then(async (a) => {
      const blob = await a.blob()
      const text = await new Response(blob).text()
      const { consoleMessage, customizerParams } = splitGziped(text)
      return {
        data:
          data.type !== 'stl'
            ? blob
            : await stlToGeometry(window.URL.createObjectURL(blob)),
        consoleMessage,
        customizerParams,
      }
    })
    return createHealthyResponse({
      type,
      data: newData.data,
      consoleMessage: newData.consoleMessage,
      date: new Date(),
      customizerParams: openScadToCadhubParams(newData.customizerParams || []),
    })
  } catch (e) {
    return createUnhealthyResponse(new Date())
  }
}

export const stl = async ({ code, settings }: RenderArgs) => {
  const body = JSON.stringify({
    settings: {},
    file: code,
  })
  try {
    const response = await fetch(lambdaBaseURL + '/openscad/stl', {
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
    const data = await response.json()
    const newData = await fetch(data.url).then(async (a) => {
      const blob = await a.blob()
      const text = await new Response(blob).text()
      const { consoleMessage, customizerParams } = splitGziped(text)
      return {
        data: await stlToGeometry(window.URL.createObjectURL(blob)),
        consoleMessage,
        customizerParams,
      }
    })
    return createHealthyResponse({
      type: 'geometry',
      data: newData.data,
      consoleMessage: newData.consoleMessage,
      date: new Date(),
      customizerParams: openScadToCadhubParams(newData.customizerParams || []),
    })
  } catch (e) {
    return createUnhealthyResponse(new Date())
  }
}

const openscad = {
  render,
  stl,
}

export default openscad

function cleanError(error) {
  return error.replace(/["|']\/tmp\/.+\/main.scad["|']/g, "'main.scad'")
}
