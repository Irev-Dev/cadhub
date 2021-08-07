import { makeCodeStoreKey, requestRender } from 'src/helpers/hooks/useIdeState'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import type { RawCustomizerParams } from 'src/helpers/cadPackages/common'

export const useRender = () => {
  const { state, thunkDispatch } = useIdeContext()
  return (parameters?: RawCustomizerParams) => {
    thunkDispatch((dispatch, getState) => {
      const state = getState()
      dispatch({ type: 'setLoading' })
      requestRender({
        state,
        dispatch,
        code: state.code,
        viewerSize: state.viewerSize,
        camera: state.camera,
        parameters,
      })
    })
    localStorage.setItem(makeCodeStoreKey(state.ideType), state.code)
  }
}
