import { lambdaBaseURL } from './common'

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
      const cleanedErrorMessage = error.replace(
        /["|']\/tmp\/.+\/main.scad["|']/g,
        "'main.scad'"
      )
      return {
        status: 'error',
        message: {
          type: 'error',
          message: cleanedErrorMessage,
          time: new Date(),
        },
      }
    }
    const data = await response.json()
    return {
      status: 'healthy',
      objectData: {
        type: 'png',
        data: data.url,
      },
      message: {
        type: 'message',
        message: data.consoleMessage,
        time: new Date(),
      },
    }
  } catch (e) {
    // TODO handle errors better
    // I think we should display something overlayed on the viewer window something like "network issue try again"
    // and in future I think we need timeouts differently as they maybe from a user trying to render something too complex
    // or something with minkowski in it :/ either way something like "render timed out, try again or here are tips to reduce part complexity" with a link talking about $fn and minkowski etc
    return {
      status: 'error',
      message: {
        type: 'error',
        message: 'network issue',
        time: new Date(),
      },
    }
  }
}

const openScad = {
  render,
  // more functions to come
}

export default openScad
