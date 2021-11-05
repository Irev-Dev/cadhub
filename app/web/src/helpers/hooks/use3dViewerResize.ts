import { useRef, useEffect } from 'react'
import { useIdeContext } from './useIdeContext'
import { requestRender } from './useIdeState'

export const use3dViewerResize = () => {
  const viewerDomRef = useRef(null)
  const debounceTimeoutId = useRef<number>()
  const { thunkDispatch } = useIdeContext()

  useEffect(handleViewerSizeUpdate, [viewerDomRef])

  function handleViewerSizeUpdate() {
    if (viewerDomRef !== null && viewerDomRef.current) {
      const { width, height } = viewerDomRef.current.getBoundingClientRect()
      thunkDispatch({
        type: 'updateViewerSize',
        payload: { viewerSize: { width, height } },
      })
      thunkDispatch((dispatch, getState) => {
        const state = getState()
        if (state.objectData?.type === 'png') {
          dispatch({ type: 'setLoading' })
          requestRender({
            state,
            dispatch,
            viewerSize: { width, height },
            viewAll: state.objectData?.type === 'INIT',
          })
        }
      })
    }
  }
  const debouncedViewerSizeUpdate = () => {
    clearTimeout(debounceTimeoutId.current)
    debounceTimeoutId.current = setTimeout(() => {
      handleViewerSizeUpdate()
    }, 1000) as unknown as number
  }

  useEffect(() => {
    window.addEventListener('resize', debouncedViewerSizeUpdate)
    return () => {
      window.removeEventListener('resize', debouncedViewerSizeUpdate)
    }
  }, [])
  return {
    viewerDomRef,
    handleViewerSizeUpdate,
  }
}
