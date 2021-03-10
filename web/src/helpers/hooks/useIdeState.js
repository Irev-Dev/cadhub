import { useReducer } from 'react'
import { cadPackages } from 'src/helpers/cadPackages'

export const useIdeState = () => {
  const initialState = {
    ideType: 'openScad',
    consoleMessages: [
      { type: 'error', message: 'line 15 is being very naughty' },
      { type: 'message', message: '5 bodies produced' },
    ],
    code: 'cube(60);sphere(25);',
    objectData: {
      type: 'stl',
      data: 'some binary',
    },
    layout: {
      direction: 'row',
      first: 'Editor',
      second: {
        direction: 'column',
        first: 'Viewer',
        second: 'Console',
        splitPercentage: 70,
      },
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
      case 'setIdeType':
        return {
          ...state,
          ideType: payload.message,
        }
      case 'updateLayout':
        return {
          ...state,
          layout: payload.message,
        }
      default:
        return state
    }
  }

  function dispatchMiddleware(dispatch, state) {
    return ({ type, payload }) => {
      switch (type) {
        case 'render':
          cadPackages[state.ideType]
            .render({
              code: payload.code,
              settings: { camera: payload.camera },
            })
            .then(({ objectData, message, isError }) => {
              if (isError) {
                dispatch({
                  type: 'errorRender',
                  payload: { message },
                })
              } else {
                dispatch({
                  type: 'healthyRender',
                  payload: { objectData, message },
                })
              }
            })
          break

        default:
          return dispatch({ type, payload })
      }
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)
  return [state, dispatchMiddleware(dispatch, state)]
}
