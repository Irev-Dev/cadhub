let openScadBaseURL =
  process.env.OPENSCAD_BASE_URL ||
  'https://x2wvhihk56.execute-api.us-east-1.amazonaws.com/dev'

export const render = async ({ code, settings }) => {
  const body = JSON.stringify({
    settings: {
      size: {
        x: 500,
        y: 500,
      },
      camera: settings.camera,
    },
    file: code,
  })
  try {
    const response = await fetch(openScadBaseURL + '/render', {
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
        isError: true,
        message: {
          type: 'error',
          message: cleanedErrorMessage,
        },
      }
    }
    const data = await response.blob()
    return {
      objectData: {
        type: 'png',
        data,
      },
      message: {
        type: 'message',
        message: 'successful render',
      },
    }
  } catch (e) {
    // TODO handle errors better
    // I think we should display something overlayed on the viewer window something like "network issue try again"
    // and in future I think we need timeouts differently as they maybe from a user trying to render something too complex
    // or something with minkowski in it :/ either way something like "render timed out, try again or here are tips to reduce part complexity" with a link talking about $fn and minkowski etc
    return {
      isError: true,
      message: {
        type: 'error',
        message: 'network issue',
      },
    }
  }
}

const openScad = {
  render,
  // more functions to come
}

export default openScad
