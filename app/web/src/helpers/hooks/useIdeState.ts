import { useReducer } from 'react'
import { cadPackages, initCodeMap, initGuideMap } from 'src/helpers/cadPackages'
import type { RootState } from '@react-three/fiber'
import type {
  RawCustomizerParams,
  ArtifactTypes,
} from 'src/helpers/cadPackages/common'
import { CadhubParams } from 'src/components/Customizer/customizerConverter'
import { CadPackageType } from 'src/components/CadPackage/CadPackage'

function withThunk(dispatch, getState) {
  return (actionOrThunk) =>
    typeof actionOrThunk === 'function'
      ? actionOrThunk(dispatch, getState)
      : dispatch(actionOrThunk)
}

const codeStorageKey = 'Last-editor-code'
export const makeCodeStoreKey = (ideType) => `${codeStorageKey}-${ideType}`
let mutableState: State = null

interface XYZ {
  x: number
  y: number
  z: number
}

interface EditorModel {
  type: 'code' | 'guide'
  label: string
  content?: string
}

export interface State {
  ideType: 'INIT' | CadPackageType
  ideGuide?: string
  consoleMessages: { type: 'message' | 'error'; message: string; time: Date }[]
  code: string
  models: EditorModel[]
  currentModel: number
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
  models: [{ type: 'code', label: 'Code' }],
  currentModel: 0,
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
        ideGuide: initGuideMap[payload.cadPackage],
      }
    case 'updateCode':
      return { ...state, code: payload }
    case 'healthyRender':
      const customizerParams: CadhubParams[] = payload.customizerParams
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
    case 'switchEditorModel':
      return {
        ...state,
        currentModel: payload,
      }
    case 'addEditorModel':
      return {
        ...state,
        models: [...state.models, payload],
      }
    case 'removeEditorModel':
      return {
        ...state,
        models: [
          ...state.models.slice(0, payload),
          ...state.models.slice(payload + 1),
        ],
        currentModel: payload === 0 ? 0 : payload - 1,
      }
    // case 'updateEditorModel': {
    //   const newModels = [...state.models]
    //   newModels[state.currentModel].content = payload
    //   return {
    //     ...state,
    //     models: newModels,
    //   }
    // }
    // case 'reorderEditorModels': {
    //   const newModels = [
    //     ...state.models.slice(0, state.currentModel),
    //     ...state.models.slice(state.currentModel + 1),
    //   ].splice(payload, 0, state.models[state.currentModel])
    //   return {
    //     ...state,
    //     models: newModels,
    //     currentModel: payload,
    //   }
    // }
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
