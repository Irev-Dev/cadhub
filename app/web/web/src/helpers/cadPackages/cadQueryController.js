import { lambdaBaseURL } from './common'

export const render = async ({ code }) => {
  const body = JSON.stringify({
    settings: {},
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
      // TODO add proper error messages for CadQuery
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
        type: 'stl',
        data: data.imageBase64,
      },
      message: {
        type: 'message',
        message: data.result || 'Successful Render',
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
