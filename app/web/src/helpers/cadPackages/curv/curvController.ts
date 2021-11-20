import {
  lambdaBaseURL,
  stlToGeometry,
  createHealthyResponse,
  createUnhealthyResponse,
  timeoutErrorMessage,
  RenderArgs,
  splitGziped,
} from '../common'
import { CurvToCadhubParams } from './openScadParams'
import type { XYZ, Camera } from 'src/helpers/hooks/useIdeState'

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
      viewAll: settings.viewAll,
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
    const { consoleMessage, customizerParams, type, cameraInfo } =
      splitGziped(text)
    const vecArray2Obj = (arr: number[]): XYZ => ({
      x: arr[0],
      y: arr[1],
      z: arr[2],
    })
    const camera: Camera = cameraInfo
      ? {
          dist: cameraInfo?.distance,
          position: vecArray2Obj(cameraInfo?.translation),
          rotation: vecArray2Obj(cameraInfo?.rotation),
          isScadUpdate: true,
        }
      : undefined
    return createHealthyResponse({
      type: type !== 'stl' ? 'png' : 'geometry',
      data:
        type !== 'stl'
          ? blob
          : await stlToGeometry(window.URL.createObjectURL(blob)),
      consoleMessage,
      camera,
      date: new Date(),
      customizerParams: curvToCadhubParams(customizerParams || []),
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
    const { consoleMessage, customizerParams, type } = splitGziped(text)
    return createHealthyResponse({
      type: type !== 'stl' ? 'png' : 'geometry',
      data:
        type !== 'stl'
          ? blob
          : await stlToGeometry(window.URL.createObjectURL(blob)),
      consoleMessage,
      date: new Date(),
      customizerParams: openScadToCadhubParams(customizerParams || []),
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
