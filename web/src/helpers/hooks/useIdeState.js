import { useReducer } from 'react'
import { cadPackages } from 'src/helpers/cadPackages'

export const useIdeState = () => {
  const initialState = {
    ideType: 'openScad',
    consoleMessages: [{ type: 'message', message: 'Initialising OpenSCAD' }],
    code: `difference(){
  union(){
    cube(60);
    sphere(25);
  }
  translate([30,30,30])cylinder(r=25,h=100);
}`,
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
    isLoading: false,
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
          isLoading: false,
        }
      case 'errorRender':
        return {
          ...state,
          consoleMessages: payload.message
            ? [...state.consoleMessages, payload.message]
            : payload.message,
          isLoading: false,
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
      case 'setLoading':
        return {
          ...state,
          isLoading: true,
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
          dispatch({ type: 'setLoading' })
          break

        default:
          return dispatch({ type, payload })
      }
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)
  return [state, dispatchMiddleware(dispatch, state)]
}
