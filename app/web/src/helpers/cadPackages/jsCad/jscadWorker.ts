const setPoints = (points, p, i) => {
  points[i++] = p[0]
  points[i++] = p[1]
  points[i++] = p[2] || 0
}

function CSG2Vertices(csg) {
  const idx = 0

  let vLen = 0,
    iLen = 0
  for (const poly of csg.polygons) {
    const len = poly.vertices.length
    vLen += len * 3
    iLen += 3 * (len - 2)
  }
  const vertices = new Float32Array(vLen)
  const indices = vLen > 65535 ? new Uint32Array(iLen) : new Uint16Array(iLen)

  let vertOffset = 0
  let indOffset = 0
  let posOffset = 0
  let first = 0
  for (const poly of csg.polygons) {
    const arr = poly.vertices
    const len = arr.length
    first = posOffset
    vertices.set(arr[0], vertOffset)
    vertOffset += 3
    vertices.set(arr[1], vertOffset)
    vertOffset += 3
    posOffset += 2
    for (let i = 2; i < len; i++) {
      vertices.set(arr[i], vertOffset)

      indices[indOffset++] = first
      indices[indOffset++] = first + i - 1
      indices[indOffset++] = first + i

      vertOffset += 3
      posOffset += 1
    }
  }
  return { vertices, indices, type: 'mesh' }
}

function CSG2LineVertices(csg) {
  let vLen = csg.points.length * 3
  if (csg.isClosed) vLen += 3

  const vertices = new Float32Array(vLen)

  csg.points.forEach((p, idx) => setPoints(vertices, p, idx * 3))

  if (csg.isClosed) {
    setPoints(vertices, csg.points[0], vertices.length - 3)
  }
  return { vertices, type: 'line' }
}

function CSG2LineSegmentsVertices(csg) {
  const vLen = csg.sides.length * 6

  const vertices = new Float32Array(vLen)
  csg.sides.forEach((side, idx) => {
    const i = idx * 6
    setPoints(vertices, side[0], i)
    setPoints(vertices, side[1], i + 3)
  })
  return { vertices, type: 'lines' }
}

function CSGCached(func, data, cacheKey, transferable) {
  cacheKey = cacheKey || data

  let geo = CSGToBuffers.cache.get(cacheKey)
  if (geo) return geo

  geo = func(data)

  // fill transferable array for postMessage optimization
  if (transferable) {
    const { vertices, indices } = geo
    transferable.push(vertices)
    if (indices) transferable.push(indices)
  }

  CSGToBuffers.cache.set(cacheKey, geo)
  return geo
}

function CSGToBuffers(csg, transferable) {
  let obj

  if (csg.polygons)
    obj = CSGCached(CSG2Vertices, csg, csg.polygons, transferable)
  if (csg.sides && !csg.points)
    obj = CSGCached(CSG2LineSegmentsVertices, csg, csg.sides, transferable)
  if (csg.points)
    obj = CSGCached(CSG2LineVertices, csg, csg.points, transferable)

  return obj
}
CSGToBuffers.clearCache = () => {
  CSGToBuffers.cache = new WeakMap()
}
CSGToBuffers.clearCache()

let workerBaseURI

function require(url) {
  url = require.alias[url] || url
  if (url[0] != '/' && url.substr(0, 2) != './' && url.substr(0, 4) != 'http')
    url = 'https://unpkg.com/' + url
  let exports = require.cache[url] //get from cache
  if (!exports) {
    //not cached
    const module = requireModule(url)
    require.cache[url] = exports = module.exports //cache obj exported by module
  }
  return exports //require returns object exported by module
}

function requireFile(url) {
  try {
    const X = new XMLHttpRequest()
    X.open('GET', new URL(url, workerBaseURI), 0) // sync
    X.send()
    if (X.status && X.status !== 200) throw new Error(X.statusText)
    return X.responseText
  } catch (e) {
    console.log(
      'problem loading url ',
      url,
      'base',
      workerBaseURI,
      ' error:',
      e.message
    )
    throw e
  }
}

function requireModule(url, source) {
  try {
    const exports = {}
    if (!source) source = requireFile(url)
    const module = { id: url, uri: url, exports: exports, source } //according to node.js modules
    // fix, add comment to show source on Chrome Dev Tools
    source = '//@ sourceURL=' + url + '\n' + source
    //------
    const anonFn = new Function('require', 'exports', 'module', source) //create a Fn with module code, and 3 params: require, exports & module
    anonFn(require, exports, module) // call the Fn, Execute the module
    return module
  } catch (err) {
    console.error('Error loading module ' + url, err.message)
    throw err
  }
}

require.cache = {}
require.alias = {}

const cmdHandler = (handlers) => (cmd) => {
  const fn = handlers[cmd.action]
  if (!fn) throw new Error('no handler for type: ' + cmd.action)
  fn(cmd)
}

function parseParams(script) {
  let lines = script.split('\n').map((l) => l.trim())

  lines = lines
    .map((l, i) => {
      return { code: l, line: i + 1, group: l[0] == '/' && !lines[i + 1] }
    })
    .filter((l) => l.code)

  let i = 0,
    line,
    next,
    lineNum
  while (i < lines.length) {
    line = lines[i].code.trim()
    i++
    if (line.length > 12 && line.substring(line.length - 13) == '//jscadparams')
      break
    if (line.length > 12 && line.indexOf('@jscad-params') != -1) break
  }

  let groupIndex = 1
  const defs = []

  while (i < lines.length) {
    line = lines[i].code
    lineNum = lines[i].line
    next = lines[i + 1] ? lines[i + 1].code : ''
    if (line[0] === '}') break

    if (line[0] === '/') {
      // group
      const def = parseComment(line, lineNum)
      let name = '_group_' + groupIndex++
      let caption = def.caption

      const idx = caption.lastIndexOf(':')
      if (idx !== -1) {
        name = caption.substring(idx + 1).trim()
        caption = caption.substring(0, idx).trim()
      }
      defs.push({ name, type: 'group', caption, ...def.options })
    } else {
      const idx = line.indexOf('/')
      if (idx === -1) {
        const def = parseDef(line, lineNum)
        def.caption = def.name
        defs.push(def)
      } else {
        defs.push(
          parseOne(
            line.substring(idx).trim(),
            line.substring(0, idx).trim(),
            lineNum,
            lineNum
          )
        )
      }
    }
    i++
  }

  return defs
}

function parseOne(comment, code, line1, line2) {
  const { caption, options } = parseComment(comment, line1)
  let def = { caption, ...parseDef(code, line2) }
  def.caption = def.caption || def.name
  if (options) {
    def = { ...def, ...options }
    if (def.type === 'checkbox' && def.hasOwnProperty('initial'))
      def.checked = true
    if (def.type === 'slider') {
      if (def.min === undefined) {
        def.min = 0
      }
      if (def.max === undefined) {
        def.max = def.initial * 2 || 100
      }
    }
  }

  return def
}

function parseComment(comment, line) {
  const prefix = comment.substring(0, 2)
  if (prefix === '//') comment = comment.substring(2)
  if (prefix === '/*') comment = comment.substring(2, comment.length - 2)

  comment = comment.trim()

  const ret = {}
  const idx = comment.indexOf('{')
  if (idx !== -1) {
    try {
      ret.options = eval('(' + comment.substring(idx) + ')')
    } catch (e) {
      console.log('Error in line ' + line)
      console.log(comment)
      throw e
    }
    comment = comment.substring(0, idx).trim()
  }

  ret.caption = comment

  return ret
}

function parseDef(code, line) {
  if (code[code.length - 1] == ',')
    code = code.substring(0, code.length - 1).trim()
  let idx = code.indexOf('=')

  if (idx == -1) idx = code.indexOf(':')

  if (idx == -1) {
    return { name: code, type: 'text' }
  } else {
    const initial = code.substring(idx + 1).trim()

    const ret = { type: 'text', name: code.substring(0, idx).trim() }

    if (initial === 'true' || initial === 'false') {
      ret.type = 'checkbox'
      ret.checked = initial === 'true'
    } else if (/^[0-9]+$/.test(initial)) {
      ret.type = 'int'
      ret.initial = parseFloat(initial)
    } else if (/^[0-9]+\.[0-9]+$/.test(initial)) {
      ret.type = 'number'
      ret.initial = parseFloat(initial)
    } else {
      try {
        ret.initial = eval(initial)
      } catch (e) {
        console.log('Error in line ' + line)
        console.log(code)
        console.log('problem evaluating inital value:', initial)
        e = new EvalError(e.message, 'code', line)
        e.lineNumber = line
        throw e
      }
    }

    return ret
  }
}

const makeScriptWorker = ({ callback, convertToSolids }) => {
  let onInit, main, scriptStats, entities

  function runMain(params = {}) {
    let time = Date.now()
    let solids
    const transfer = []
    try {
      const tmp = main(params)
      solids = []
      function flatten(arr) {
        if (arr) {
          if (arr instanceof Array) arr.forEach(flatten)
          else solids.push(arr)
        }
      }
      flatten(tmp)
    } catch (e) {
      callback(
        {
          action: 'entities',
          worker: 'render',
          error: e.message,
          stack: e.stack.toString(),
        },
        transfer
      )
      return
    }
    const solidsTime = Date.now() - time
    scriptStats = `generate solids ${solidsTime}ms`

    if (convertToSolids === 'buffers') {
      CSGToBuffers.clearCache()
      entities = solids
        .filter((s) => s)
        .map((csg) => {
          const obj = CSGToBuffers(csg, transfer)
          obj.color = csg.color
          obj.transforms = csg.transforms
          return obj
        })
    } else if (convertToSolids === 'regl') {
      const { entitiesFromSolids } = require('@jscad/regl-renderer')
      time = Date.now()
      entities = entitiesFromSolids({}, solids)
      scriptStats += ` convert to entities ${Date.now() - time}ms`
    } else {
      entities = solids
    }
    callback(
      { action: 'entities', worker: 'render', entities, scriptStats },
      transfer
    )
  }

  let initialized = false
  const handlers = {
    runScript: ({ script, url, params = {} }) => {
      if (!initialized) {
        onInit = () => handlers.runScript({ script, url, params })
      }
      let script_module
      try {
        script_module = requireModule(url, script)
      } catch (e) {
        callback({
          action: 'entities',
          worker: 'render',
          error: e.message,
          stack: e.stack.toString(),
        })
        return
      }
      main = script_module.exports.main
      const gp = script_module.exports.getParameterDefinitions
      const paramsDef = parseParams(script) || []
      if (gp) {
        gp().forEach((p) => {
          const idx = paramsDef.findIndex((old) => old.name == p.name)
          if (idx === -1) {
            paramsDef.push(p)
          } else {
            paramsDef.splice(idx, 1, p)
          }
        })
      }
      if (paramsDef.length)
        callback({
          action: 'parameterDefinitions',
          worker: 'main',
          data: paramsDef,
        })

      runMain(params)
    },
    updateParams: ({ params = {} }) => {
      runMain(params)
    },
    init: (params) => {
      let { baseURI, alias = [] } = params
      if (!baseURI && typeof document != 'undefined' && document.baseURI) {
        baseURI = document.baseURI
      }

      if (baseURI) workerBaseURI = baseURI.toString()

      alias.forEach((arr) => {
        const [orig, ...aliases] = arr
        aliases.forEach((a) => {
          require.alias[a] = orig
          if (a.toLowerCase().substr(-3) !== '.js')
            require.alias[a + '.js'] = orig
        })
      })
      initialized = true
      if (onInit) onInit()
    },
  }

  return {
    // called from outside to pass mesasges into worker
    postMessage: cmdHandler(handlers),
  }
}

/** Make render worker */

const makeRenderWorker = () => {
  let perspectiveCamera
  const state = {}

  const rotateSpeed = 0.002
  const panSpeed = 1
  const zoomSpeed = 0.08
  let rotateDelta = [0, 0]
  let panDelta = [0, 0]
  let zoomDelta = 0
  let updateRender = true
  let orbitControls, renderOptions, gridOptions, axisOptions, renderer

  let entities = []

  function createContext(canvas, contextAttributes) {
    function get(type) {
      try {
        return { gl: canvas.getContext(type, contextAttributes), type }
      } catch (e) {
        return null
      }
    }
    return (
      get('webgl2') ||
      get('webgl') ||
      get('experimental-webgl') ||
      get('webgl-experimental')
    )
  }

  const startRenderer = ({
    canvas,
    cameraPosition,
    cameraTarget,
    axis = {},
    grid = {},
  }) => {
    const {
      prepareRender,
      drawCommands,
      cameras,
      controls,
    } = require('@jscad/regl-renderer')

    perspectiveCamera = cameras.perspective
    orbitControls = controls.orbit

    state.canvas = canvas
    state.camera = { ...perspectiveCamera.defaults }
    if (cameraPosition) state.camera.position = cameraPosition
    if (cameraTarget) state.camera.target = cameraTarget

    resize({ width: canvas.width, height: canvas.height })

    state.controls = orbitControls.defaults

    const { gl, type } = createContext(canvas)
    // prepare the renderer
    const setupOptions = {
      glOptions: { gl },
    }
    if (type == 'webgl') {
      setupOptions.glOptions.optionalExtensions = ['oes_element_index_uint']
    }
    renderer = prepareRender(setupOptions)

    gridOptions = {
      visuals: {
        drawCmd: 'drawGrid',
        show: grid.show || grid.show === undefined,
        color: grid.color || [0, 0, 0, 1],
        subColor: grid.subColor || [0, 0, 1, 0.5],
        fadeOut: false,
        transparent: true,
      },
      size: grid.size || [200, 200],
      ticks: grid.ticks || [10, 1],
    }

    axisOptions = {
      visuals: {
        drawCmd: 'drawAxis',
        show: axis.show || axis.show === undefined,
      },
      size: axis.size || 100,
    }

    // assemble the options for rendering
    renderOptions = {
      camera: state.camera,
      drawCommands: {
        drawAxis: drawCommands.drawAxis,
        drawGrid: drawCommands.drawGrid,
        drawLines: drawCommands.drawLines,
        drawMesh: drawCommands.drawMesh,
      },
      // define the visual content
      entities: [gridOptions, axisOptions, ...entities],
    }
    // the heart of rendering, as themes, controls, etc change

    updateView()
  }

  let renderTimer
  const tmFunc =
    typeof requestAnimationFrame === 'undefined'
      ? setTimeout
      : requestAnimationFrame

  function updateView(delay = 8) {
    if (renderTimer || !renderer) return
    renderTimer = tmFunc(updateAndRender, delay)
  }

  const doRotatePanZoom = () => {
    if (rotateDelta[0] || rotateDelta[1]) {
      const updated = orbitControls.rotate(
        { controls: state.controls, camera: state.camera, speed: rotateSpeed },
        rotateDelta
      )
      state.controls = { ...state.controls, ...updated.controls }
      rotateDelta = [0, 0]
    }

    if (panDelta[0] || panDelta[1]) {
      const updated = orbitControls.pan(
        { controls: state.controls, camera: state.camera, speed: panSpeed },
        panDelta
      )
      state.controls = { ...state.controls, ...updated.controls }
      panDelta = [0, 0]
      state.camera.position = updated.camera.position
      state.camera.target = updated.camera.target
    }

    if (zoomDelta) {
      const updated = orbitControls.zoom(
        { controls: state.controls, camera: state.camera, speed: zoomSpeed },
        zoomDelta
      )
      state.controls = { ...state.controls, ...updated.controls }
      zoomDelta = 0
    }
  }

  const updateAndRender = (timestamp) => {
    renderTimer = null
    doRotatePanZoom()

    const updates = orbitControls.update({
      controls: state.controls,
      camera: state.camera,
    })
    state.controls = { ...state.controls, ...updates.controls }
    if (state.controls.changed) updateView(16) // for elasticity in rotate / zoom

    state.camera.position = updates.camera.position
    perspectiveCamera.update(state.camera)
    renderOptions.entities = [gridOptions, axisOptions, ...entities]
    const time = Date.now()
    renderer(renderOptions)
    if (updateRender) {
      updateRender = ''
    }
  }

  function resize({ width, height }) {
    state.canvas.width = width
    state.canvas.height = height
    perspectiveCamera.setProjection(state.camera, state.camera, {
      width,
      height,
    })
    perspectiveCamera.update(state.camera, state.camera)
    updateView()
  }

  const handlers = {
    pan: ({ dx, dy }) => {
      panDelta[0] += dx
      panDelta[1] += dy
      updateView()
    },
    rotate: ({ dx, dy }) => {
      rotateDelta[0] -= dx
      rotateDelta[1] -= dy
      updateView()
    },
    zoom: ({ dy }) => {
      zoomDelta += dy
      updateView()
    },
    resize,
    entities: (params) => {
      entities = params.entities
      updateRender = params.scriptStats
      updateView()
    },
    init: (params) => {
      if (params.canvas) startRenderer(params)
      initialized = true
    },
  }

  return {
    // called from outside to pass mesasges into worker
    postMessage: cmdHandler(handlers),
  }
}

function start(params) {
  const { callback = () => {}, convertToSolids = false } = params
  // by default 'render' messages go outside of this instance (result of modeling)
  let scriptWorker

  const sendCmd = (params, transfer) => {
    if (params.worker === 'script') scriptWorker.postMessage(params, transfer)
    else {
      callback(params, transfer)
    }
  }

  scriptWorker = makeScriptWorker({ callback: sendCmd, convertToSolids })
  callback({ action: 'workerInit', worker: 'main' })

  return {
    updateParams: ({ params = {} }) =>
      sendCmd({ action: 'updateParams', worker: 'script', params }),
    runScript: ({ script, url = '' }) =>
      sendCmd({ action: 'runScript', worker: 'script', script, url }),
    postMessage: sendCmd,
  }
}

const init = start({
  convertToSolids: 'buffers',
  callback: (params) => self.postMessage(params),
})

self.onmessage = ({ data }) => {
  if (data.action === 'init') {
    workerBaseURI = data.baseURI
  }
  init.postMessage(data, null)
}
