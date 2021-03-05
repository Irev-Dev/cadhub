// Rename this file to remove "new" once Cascade integration is complete

export const render = async ({ code, settings }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldReject = Math.random() < 0.7
      if (shouldReject) {
        resolve({
          objectData: {
            type: 'stl',
            data: ((Math.random() * 256 + 1) >>> 0).toString(2), // Randomized 8-bit numbers for funzies
          },
          message: {
            type: 'message',
            message: `bodies rendered by: ${code}`,
          },
        })
      } else {
        reject({
          message: {
            type: 'error',
            message: 'unable to parse line: x',
          },
        })
      }
    }, 700)
  })
}

const openCascade = {
  render,
  // More functions to come
}

export default openCascade