export const render = async ({ code, settings }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldReject = Math.random() < 0.7
      if (shouldReject) {
        resolve({
          objectData: {
            type: 'jpg',
            data: ((Math.random() * 256 + 1) >>> 0).toString(2),
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


const openScad = {
  render,
}

export default openScad