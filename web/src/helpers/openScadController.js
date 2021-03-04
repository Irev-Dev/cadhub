export const renderOpenScad = async ({ code, settings }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldReject = Math.random() < 0.7
      if (shouldReject) {
        resolve({
          objectData: {
            type: Math.random() > 0.6 ? 'stl' : 'jpg',
            data: 'some binary',
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
