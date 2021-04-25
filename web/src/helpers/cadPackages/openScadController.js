import { lambdaBaseURL } from './common'

export const render = async ({ code, settings }) => {
  const pixelRatio = window.devicePixelRatio || 1
  const size = {
    x: Math.round(settings.viewerSize?.width * pixelRatio),
    y: Math.round(settings.viewerSize?.height * pixelRatio),
  }
  const body = JSON.stringify({
    settings: {
      size,
      camera: settings.camera,
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
          message: addDateToLog(cleanedErrorMessage),
        },
      }
    }
    const data = await response.json()
    return {
      status: 'healthy',
      objectData: {
        type: 'png',
        data: data.imageBase64,
      },
      message: {
        type: 'message',
        message: addDateToLog(data.result),
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
        message: addDateToLog('network issue'),
      },
    }
  }
}

const openScad = {
  render,
  // more functions to come
}

export default openScad

function addDateToLog(message) {
  return `-> ${new Date().toLocaleString()}
${message}`
}
