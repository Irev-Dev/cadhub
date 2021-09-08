import {
  RenderArgs,
  DefaultKernelExport,
  RenderResponse,
  createUnhealthyResponse,
  createHealthyResponse,
} from '../common'
import {
  MeshPhongMaterial,
  LineBasicMaterial,
  BufferGeometry,
  BufferAttribute,
  Line,
  LineSegments,
  Color,
  Mesh,
} from 'three'
import { jsCadToCadhubParams } from './jscadParams'
import TheWorker from 'worker-loader!./jscadWorker'

const materials = {
  mesh: {
    def: new MeshPhongMaterial({ color: 0x0084d1, flatShading: true }),
    material: (params) => new MeshPhongMaterial(params),
  },
  line: {
    def: new LineBasicMaterial({ color: 0x0000ff }),
    material: ({ color, opacity, transparent }) =>
      new LineBasicMaterial({ color, opacity, transparent }),
  },
  lines: null,
}
materials.lines = materials.line

interface CsgObj {
  vertices: Float32Array
  indices: Uint16Array
  color?: [number, number, number, number]
  transforms: number[]
  type: 'mesh' | 'line' | 'lines'
}

function CSGArray2R3fComponent(Csgs: CsgObj[]): React.ReactNode {
  return () =>
    Csgs.map(({ vertices, indices, color, transforms, type }, index) => {
      const materialDef = materials[type]
      if (!materialDef) {
        console.error('Can not hangle object type: ' + type, {
          vertices,
          indices,
          color,
          transforms,
          type,
        })
        return null
      }

      let material = materialDef.def
      if (color) {
        const [r, g, b, opacity] = color
        material = materialDef.material({
          color: new Color(r, g, b),
          flatShading: true,
          opacity: opacity === void 0 ? 1 : opacity,
          transparent: opacity != 1 && opacity !== void 0,
        })
      }

      const geo = new BufferGeometry()
      geo.setAttribute('position', new BufferAttribute(vertices, 3))

      let mesh
      switch (type) {
        case 'mesh':
          geo.setIndex(new BufferAttribute(indices, 1))
          mesh = new Mesh(geo, material)
          break
        case 'line':
          mesh = new Line(geo, material)
          break
        case 'lines':
          mesh = new LineSegments(geo, material)
          break
      }
      if (transforms) mesh.applyMatrix4({ elements: transforms })
      return <primitive object={mesh} key={index} />
    })
}

let scriptWorker

type ResolveFn = (RenderResponse) => void

class WorkerHelper {
  callResolve: null | ResolveFn = null
  previousCode = ''
  resolver = (response: RenderResponse) => {
    this.callResolve && this.callResolve(response)
    this.callResolve = null
  }
  render = (
    code: string,
    parameters: { [key: string]: any }
  ): Promise<RenderResponse> => {
    const response: Promise<RenderResponse> = new Promise(
      (resolve: ResolveFn) => {
        this.callResolve = resolve
      }
    )
    if (!(code && this.previousCode !== code)) {
      // we are not evaluating code, but reacting to parameters change
      scriptWorker.postMessage({
        action: 'updateParams',
        worker: 'script',
        params: parameters,
      })
    } else {
      scriptWorker.postMessage({
        action: 'runScript',
        worker: 'script',
        script: code,
        params: parameters || {},
        url: 'jscad_script',
      })
    }
    this.previousCode = code
    return response
  }
}
const workerHelper = new WorkerHelper()

export const render: DefaultKernelExport['render'] = async ({
  code,
  settings,
}: RenderArgs) => {
  if (!scriptWorker) {
    const baseURI = document.baseURI.toString()
    scriptWorker = new TheWorker()
    let parameterDefinitions = []
    scriptWorker.addEventListener('message', ({ data }) => {
      if (data.action == 'parameterDefinitions') {
        parameterDefinitions = data.data
      } else if (data.action == 'entities') {
        if (data.error) {
          workerHelper.resolver(createUnhealthyResponse(new Date(), data.error))
        } else {
          workerHelper.resolver(
            createHealthyResponse({
              type: 'r3f-component',
              data: CSGArray2R3fComponent(data.entities),
              consoleMessage: data.scriptStats,
              date: new Date(),
              customizerParams: jsCadToCadhubParams(parameterDefinitions || []),
            })
          )
        }
      }
    })

    workerHelper.resolver(null)
    scriptWorker.postMessage({ action: 'init', baseURI, alias: [] })
  }

  return workerHelper.render(code, settings.parameters)
}

const jsCadController: DefaultKernelExport = {
  render,
}

export default jsCadController
