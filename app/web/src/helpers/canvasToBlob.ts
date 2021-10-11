export const canvasToBlob = async (
  threeInstance,
  { width, height }: { width: number; height: number }
): Promise<Blob> => {
  const updateCanvasSize = ({
    width,
    height,
  }: {
    width: number
    height: number
  }) => {
    threeInstance.camera.aspect = width / height
    threeInstance.camera.updateProjectionMatrix()
    threeInstance.gl.setSize(width, height)
    threeInstance.gl.render(
      threeInstance.scene,
      threeInstance.camera,
      null,
      false
    )
  }
  const oldSize = threeInstance.size
  updateCanvasSize({ width, height })
  const imgBlobPromise: Promise<Blob> = new Promise((resolve) => {
    threeInstance.gl.domElement.toBlob(
      (blob) => {
        resolve(blob)
      },
      'image/png',
      0.75
    )
  })
  updateCanvasSize(oldSize)
  return imgBlobPromise
}

export const blobTo64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
