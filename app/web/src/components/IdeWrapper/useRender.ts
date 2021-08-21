import { makeCodeStoreKey, requestRender } from 'src/helpers/hooks/useIdeState'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'

export const useRender = () => {
  const { state, thunkDispatch } = useIdeContext()
  return (paramOverrides: {[key: string]: any} = {}) => {
    thunkDispatch((dispatch, getState) => {
      const state = getState()
      dispatch({ type: 'setLoading' })
      requestRender({
        state,
        dispatch,
        code: state.code,
        viewerSize: state.viewerSize,
        camera: state.camera,
        parameters: {
          ...state.currentParameters,
          ...paramOverrides,
        },
      })
    })
    localStorage.setItem(makeCodeStoreKey(state.ideType), state.code)
  }
}
