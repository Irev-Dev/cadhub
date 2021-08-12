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
  const imgBlobPromise: Promise<Blob> = new Promise((resolve, reject) => {
    threeInstance.gl.domElement.toBlob(
      (blob) => {
        resolve(blob)
      },
      'image/jpeg',
      1
    )
  })
  updateCanvasSize(oldSize)
  return imgBlobPromise
}
