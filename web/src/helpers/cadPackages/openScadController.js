const openScadBaseURL =
  'https://x2wvhihk56.execute-api.us-east-1.amazonaws.com/dev'

export const render = async ({ code, settings }) => {
  const response = await fetch(openScadBaseURL + '/render', {
    method: 'POST',
    headers: new Headers().append('Content-Type', 'application/json'),
    body: JSON.stringify({
      settings: {
        size: {
          x: 700,
          y: 300,
        },
      },
      file: code,
    }),
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
