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

const main = ({length=340}) => {
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

  const transpCube = colorize([1, 0, 0, 0.75], cuboid({ size: [100, 100, length] }))
  const star2D = star({ vertices: 8, innerRadius: 150, outerRadius: 200 })
  const line2D = colorize([1.0, 0, 0], line([[220, 220], [-220, 220], [-220, -220], [220, -220], [220, 220]]))

  return [transpCube, star2D, line2D, ...logo]
}
const getParameterDefinitions = ()=>{
  return [
    {type:'slider', name:'length', initial:340, caption:'Length', min:210, max:1500},
    { name: 'group1', type: 'group', caption: 'Group 1: Text Entry' },
    { name: 'text', type: 'text', initial: '', size: 20, maxLength: 20, caption: 'Plain Text:', placeholder: '20 characters' },
    { name: 'int', type: 'int', initial: 20, min: 1, max: 100, step: 1, caption: 'Integer:' },
    { name: 'number', type: 'number', initial: 2.0, min: 1.0, max: 10.0, step: 0.1, caption: 'Number:' },
    { name: 'date', type: 'date', initial: '2020-01-01', min: '2020-01-01', max: '2030-12-31', caption: 'Date:', placeholder: 'YYYY-MM-DD' },
    { name: 'email', type: 'email', initial: 'me@example.com', caption: 'Email:' },
    { name: 'url', type: 'url', initial: 'www.example.com', size: 40, maxLength: 40, caption: 'Url:', placeholder: '40 characters' },
    { name: 'password', type: 'password', initial: '', caption: 'Password:' },

    { name: 'group2', type: 'group', caption: 'Group 2: Interactive Controls' },
    { name: 'checkbox', type: 'checkbox', checked: true, initial: '20', caption: 'Checkbox:' },
    { name: 'color', type: 'color', initial: '#FFB431', caption: 'Color:' },
    { name: 'slider', type: 'slider', initial: 3, min: 1, max: 10, step: 1, caption: 'Slider:' },
    { name: 'choice1', type: 'choice', caption: 'Dropdown Menu:', values: [0, 1, 2, 3], captions: ['No', 'Yes', 'Maybe', 'So so'], initial: 2 },
    { name: 'choice3', type: 'choice', caption: 'Dropdown Menu:', values: ['No', 'Yes', 'Maybe', 'So so'], initial: 'No' },
    { name: 'choice2', type: 'radio', caption: 'Radio Buttons:', values:[0, 1, 2, 3], captions: ['No', 'Yes', 'Maybe', 'So so'], initial: 2 },

    { name: 'group3', type: 'group', initial: 'closed', caption: 'Group 3: Initially Closed Group' },
    { name: 'checkbox2', type: 'checkbox', checked: true, initial: '20', caption: 'Optional Checkbox:' },
  ]
}
module.exports = {main, getParameterDefinitions}
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
    lastParameters?: any
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
            customizerParams:
              payload.customizerParams || state.objectData.customizerParams,
            lastParameters: payload.lastParameters,
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
      parameters,
      settings: {
        camera,
        viewerSize,
        quality,
      },
    })
      .then(
        ({ objectData, message, status, customizerParams, lastParameters }) => {
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
                lastParameters,
              },
            })
            return objectData
          }
        }
      )
      .catch(() => dispatch({ type: 'resetLoading' })) // TODO should probably display something to the user here
  }
}
