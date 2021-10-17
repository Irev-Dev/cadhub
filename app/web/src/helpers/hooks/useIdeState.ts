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

export interface MosaicTree {
  first: string | MosaicTree
  second: string | MosaicTree
  direction?: string
  splitPercentage?: number
}

interface CodeTab {
  type: 'code'
  label: string
  content?: string
}

interface GuideTab {
  type: 'guide'
  label: string
  content: string
}

interface ComponentTab {
  type: 'component'
  label: string
  Component: React.FC
}

type EditorTab = GuideTab | CodeTab | ComponentTab

export interface State {
  ideType: 'INIT' | CadPackageType
  viewerContext: 'ide' | 'viewer'
  ideGuide?: string
  consoleMessages: { type: 'message' | 'error'; message: string; time: Date }[]
  code: string
  editorTabs: EditorTab[]
  currentModel: number
  objectData: {
    type: 'INIT' | ArtifactTypes
    data: any // eslint-disable-line @typescript-eslint/no-explicit-any
    quality: 'low' | 'high'
  }
  customizerParams: CadhubParams[]
  currentParameters?: RawCustomizerParams
  isCustomizerOpen: boolean
  layout: MosaicTree
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
const initialLayout: MosaicTree = {
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
  viewerContext: 'ide',
  consoleMessages: [
    { type: 'message', message: 'Initialising', time: new Date() },
  ],
  code,
  editorTabs: [{ type: 'code', label: 'Code' }],
  currentModel: 0,
  objectData: {
    type: 'INIT',
    data: null,
    quality: 'low',
  },
  customizerParams: [],
  isCustomizerOpen: false,
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
        viewerContext: payload.viewerContext,
      }
    case 'updateCode':
      return { ...state, code: payload }
    case 'resetCustomizer': {
      const resetParameters = {}
      state.customizerParams.forEach(({ name, initial }) => {
        resetParameters[name] = initial
      })
      return {
        ...state,
        currentParameters: resetParameters,
      }
    }
    case 'healthyRender': {
      const currentParameters = {}

      const customizerParams: CadhubParams[] = payload.customizerParams || []
      customizerParams.forEach((param) => {
        currentParameters[param.name] =
          typeof state?.currentParameters?.[param.name] === 'undefined'
            ? param.initial
            : state?.currentParameters?.[param.name]
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
    case 'setCustomizerOpenState':
      return {
        ...state,
        isCustomizerOpen: payload,
      }
    case 'setLayout':
      return {
        ...state,
        layout: payload,
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
    case 'settingsButtonClicked': {
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
    }
    case 'switchEditorModel':
      return {
        ...state,
        currentModel: payload,
      }
    case 'addEditorModel':
      return {
        ...state,
        editorTabs: [...state.editorTabs, payload],
      }
    case 'removeEditorModel':
      return {
        ...state,
        editorTabs: [
          ...state.editorTabs.slice(0, payload),
          ...state.editorTabs.slice(payload + 1),
        ],
        currentModel: payload === 0 ? 0 : payload - 1,
      }
    // 'updateEditorModel' and 'reorderEditorModels' added during #519 as part of adding editor tabs, this functionality is expected soon.
    // https://github.com/Irev-Dev/cadhub/pull/519
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

interface RequestRenderArgsStateless {
  state: State
  camera?: State['camera']
  viewerSize?: State['viewerSize']
  quality?: State['objectData']['quality']
  specialCadProcess?: string
  parameters?: { [key: string]: any }
}

export const requestRenderStateless = ({
  state,
  camera,
  viewerSize,
  quality = 'low',
  specialCadProcess = null,
  parameters,
}: RequestRenderArgsStateless): null | Promise<any> => {
  if (
    !(
      state.ideType !== 'INIT' &&
      (!state.isLoading || state.objectData?.type === 'INIT')
    )
  ) {
    return null
  }
  const renderFn = specialCadProcess
    ? cadPackages[state.ideType][specialCadProcess]
    : cadPackages[state.ideType].render
  return renderFn({
    code: state.code,
    settings: {
      parameters: state.isCustomizerOpen
        ? parameters || state.currentParameters
        : {},
      camera: camera || state.camera,
      viewerSize: viewerSize || state.viewerSize,
      quality,
    },
  })
}

interface RequestRenderArgs extends RequestRenderArgsStateless {
  dispatch: any
}

export const requestRender = ({ dispatch, ...rest }: RequestRenderArgs) => {
  const renderPromise = requestRenderStateless(rest)
  if (!renderPromise) {
    return
  }
  return renderPromise
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
