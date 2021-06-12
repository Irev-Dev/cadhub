import { makeCodeStoreKey } from 'src/helpers/hooks/useIdeState'
import { requestRender } from 'src/helpers/hooks/useIdeState'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'

export const useRender = () => {
  const { state, thunkDispatch } = useIdeContext()
  return () => {
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
}
