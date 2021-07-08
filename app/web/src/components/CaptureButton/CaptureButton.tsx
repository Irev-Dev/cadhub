import { useState } from 'react'
import { toast } from '@redwoodjs/web/toast'
import Popover from '@material-ui/core/Popover'
import Svg from 'src/components/Svg/Svg'
import Button from 'src/components/Button/Button'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import { useUpdateProject } from 'src/helpers/hooks/useUpdateProject'
import { uploadToCloudinary } from 'src/helpers/cloudinary'

const anchorOrigin = {
  vertical: 'bottom',
  horizontal: 'center',
}
const transformOrigin = {
  vertical: 'top',
  horizontal: 'center',
}

const CaptureButton = ({ canEdit, TheButton, shouldUpdateImage }) => {
  const [captureState, setCaptureState] = useState<any>({})
  const [anchorEl, setAnchorEl] = useState(null)
  const [whichPopup, setWhichPopup] = useState(null)
  const { state, project } = useIdeContext()
  const { updateProject } = useUpdateProject({
    onCompleted: () => toast.success('Image updated'),
  })

  const onCapture = async () => {
    const threeInstance = state.threeInstance
    const isOpenScadImage = state?.objectData?.type === 'png'
    let imgBlob
    if (!isOpenScadImage) {
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
      updateCanvasSize({ width: 400, height: 300 })
      imgBlob = new Promise((resolve, reject) => {
        threeInstance.gl.domElement.toBlob(
          (blob) => {
            resolve(blob)
          },
          'image/jpeg',
          1
        )
      })
      updateCanvasSize(oldSize)
    } else {
      console.log(project?.title)
      imgBlob = state.objectData.data
    }
    const config = {
      image: await imgBlob,
      currImage: project?.mainImage,
      imageObjectURL: window.URL.createObjectURL(await imgBlob),
      callback: uploadAndUpdateImage,
      cloudinaryImgURL: '',
      updated: false,
    }

    async function uploadAndUpdateImage() {
      // Upload the image to Cloudinary
      const cloudinaryImgURL = await uploadToCloudinary(config.image)

      // Save the screenshot as the mainImage
      updateProject({
        variables: {
          id: project?.id,
          input: {
            mainImage: cloudinaryImgURL.public_id,
          },
        },
      })

      return cloudinaryImgURL
    }

    // if there isn't a screenshot saved yet, just go ahead and save right away
    if (shouldUpdateImage) {
      config.cloudinaryImgURL = (await uploadAndUpdateImage()).public_id
      config.updated = true
    }

    return config
  }

  const handleDownload = (url) => {
    const aTag = document.createElement('a')
    document.body.appendChild(aTag)
    aTag.href = url
    aTag.style.display = 'none'
    aTag.download = `${project?.title}-${new Date().toISOString()}.jpg`
    aTag.click()
    document.body.removeChild(aTag)
  }

  const handleClick = ({ event, whichPopup }) => {
    setAnchorEl(event.currentTarget)
    setWhichPopup(whichPopup)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setWhichPopup(null)
  }
  return (
    <div>
      {canEdit && (
        <div>
          <TheButton
            onClick={async (event) => {
              handleClick({ event, whichPopup: 'capture' })
              setCaptureState(await onCapture())
            }}
          />
          <Popover
            id={'capture-popover'}
            open={whichPopup === 'capture'}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={anchorOrigin}
            transformOrigin={transformOrigin}
            className="material-ui-overrides transform translate-y-4"
          >
            <div className="text-sm p-2 text-gray-500">
              {!captureState ? (
                'Loading...'
              ) : (
                <div className="grid grid-cols-2">
                  <div
                    className="rounded m-auto"
                    style={{ width: 'fit-content', overflow: 'hidden' }}
                  >
                    <img src={captureState.imageObjectURL} className="w-32" />
                  </div>
                  <div className="p-2 text-indigo-800">
                    {captureState.currImage && !captureState.updated ? (
                      <button
                        className="flex justify-center mb-4"
                        onClick={async () => {
                          const cloudinaryImg = await captureState.callback()
                          setCaptureState({
                            ...captureState,
                            currImage: cloudinaryImg.public_id,
                            updated: true,
                          })
                        }}
                      >
                        <Svg
                          name="refresh"
                          className="mr-2 w-4 text-indigo-600"
                        />{' '}
                        Update Part Image
                      </button>
                    ) : (
                      <div className="flex justify-center mb-4">
                        <Svg
                          name="checkmark"
                          className="mr-2 w-6 text-indigo-600"
                        />{' '}
                        Part Image Updated
                      </div>
                    )}
                    <Button
                      iconName="save"
                      className="shadow-md hover:shadow-lg border-indigo-600 border-2 border-opacity-0 hover:border-opacity-100 bg-indigo-200 text-indigo-100 text-opacity-100 bg-opacity-80"
                      shouldAnimateHover
                      onClick={() =>
                        handleDownload(captureState.imageObjectURL)
                      }
                    >
                      Download
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Popover>
        </div>
      )}
    </div>
  )
}

export default CaptureButton
