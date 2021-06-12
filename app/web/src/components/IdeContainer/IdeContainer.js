import { useRef, useEffect } from 'react'
import { Mosaic, MosaicWindow } from 'react-mosaic-component'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import { requestRender } from 'src/helpers/hooks/useIdeState'
import IdeEditor from 'src/components/IdeEditor'
import IdeViewer from 'src/components/IdeViewer'
import IdeConsole from 'src/components/IdeConsole'
import 'react-mosaic-component/react-mosaic-component.css'
import EditorMenu from 'src/components/EditorMenu/EditorMenu'

const ELEMENT_MAP = {
  Editor: <IdeEditor />,
  Viewer: <IdeViewer />,
  Console: <IdeConsole />,
}

const IdeContainer = () => {
  const { state, thunkDispatch } = useIdeContext()
  const viewerDOM = useRef(null)
  const debounceTimeoutId = useRef

  useEffect(handleViewerSizeUpdate, [viewerDOM])

  function handleViewerSizeUpdate() {
    if (viewerDOM !== null && viewerDOM.current) {
      const { width, height } = viewerDOM.current.getBoundingClientRect()
      thunkDispatch({
        type: 'updateViewerSize',
        payload: { viewerSize: { width, height } },
      })
      thunkDispatch((dispatch, getState) => {
        const state = getState()
        if (['png', 'INIT'].includes(state.objectData?.type)) {
          dispatch({ type: 'setLoading' })
          requestRender({
            state,
            dispatch,
            code: state.code,
            viewerSize: { width, height },
            camera: state.camera,
          })
        }
      })
    }
  }

  const debouncedViewerSizeUpdate = () => {
    clearTimeout(debounceTimeoutId.current)
    debounceTimeoutId.current = setTimeout(() => {
      handleViewerSizeUpdate()
    }, 1000)
  }

  useEffect(() => {
    window.addEventListener('resize', debouncedViewerSizeUpdate)
    return () => {
      window.removeEventListener('resize', debouncedViewerSizeUpdate)
    }
  }, [])

  return (
    <div id="cadhub-ide" className="mosaic-toolbar-overrides flex-auto h-full">
      <Mosaic
        renderTile={(id, path) => {
          return (
            <MosaicWindow
              path={path}
              renderToolbar={() =>
                id === 'Editor' ? (
                  <div className="w-full">
                    <EditorMenu />
                  </div>
                ) : (
                  <div /> // needs an empty element, otherwise it adds it's own toolbar
                )
              }
              className={`${id.toLowerCase()} ${id.toLowerCase()}-tile`}
            >
              {id === 'Viewer' ? (
                <div id="view-wrapper" className="h-full" ref={viewerDOM}>
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
