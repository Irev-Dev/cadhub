import { useEffect, useState } from 'react'
import { toast } from '@redwoodjs/web/toast'
import { toJpeg } from 'html-to-image'

import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import { canvasToBlob, blobTo64 } from 'src/helpers/canvasToBlob'
import { useUpdateProjectImages } from 'src/helpers/hooks/useUpdateProjectImages'
import { requestRenderStateless } from 'src/helpers/hooks/useIdeState'
import { PureIdeViewer } from 'src/components/IdeViewer/PureIdeViewer'
import { State } from 'src/helpers/hooks/useIdeState'
import SocialCardCell from 'src/components/SocialCardCell/SocialCardCell'

export const captureSize = { width: 500, height: 522 }

const CaptureButtonViewer = ({
  onInit,
  onScadImage,
  canvasRatio = 1,
}: {
  onInit: (a: any) => void
  onScadImage: (a: any) => void
  canvasRatio: number
}) => {
  const { state } = useIdeContext()
  const threeInstance = React.useRef(null)
  const [dataType, dataTypeSetter] = useState(state?.objectData?.type)
  const [artifact, artifactSetter] = useState(state?.objectData?.data)
  const [ideType] = useState(state?.ideType)
  const [isLoading, isLoadingSetter] = useState(false)
  const [camera, cameraSetter] = useState<State['camera'] | null>(null)
  const getThreeInstance = (_threeInstance) => {
    threeInstance.current = _threeInstance
    onInit(_threeInstance)
  }
  const onCameraChange = (camera, isFirstCameraChange) => {
    const renderPromise =
      (state.ideType === 'openscad' || state.ideType === 'curv') &&
      requestRenderStateless({
        state,
        camera,
        viewerSize: {
          width: threeInstance.current.size.width * canvasRatio,
          height: threeInstance.current.size.height * canvasRatio,
        },
        viewAll: isFirstCameraChange,
      })
    if (!renderPromise) {
      return
    }
    isLoadingSetter(true)
    renderPromise.then(async ({ objectData, camera }) => {
      if (camera?.isScadUpdate) {
        cameraSetter(camera)
      }
      isLoadingSetter(false)
      dataTypeSetter(objectData?.type)
      artifactSetter(objectData?.data)
      if (objectData?.type === 'png') {
        onScadImage(await blobTo64(objectData?.data))
      }
    })
  }

  return (
    <PureIdeViewer
      scadRatio={canvasRatio}
      dataType={dataType}
      artifact={artifact}
      onInit={getThreeInstance}
      onCameraChange={onCameraChange}
      isLoading={isLoading}
      camera={camera}
      isMinimal
      ideType={ideType}
    />
  )
}

function TabContent() {
  return (
    <div className="bg-ch-gray-800 h-full overflow-y-auto px-8 pb-16">
      <IsolatedCanvas
        size={{ width: 500, height: 375 }}
        uploadKey="mainImage64"
        RenderComponent={ThumbnailViewer}
      />
      <IsolatedCanvas
        canvasRatio={2}
        size={captureSize}
        uploadKey="socialCard64"
        RenderComponent={SocialCardLiveViewer}
      />
    </div>
  )
}

function SocialCardLiveViewer({
  forwardRef,
  onUpload,
  children,
  partSnapShot64,
}) {
  const { project } = useIdeContext()
  return (
    <>
      <h3 className="text-2xl text-ch-gray-300 pt-4">Set social Image</h3>
      <div className="flex py-4">
        <div className="rounded-md shadow-ch border border-gray-400 overflow-hidden">
          <div
            className="transform scale-50 origin-top-left"
            style={{ width: '600px', height: '315px' }}
          >
            <div style={{ width: '1200px', height: '630px' }} ref={forwardRef}>
              <SocialCardCell
                userName={project.user.userName}
                projectTitle={project.title}
                image64={partSnapShot64}
              >
                {children}
              </SocialCardCell>
            </div>
          </div>
        </div>
      </div>
      <button className="bg-gray-200 p-2 rounded-sm" onClick={onUpload}>
        save image
      </button>
    </>
  )
}

function ThumbnailViewer({ forwardRef, onUpload, children, partSnapShot64 }) {
  return (
    <>
      <h3 className="text-2xl text-ch-gray-300 pt-4">Set thumbnail</h3>
      <div
        style={{ width: '500px', height: '375px' }}
        className="rounded-md shadow-ch border border-gray-400 overflow-hidden my-4"
      >
        <div className="h-full w-full relative" ref={forwardRef}>
          {children}
          {partSnapShot64 && (
            <img src={partSnapShot64} className="absolute inset-0" />
          )}
        </div>
      </div>
      <button className="bg-gray-200 p-2 rounded-sm" onClick={onUpload}>
        save thumbnail
      </button>
    </>
  )
}

function IsolatedCanvas({
  RenderComponent,
  canvasRatio = 1,
  size,
  uploadKey,
}: {
  canvasRatio?: number
  uploadKey: 'socialCard64' | 'mainImage64'
  size: {
    width: number
    height: number
  }
  RenderComponent: React.FC<{
    forwardRef: React.Ref<any>
    children: React.ReactNode
    partSnapShot64: string
    onUpload: (a: any) => void
  }>
}) {
  const { project } = useIdeContext()
  const { updateProjectImages } = useUpdateProjectImages({})
  const [partSnapShot64, partSnapShot64Setter] = React.useState('')
  const [scadSnapShot64, scadSnapShot64Setter] = React.useState('')

  const captureRef = React.useRef<HTMLDivElement>(null)

  const threeInstance = React.useRef(null)
  const onInit = (_threeInstance) => (threeInstance.current = _threeInstance)
  const upload = async () => {
    const uploadPromise = new Promise((resolve, reject) => {
      const asyncHelper = async () => {
        if (!scadSnapShot64) {
          partSnapShot64Setter(
            await blobTo64(await canvasToBlob(threeInstance.current, size))
          )
        } else {
          partSnapShot64Setter(scadSnapShot64)
        }

        setTimeout(async () => {
          const capturedImage = await toJpeg(captureRef.current, {
            cacheBust: true,
            quality: 0.7,
          })
          await updateProjectImages({
            variables: {
              id: project?.id,
              [uploadKey]: capturedImage,
            },
          })
          partSnapShot64Setter('')
          resolve(capturedImage)
        })
      }
      asyncHelper()
    })
    toast.promise(uploadPromise, {
      loading: 'Saving Image',
      success: (finalImg: string) => (
        <div className="flex flex-col items-center">
          <b className="py-2">Image saved!</b>
          <img src={finalImg} />
        </div>
      ),
      error: <b>Problem saving.</b>,
    })
  }

  return (
    <div>
      <RenderComponent
        forwardRef={captureRef}
        onUpload={upload}
        partSnapShot64={partSnapShot64}
      >
        <div
          style={{
            width: `${size.width * canvasRatio}px`,
            height: `${size.height * canvasRatio}px`,
          }}
        >
          <CaptureButtonViewer
            onInit={onInit}
            onScadImage={scadSnapShot64Setter}
            canvasRatio={canvasRatio}
          />
        </div>
      </RenderComponent>
    </div>
  )
}

export default function CaptureButton({ TheButton }) {
  const { state, thunkDispatch } = useIdeContext()

  return (
    <TheButton
      onClick={() => {
        thunkDispatch({
          type: 'addEditorModel',
          payload: {
            type: 'component',
            label: 'Social Media Card',
            Component: TabContent,
          },
        })
        thunkDispatch({
          type: 'switchEditorModel',
          payload: state.editorTabs.length,
        })
      }}
    />
  )
}
