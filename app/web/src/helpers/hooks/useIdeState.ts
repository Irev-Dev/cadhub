import { useReducer } from 'react'
import { cadPackages } from 'src/helpers/cadPackages'
import type { RootState } from '@react-three/fiber'

function withThunk(dispatch, getState) {
  return (actionOrThunk) =>
    typeof actionOrThunk === 'function'
      ? actionOrThunk(dispatch, getState)
      : dispatch(actionOrThunk)
}

export type CadPackage = 'openscad' | 'cadquery' | 'jscad'

const initCodeMap: { [key in CadPackage]: string } = {
  openscad: `// involute donut

// ^ first comment is used for download title (i.e "involute-donut.stl")

// Follow the OpenSCAD tutorial: https://learn.cadhub.xyz/docs/

radius=3;
color(c="DarkGoldenrod")rotate_extrude()translate([20,0])circle(d=30);
color(c="hotpink")rotate_extrude()translate([20,0])offset(radius)offset(-radius)difference(){
    circle(d=34);
    translate([-200,-500])square([500,500]);
}`,
  cadquery: `# demo shaft coupler

# ^ first comment is used for download title (i.e. "demo-shaft-coupler.stl")

# CadQuery docs: https://cadquery.readthedocs.io/

import cadquery as cq
from cadquery import exporters

diam = 5.0

result = (cq.Workplane().circle(diam).extrude(20.0)
          .faces(">Z").workplane(invert=True).circle(1.05).cutBlind(8.0)
          .faces("<Z").workplane(invert=True).circle(0.8).cutBlind(12.0)
          .edges("%CIRCLE").chamfer(0.15))

show_object(result)
`,
  jscad: `
const { booleans, colors, primitives } = require('@jscad/modeling') // modeling comes from the included MODELING library

const { intersect, subtract } = booleans
const { colorize } = colors
const { cube, cuboid, line, sphere, star } = primitives

const main = ({scale=1}) => {
  const logo = [
    colorize([1.0, 0.4, 1.0], subtract(
      cube({ size: 300 }),
      sphere({ radius: 200 })
    )),
    colorize([1.0, 1.0, 0], intersect(
      sphere({ radius: 130 }),
      cube({ size: 210 })
    ))
  ]

  const transpCube = colorize([1, 0, 0, 0.75], cuboid({ size: [100 * scale, 100, 210 + (200 * scale)] }))
  const star2D = star({ vertices: 8, innerRadius: 150, outerRadius: 200 })
  const line2D = colorize([1.0, 0, 0], line([[220, 220], [-220, 220], [-220, -220], [220, -220], [220, 220]]))

  return [transpCube, star2D, line2D, ...logo]
}
module.exports = {main}
`,
}

const codeStorageKey = 'Last-editor-code'
export const makeCodeStoreKey = (ideType) => `${codeStorageKey}-${ideType}`
let mutableState: State = null

interface XYZ {
  x: number
  y: number
  z: number
}

export interface State {
  ideType: 'INIT' | CadPackage
  consoleMessages: { type: 'message' | 'error'; message: string; time: Date }[]
  code: string
  objectData: {
    type: 'INIT' | 'stl' | 'png' | 'geometry'
    data: any
    quality: 'low' | 'high'
    customizerParams?: any
  }
  layout: any
  camera: {
    dist?: number
    position?: XYZ
    rotation?: XYZ
  }
  viewerSize: { width: number; height: number }
  isLoading: boolean
  threeInstance: RootState
}

const code = ''
const initialLayout = {
  direction: 'row',
  first: 'Editor',
  second: {
    direction: 'column',
    first: 'Viewer',
    second: 'Console',
    splitPercentage: 70,
  },
}

export const initialState: State = {
  ideType: 'INIT',
  consoleMessages: [
    { type: 'message', message: 'Initialising', time: new Date() },
  ],
  code,
  objectData: {
    type: 'INIT',
    data: null,
    quality: 'low',
  },
  layout: initialLayout,
  camera: {},
  viewerSize: { width: 0, height: 0 },
  isLoading: false,
  threeInstance: null,
}

export const useIdeState = (): [State, (actionOrThunk: any) => any] => {
  const reducer = (state: State, { type, payload }): State => {
    switch (type) {
      case 'initIde':
        return {
          ...state,
          code:
            payload.code ||
            // localStorage.getItem(makeCodeStoreKey(payload.cadPackage)) ||
            initCodeMap[payload.cadPackage] ||
            '',
          ideType: payload.cadPackage,
        }
      case 'updateCode':
        return { ...state, code: payload }
      case 'healthyRender':
        return {
          ...state,
          objectData: {
            ...state.objectData,
            type: payload.objectData?.type,
            data: payload.objectData?.data,
            customizerParams: payload.customizerParams,
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
      case 'resetLayout':
        return {
          ...state,
          layout: initialLayout,
        }
      case 'setThreeInstance':
        return {
          ...state,
          threeInstance: payload,
        }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)
  mutableState = state
  const getState = (): State => mutableState
  const thunkDispatch = withThunk(dispatch, getState)
  return [state, thunkDispatch]
}

interface RequestRenderArgs {
  state: State
  dispatch: any
  code: State['code']
  camera: State['camera']
  viewerSize: State['viewerSize']
  quality?: State['objectData']['quality']
  specialCadProcess?: string
}

export const requestRender = ({
  state,
  dispatch,
  code,
  camera,
  viewerSize,
  quality = 'low',
  specialCadProcess = null,
}: RequestRenderArgs) => {
  if (
    state.ideType !== 'INIT' &&
    (!state.isLoading || state.objectData?.type === 'INIT')
  ) {
    const renderFn = specialCadProcess
      ? cadPackages[state.ideType][specialCadProcess]
      : cadPackages[state.ideType].render
    return renderFn({
      code,
      settings: {
        camera,
        viewerSize,
        quality,
      },
    })
      .then(({ objectData, message, status, customizerParams }) => {
        if (status === 'error') {
          dispatch({
            type: 'errorRender',
            payload: { message },
          })
        } else {
          dispatch({
            type: 'healthyRender',
            payload: {
              objectData,
              message,
              lastRunCode: code,
              customizerParams,
            },
          })
          return objectData
        }
      })
      .catch(() => dispatch({ type: 'resetLoading' })) // TODO should probably display something to the user here
  }
}
