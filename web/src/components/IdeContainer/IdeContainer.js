import { useContext, useRef, useEffect } from 'react'
import { Mosaic, MosaicWindow } from 'react-mosaic-component'
import { IdeContext } from 'src/components/IdeToolbarNew'
import { requestRender } from 'src/helpers/hooks/useIdeState'
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
  const { state, thunkDispatch } = useContext(IdeContext)
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
        if (state.ideType === 'openScad') {
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
              renderToolbar={() => (
                <div
                  className="text-xs text-gray-400 pl-4 w-full py-px font-bold leading-loose border-b border-gray-700"
                  style={{ backgroundColor: 'rgb(55,55,55)' }}
                >
                  {id}
                  {id === 'Editor' && ` (${state.ideType})`}
                </div>
              )}
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
