import { Suspense, lazy } from 'react'
import { Mosaic, MosaicWindow } from 'react-mosaic-component'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import IdeConsole from 'src/components/IdeConsole'
import 'react-mosaic-component/react-mosaic-component.css'
import EditorMenu from 'src/components/EditorMenu/EditorMenu'
import PanelToolbar from 'src/components/PanelToolbar/PanelToolbar'
import { use3dViewerResize } from 'src/helpers/hooks/use3dViewerResize'

const IdeEditor = lazy(() => import('src/components/IdeEditor/IdeEditor'))
const IdeViewer = lazy(() => import('src/components/IdeViewer/IdeViewer'))

const SmallLoadingPing = (
  <div className="bg-ch-gray-800 text-gray-200 font-ropa-sans relative w-full h-full flex justify-center items-center">
    <div className="relative">
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="h-4 w-4 bg-purple-600 rounded-full animate-ping"></div>
      </div>
      <div className="relative">. . . loading</div>
    </div>
  </div>
)

export const BigLoadingPing = (
  <div className="inset-0 absolute flex items-center justify-center bg-ch-gray-800">
    <div className="h-16 w-16 bg-pink-600 rounded-full animate-ping"></div>
  </div>
)

const ELEMENT_MAP = {
  Editor: (
    <Suspense fallback={SmallLoadingPing}>
      <IdeEditor Loading={SmallLoadingPing} />
    </Suspense>
  ),
  Viewer: (
    <Suspense fallback={BigLoadingPing}>
      <IdeViewer Loading={BigLoadingPing} />
    </Suspense>
  ),
  Console: <IdeConsole />,
}

const TOOLBAR_MAP = {
  Editor: (
    <div className="w-full">
      <EditorMenu />
    </div>
  ),
  Viewer: (
    <div>
      <PanelToolbar panelName="Viewer" />
    </div>
  ),
  Console: (
    <div>
      <PanelToolbar panelName="Console" showTopGradient />
    </div>
  ),
}

const IdeContainer = () => {
  const { viewerDomRef, handleViewerSizeUpdate } = use3dViewerResize()

  const { state, thunkDispatch } = useIdeContext()

  return (
    <div
      id="cadhub-ide"
      className="mosaic-toolbar-overrides flex-auto h-full bg-red-500"
    >
      <Mosaic
        renderTile={(id, path) => {
          return (
            <MosaicWindow
              path={path}
              renderToolbar={() => TOOLBAR_MAP[id]}
              className={`${id.toLowerCase()} ${id.toLowerCase()}-tile`}
            >
              {id === 'Viewer' ? (
                <div id="view-wrapper" className="h-full" ref={viewerDomRef}>
                  {ELEMENT_MAP[id]}
                </div>
              ) : (
                ELEMENT_MAP[id]
              )}
            </MosaicWindow>
          )
        }}
        value={state.layout}
        onChange={(newLayout) =>
          thunkDispatch({ type: 'setLayout', payload: { message: newLayout } })
        }
        onRelease={handleViewerSizeUpdate}
      />
    </div>
  )
}

export default IdeContainer
