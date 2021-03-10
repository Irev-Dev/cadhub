// const openScadBaseURL = 'http://localhost:8080' // for local development
const openScadBaseURL =
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
}

const openScad = {
  render,
  // more functions to come
}

export default openScad
