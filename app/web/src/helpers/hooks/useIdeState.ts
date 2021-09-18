import { useReducer } from 'react'
import { cadPackages } from 'src/helpers/cadPackages'
import type { RootState } from '@react-three/fiber'
import type {
  RawCustomizerParams,
  ArtifactTypes,
} from 'src/helpers/cadPackages/common'
import { CadhubParams } from 'src/components/Customizer/customizerConverter'

function withThunk(dispatch, getState) {
  return (actionOrThunk) =>
    typeof actionOrThunk === 'function'
      ? actionOrThunk(dispatch, getState)
      : dispatch(actionOrThunk)
}
import { CadPackageType } from 'src/components/CadPackage/CadPackage'

const initCodeMap: { [key in CadPackageType]: string } = {
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

const jscad = require('@jscad/modeling')
// https://openjscad.xyz/docs/module-modeling_primitives.html
const { cuboid, cylinder } = jscad.primitives

const { rotate, translate } = jscad.transforms
const { degToRad } = jscad.utils // because jscad uses radians for rotations
// https://openjscad.xyz/docs/module-modeling_booleans.html
const { subtract } = jscad.booleans

function main({//@jscad-params
    // Box example
    width=40, // Width
    length=20, // Length
    height=10, // Height
    hole=3,// Hole for cables diameter (0=no hole)
    wall=1, // wall {min:0.5, step:0.5}
    flip=0, // print orientation {type: 'choice', values: [0, 90, 180]}
}){

    let wallOffset = wall * 2
    let model = subtract(
        cuboid({size:[width, length, height]}),
        translate([0,0,wall], cuboid({size:[width-wallOffset, length-wallOffset, height+wall]})),
    )
    if(hole){
        model = subtract( model,
            translate([width/2-wall/2], rotate([0, degToRad(90), 0 ], cylinder({radius:hole/2, height:wall})))
        )
    }
    return rotate([degToRad(flip), 0, degToRad(90)], model)
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
  ideType: 'INIT' | CadPackageType
  consoleMessages: { type: 'message' | 'error'; message: string; time: Date }[]
  code: string
  objectData: {
    type: 'INIT' | ArtifactTypes
    data: any
    quality: 'low' | 'high'
  }
  customizerParams: CadhubParams[]
  currentParameters?: RawCustomizerParams
  layout: any
  camera: {
    dist?: number
    position?: XYZ
    rotation?: XYZ
  }
  viewerSize: { width: number; height: number }
  isLoading: boolean
  threeInstance: RootState
  sideTray: string[] // could probably be an array of a union type
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
  customizerParams: [],
  layout: initialLayout,
  camera: {},
  viewerSize: { width: 0, height: 0 },
  isLoading: false,
  threeInstance: null,
  sideTray: [],
}

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
      const customizerParams: CadhubParams[] = payload?.customizerParams?.length
        ? payload.customizerParams
        : state.customizerParams
      const currentParameters = {}
      customizerParams.forEach((param) => {
        currentParameters[param.name] =
          typeof state?.currentParameters?.[param.name] !== 'undefined'
            ? state?.currentParameters?.[param.name]
            : param.initial
      })
      return {
        ...state,
        objectData: {
          ...state.objectData,
          type: payload.objectData?.type,
          data: payload.objectData?.data,
        },
        customizerParams,
        currentParameters,
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
    case 'setCurrentCustomizerParams':
      if (!Object.keys(payload || {}).length) return state
      return {
        ...state,
        currentParameters: payload,
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
    case 'settingsButtonClicked':
      const isReClick =
        state.sideTray.length &&
        state.sideTray.length === payload.length &&
        state.sideTray.every((original, index) => original === payload[index])

      const payloadInOriginal =
        payload.length && state.sideTray.indexOf(payload[0])
      const isAncestorClick =
        state.sideTray.length &&
        state.sideTray.length > payload.length &&
        payloadInOriginal >= 0 &&
        payload.every(
          (incoming, i) => incoming === state.sideTray[i + payloadInOriginal]
        )

      if (isReClick) {
        return {
          ...state,
          sideTray: state.sideTray.slice(0, -1),
        }
      } else if (isAncestorClick) {
        return {
          ...state,
          sideTray: state.sideTray.slice(0, payload.length * -1 - 1),
        }
      }
      return {
        ...state,
        sideTray: payload,
      }
    default:
      return state
  }
}
export const useIdeState = (): [State, (actionOrThunk: any) => any] => {
  const [state, dispatch] = useReducer(reducer, initialState)
  mutableState = state
  const getState = (): State => mutableState
  const thunkDispatch = withThunk(dispatch, getState)
  return [state, thunkDispatch]
}

interface RequestRenderArgs {
  state: State
  dispatch: any
  parameters: any
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
  parameters,
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
        parameters,
        camera,
        viewerSize,
        quality,
      },
    })
      .then(
        ({
          objectData,
          message,
          status,
          customizerParams,
          currentParameters,
        }) => {
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
                currentParameters,
              },
            })
            return objectData
          }
        }
      )
      .catch(() => dispatch({ type: 'resetLoading' })) // TODO should probably display something to the user here
  }
}
