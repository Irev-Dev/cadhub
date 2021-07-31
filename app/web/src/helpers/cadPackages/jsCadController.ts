import {
  RenderArgs,
  DefaultKernelExport,
  createUnhealthyResponse,
  createHealthyResponse,
} from './common'
import {
  MeshPhongMaterial,
  LineBasicMaterial,
  BufferGeometry,
  BufferAttribute,
  Line,
  LineSegments,
  Color,
  Mesh,
  Group,
} from 'three/build/three.module'

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

function CSG2Object3D(obj) {
  const { vertices, indices, color, transforms } = obj

  const materialDef = materials[obj.type]
  if (!materialDef) {
    console.error('Can not hangle object type: ' + obj.type, obj)
    return null
  }

  let material = materialDef.def
  if (color) {
    const c = color
    material = new materialDef.material({
      color: new Color(c[0], c[1], c[2]),
      flatShading: true,
      opacity: c[3] === void 0 ? 1 : c[3],
      transparent: c[3] != 1 && c[3] !== void 0,
    })
  }

  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(vertices, 3))

  let mesh
  switch (obj.type) {
    case 'mesh':
      geo.setIndex(new BufferAttribute(indices, 1))
      mesh = new THREE.Mesh(geo, material)
      break
    case 'line':
      mesh = new Line(geo, material)
      break
    case 'lines':
      mesh = new LineSegments(geo, material)
      break
  }
  if (transforms) mesh.applyMatrix4({ elements: transforms })
  return mesh
}

let scriptWorker
const scriptUrl = '/demo-worker.js'
let resolveReference = null
let response = null

const callResolve = () => {
  if (resolveReference) resolveReference()
  resolveReference
}

export const render: DefaultKernelExport['render'] = async ({
  code,
  settings,
}: RenderArgs) => {
  if (!scriptWorker) {
    const baseURI = document.baseURI.toString()
    const script = `let baseURI = '${baseURI}'
importScripts(new URL('${scriptUrl}',baseURI))
let worker = jscadWorker({
  baseURI: baseURI,
  scope:'worker',
  convertToSolids: 'buffers',
  callback:(params)=>self.postMessage(params),
})
self.addEventListener('message', (e)=>worker.postMessage(e.data))
`
    const blob = new Blob([script], { type: 'text/javascript' })
    scriptWorker = new Worker(window.URL.createObjectURL(blob))
    scriptWorker.addEventListener('message', (e) => {
      console.log('message from worker', e.data)
      const data = e.data
      if (data.action == 'entities') {
        if (data.error) {
          response = createUnhealthyResponse(new Date(), data.error)
        } else {
          const group = new Group()
          data.entities
            .map(CSG2Object3D)
            .filter((o) => o)
            .forEach((o) => group.add(o))
          response = createHealthyResponse({
            type: 'geometry',
            data: group,
            consoleMessage: data.scriptStats,
            date: new Date(),
          })
        }
        callResolve()
      }
    })

    callResolve()
    response = null
    scriptWorker.postMessage({ action: 'init', baseURI, alias: [] })
  }
  scriptWorker.postMessage({
    action: 'runScript',
    worker: 'script',
    script: code,
    url: 'jscad_script',
  })

  const waitResult = new Promise((resolve) => {
    resolveReference = resolve
  })

  await waitResult
  resolveReference = null
  console.log('response', response)
  return response
}

const jsCadController: DefaultKernelExport = {
  render,
}

export default jsCadController
