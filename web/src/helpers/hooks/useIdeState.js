import { useReducer } from 'react'
import { renderOpenScad } from 'src/helpers/openScadController'

export const useIdeState = () => {
  const initialState = {
    ideType: 'openscad',
    consoleMessages: [
      { type: 'error', message: 'line 15 is being very naughty' },
      { type: 'message', message: '5 bodies produced' },
    ],
    code: 'cubie(60);',
    objectData: {
      type: 'stl',
      data: 'some binary',
    },
  }
  const reducer = (state, { type, payload }) => {
    switch (type) {
      case 'updateCode':
        return { ...state, code: payload }
      case 'healthyRender':
        return {
          ...state,
          objectData: {
            type: payload.objectData?.type,
            data: payload.objectData?.data,
          },
          consoleMessages: payload.message
            ? [...state.consoleMessages, payload.message]
            : payload.message,
        }
      case 'errorRender':
        return {
          ...state,
          consoleMessages: payload.message
            ? [...state.consoleMessages, payload.message]
            : payload.message,
        }
    }
  }

  function dispatchMiddleware(dispatch) {
    return ({ type, payload }) => {
      switch (type) {
        case 'render':
          renderOpenScad({ code: payload.code })
            .then(({ objectData, message }) =>
              dispatch({
                type: 'healthyRender',
                payload: { objectData, message },
              })
            )
            .catch(({ message }) =>
              dispatch({
                type: 'errorRender',
                payload: { message },
              })
            )
          break

        default:
          return dispatch({ type, payload })
      }
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)
  return [state, dispatchMiddleware(dispatch)]
}
