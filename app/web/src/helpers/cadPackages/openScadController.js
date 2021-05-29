import {
  lambdaBaseURL,
  stlToGeometry,
  createHealthyResponse,
  createUnhealthyResponse,
} from './common'

export const render = async ({ code, settings }) => {
  const pixelRatio = window.devicePixelRatio || 1
  const size = {
    x: Math.round(settings.viewerSize?.width * pixelRatio),
    y: Math.round(settings.viewerSize?.height * pixelRatio),
  }
  const round1dec = (number) => Math.round((number + Number.EPSILON) * 10) / 10
  const body = JSON.stringify({
    settings: {
      size,
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
    const data = await response.json()
    const type = data.type !== 'stl' ? 'png' : 'geometry'
    const newData = data.type !== 'stl' ? data.url : stlToGeometry(data.url)
    return createHealthyResponse({
      type,
      data: await newData,
      consoleMessage: data.consoleMessage,
      date: new Date(),
    })
  } catch (e) {
    return createUnhealthyResponse(new Date())
  }
}

export const stl = async ({ code, settings }) => {
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
    const data = await response.json()
    const geometry = await stlToGeometry(data.url)
    return createHealthyResponse({
      type: 'geometry',
      data: geometry,
      consoleMessage: data.consoleMessage,
      date: new Date(),
    })
  } catch (e) {
    return createUnhealthyResponse(new Date())
  }
}

const openScad = {
  render,
  stl,
}

export default openScad

function cleanError(error) {
  return error.replace(/["|']\/tmp\/.+\/main.scad["|']/g, "'main.scad'")
}
