import { makeCodeStoreKey } from 'src/helpers/hooks/useIdeState'
import { requestRender } from 'src/helpers/hooks/useIdeState'
import { useContext } from 'react'
import { IdeContext } from 'src/components/IdeToolbarNew/IdeToolbarNew'

export const handleRenderVerbose = ({thunkDispatch, state}) => {
  thunkDispatch((dispatch, getState) => {
    const state = getState()
    dispatch({ type: 'setLoading' })
    requestRender({
      state,
      dispatch,
      code: state.code,
      viewerSize: state.viewerSize,
      camera: state.camera,
    })
  })
  localStorage.setItem(makeCodeStoreKey(state.ideType), state.code)
}

export const useRender = () => {
  const { state, thunkDispatch } = useContext(IdeContext)
  return () => handleRenderVerbose({thunkDispatch, state})
}

