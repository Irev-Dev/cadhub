import { useReducer } from 'react'
import { cadPackages } from 'src/helpers/cadPackages'

function withThunk(dispatch, getState) {
  return (actionOrThunk) =>
    typeof actionOrThunk === 'function'
      ? actionOrThunk(dispatch, getState)
      : dispatch(actionOrThunk)
}

const initCodeMap = {
  openScad: `
color(c="DarkGoldenrod")rotate_extrude()translate([20,0])circle(d=30);
donut();
module donut() {
    for(i=[1:360]){
        rotate(i*13.751)stick(20,i*1.351);
    }
}
module stick(basewid, angl){
    translate([basewid,0,0])rotate([angl,angl,angl*2])color(c="hotpink")hull(){
        sphere(7);
        translate([0,0,10])sphere(9);
    }
}`,
  cadQuery: `import cadquery as cq
from cadquery import exporters

diam = 5.0

result = (cq.Workplane().circle(diam).extrude(20.0)
          .faces(">Z").workplane(invert=True).circle(1.05).cutBlind(8.0)
          .faces("<Z").workplane(invert=True).circle(0.8).cutBlind(12.0)
          .edges("%CIRCLE").chamfer(0.15))

show_object(result)
`,
}

export const codeStorageKey = 'Last-editor-code'
let mutableState = null

export const useIdeState = () => {
  const code = localStorage.getItem(codeStorageKey) || initCodeMap.openscad
  const initialState = {
    ideType: 'INIT',
    consoleMessages: [
      { type: 'message', message: 'Initialising', time: new Date() },
    ],
    code,
    objectData: {
      type: 'stl',
      data: null,
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
    camera: {},
    viewerSize: { width: 0, height: 0 },
    isLoading: false,
  }
  const reducer = (state, { type, payload }) => {
    switch (type) {
      case 'initIde':
        return {
          ...state,
          code: initCodeMap[payload.cadPackage] || initCodeMap.openscad,
          ideType: payload.cadPackage,
        }
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
      case 'setLayout':
        return {
          ...state,
          layout: payload.message,
        }
      case 'updateCamera':
        return {
          ...state,
          camera: payload.camera,
        }
      case 'updateViewerSize':
        return {
          ...state,
          viewerSize: payload.viewerSize,
        }
      case 'setLoading':
        return {
          ...state,
          isLoading: true,
        }
      case 'resetLoading':
        return {
          ...state,
          isLoading: false,
        }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)
  mutableState = state
  const getState = () => mutableState
  return [state, withThunk(dispatch, getState)]
}

export const requestRender = ({
  state,
  dispatch,
  code,
  camera,
  viewerSize,
}) => {
  state.ideType !== 'INIT' &&
    !state.isLoading &&
    cadPackages[state.ideType]
      .render({
        code,
        settings: {
          camera,
          viewerSize,
        },
      })
      .then(({ objectData, message, status }) => {
        if (status === 'error') {
          dispatch({
            type: 'errorRender',
            payload: { message },
          })
        } else {
          dispatch({
            type: 'healthyRender',
            payload: { objectData, message, lastRunCode: code },
          })
        }
      })
      .catch(() => dispatch({ type: 'resetLoading' })) // TODO should probably display something to the user here
}
