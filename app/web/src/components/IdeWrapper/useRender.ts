import { makeCodeStoreKey, requestRender } from 'src/helpers/hooks/useIdeState'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'

export const useRender = () => {
  const { state, thunkDispatch } = useIdeContext()
  return (disableParams = false) => {
    thunkDispatch((dispatch, getState) => {
      const state = getState()
      dispatch({ type: 'setLoading' })
      requestRender({
        state,
        dispatch,
        parameters: disableParams ? {} : state.currentParameters,
      })
    })
    localStorage.setItem(makeCodeStoreKey(state.ideType), state.code)
  }
}
