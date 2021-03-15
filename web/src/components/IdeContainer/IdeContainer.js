import { useContext, useRef, useEffect } from 'react'
import { Mosaic, MosaicWindow } from 'react-mosaic-component'
import { IdeContext } from 'src/components/IdeToolbarNew'
import IdeEditor from 'src/components/IdeEditor'
import IdeViewer from 'src/components/IdeViewer'
import IdeConsole from 'src/components/IdeConsole'
import 'react-mosaic-component/react-mosaic-component.css'

const ELEMENT_MAP = {
  Editor: <IdeEditor />,
  Viewer: <IdeViewer />,
  Console: <IdeConsole />,
}

const IdeContainer = () => {
  const { state, dispatch } = useContext(IdeContext)
  const viewerDOM = useRef(null)

  useEffect(handleViewerSizeUpdate, [viewerDOM])

  function handleViewerSizeUpdate() {
    if (viewerDOM !== null && viewerDOM.current) {
      const { width, height } = viewerDOM.current.getBoundingClientRect()
      dispatch({
        type: 'render',
        payload: {
          code: state.code,
          viewerSize: { width, height },
        },
      })
    }
  }

  return (
    <div id="cadhub-ide" className="h-screen">
      <Mosaic
        renderTile={(id, path) => (
          <MosaicWindow path={path} title={id} className={id.toLowerCase()}>
            {id === 'Viewer' ? (
              <div id="view-wrapper" className="h-full" ref={viewerDOM}>
                {ELEMENT_MAP[id]}
              </div>
            ) : (
              ELEMENT_MAP[id]
            )}
          </MosaicWindow>
        )}
        value={state.layout}
        onChange={(newLayout) =>
          dispatch({ type: 'setLayout', payload: { message: newLayout } })
        }
        onRelease={handleViewerSizeUpdate}
      />
    </div>
  )
}

export default IdeContainer
