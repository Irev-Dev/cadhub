import { useState } from 'react'
import { toast } from '@redwoodjs/web/toast'
import Popover from '@material-ui/core/Popover'
import Svg from 'src/components/Svg/Svg'
import Button from 'src/components/Button/Button'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import { canvasToBlob, blobTo64 } from 'src/helpers/canvasToBlob'
import { useUpdateProjectImages } from 'src/helpers/hooks/useUpdateProjectImages'

import SocialCardCell from 'src/components/SocialCardCell/SocialCardCell'
import { toJpeg } from 'html-to-image'

const anchorOrigin = {
  vertical: 'bottom',
  horizontal: 'center',
}
const transformOrigin = {
  vertical: 'top',
  horizontal: 'center',
}

const CaptureButton = ({
  canEdit,
  TheButton,
  shouldUpdateImage,
  projectTitle,
  userName,
}) => {
  const [captureState, setCaptureState] = useState<any>({})
  const [anchorEl, setAnchorEl] = useState(null)
  const [whichPopup, setWhichPopup] = useState(null)
  const { state, project } = useIdeContext()
  const ref = React.useRef<HTMLDivElement>(null)
  const { updateProjectImages } = useUpdateProjectImages({})

  const onCapture = async () => {
    const threeInstance = state.threeInstance
    const isOpenScadImage = state?.objectData?.type === 'png'
    let imgBlob
    let image64
    if (!isOpenScadImage) {
      imgBlob = canvasToBlob(threeInstance, { width: 500, height: 375 })
      image64 = blobTo64(
        await canvasToBlob(threeInstance, { width: 500, height: 522 })
      )
    } else {
      imgBlob = state.objectData.data
      image64 = blobTo64(state.objectData.data)
    }
    const config = {
      image: await imgBlob,
      currImage: project?.mainImage,
      imageObjectURL: window.URL.createObjectURL(await imgBlob),
      callback: uploadAndUpdateImage,
      cloudinaryImgURL: '',
      updated: false,
      image64: await image64,
    }
    setCaptureState(config)

    async function uploadAndUpdateImage() {
      const upload = async () => {
        const socialCard64 = toJpeg(ref.current, {
          cacheBust: true,
          quality: 0.7,
        })

        // uploading in two separate mutations because of the 100kb limit of the lambda functions
        const imageUploadPromise1 = updateProjectImages({
          variables: {
            id: project?.id,
            mainImage64: await config.image64,
          },
        })
        const imageUploadPromise2 = updateProjectImages({
          variables: {
            id: project?.id,
            socialCard64: await socialCard64,
          },
        })
        return Promise.all([imageUploadPromise2, imageUploadPromise1])
      }
      const promise = upload()
      toast.promise(promise, {
        loading: 'Saving Image/s',
        success: <b>Image/s saved!</b>,
        error: <b>Problem saving.</b>,
      })
      const [{ data }] = await promise
      return data?.updateProjectImages?.mainImage
    }

    // if there isn't a screenshot saved yet, just go ahead and save right away
    if (shouldUpdateImage) {
      config.cloudinaryImgURL = await uploadAndUpdateImage()
      config.updated = true
      setCaptureState(config)
    }
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
              onCapture()
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
                            currImage: cloudinaryImg,
                            updated: true,
                          })
                        }}
                      >
                        <Svg
                          name="refresh"
                          className="mr-2 w-4 text-indigo-600"
                        />{' '}
                        Update Project Image
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
              <div className="rounded-lg shadow-md mt-4 overflow-hidden">
                <div
                  className="transform scale-50 origin-top-left"
                  style={{ width: '600px', height: '315px' }}
                >
                  <div style={{ width: '1200px', height: '630px' }} ref={ref}>
                    <SocialCardCell
                      userName={userName}
                      projectTitle={projectTitle}
                      image64={captureState.image64}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Popover>
        </div>
      )}
    </div>
  )
}

export default CaptureButton
