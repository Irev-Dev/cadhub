(function(f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f()
    } else if (typeof define === "function" && define.amd) {
        define([], f)
    } else {
        var g;
        if (typeof window !== "undefined") {
            g = window
        } else if (typeof global !== "undefined") {
            g = global
        } else if (typeof self !== "undefined") {
            g = self
        } else {
            g = this
        }
        g.jscadWorker = f()
    }
})(function() {
// multi purpose module



const setPoints = (points, p, i)=>{
  points[i++] = p[0]
  points[i++] = p[1]
  points[i++] = p[2] || 0         
}

function CSG2Vertices(csg){
    let idx = 0

    let vLen = 0, iLen = 0
    for (let poly of csg.polygons){
      let len = poly.vertices.length
      vLen += len *3
      iLen += 3 * (len-2)
    }
    const vertices = new Float32Array(vLen)
    const indices  = vLen > 65535 ? new Uint32Array(iLen) : new Uint16Array(iLen)

    let vertOffset = 0
    let indOffset = 0
    let posOffset = 0
    let first = 0
    for (let poly of csg.polygons){
      let arr = poly.vertices
      let len = arr.length
      first = posOffset
      vertices.set(arr[0], vertOffset)
      vertOffset +=3
      vertices.set(arr[1], vertOffset)
      vertOffset +=3
      posOffset  +=2
      for(let i=2; i<len; i++){
        vertices.set(arr[i], vertOffset)
          
          indices[indOffset++] = first
          indices[indOffset++] = first + i -1
          indices[indOffset++] = first + i 
          
          vertOffset += 3
          posOffset  += 1
      }
    }
    return {vertices, indices, type:'mesh'}
}


function CSG2LineVertices(csg){
  let vLen = csg.points.length * 3
  if(csg.isClosed) vLen += 3

  var vertices = new Float32Array(vLen)
  
  
  csg.points.forEach((p,idx)=>setPoints(vertices, p, idx * 3 ))
  
  if(csg.isClosed){
    setPoints(vertices, csg.points[0], vertices.length - 3 )
  }
  return {vertices, type:'line'}
}     

function CSG2LineSegmentsVertices(csg){
  let vLen = csg.sides.length * 6

  var vertices = new Float32Array(vLen)
  csg.sides.forEach((side,idx)=>{
    let i = idx * 6 
    setPoints(vertices, side[0], i)
    setPoints(vertices, side[1], i+3)
  })
  return {vertices, type:'lines'}

}

function CSGCached(func, data, cacheKey, transferable){
  cacheKey = cacheKey || data

  let geo = CSGToBuffers.cache.get(cacheKey)
  if(geo) return geo

  geo = func(data)

  // fill transferable array for postMessage optimization
  if(transferable){       
    const {vertices, indices} = geo
    transferable.push(vertices)
    if(indices) transferable.push(indices)
  }

    CSGToBuffers.cache.set(cacheKey, geo)
    return geo      
}

function CSGToBuffers(csg, transferable){
  let obj

  if(csg.polygons) obj = CSGCached(CSG2Vertices,csg,csg.polygons, transferable)
  if(csg.sides && !csg.points) obj = CSGCached(CSG2LineSegmentsVertices,csg,csg.sides, transferable)
  if(csg.points) obj = CSGCached(CSG2LineVertices,csg,csg.points, transferable)

  return obj
}
CSGToBuffers.clearCache = ()=>{CSGToBuffers.cache = new WeakMap()}
CSGToBuffers.clearCache()




let workerBaseURI

function require(url){
    url = require.alias[url] || url
    if(url[0] != '/' && url.substr(0,2) != './' && url.substr(0,4) != 'http') url = 'https://unpkg.com/'+url
    let exports=require.cache[url]; //get from cache
    if (!exports) { //not cached
      let module = requireModule(url)
      require.cache[url]  = exports = module.exports; //cache obj exported by module
    }
    return exports; //require returns object exported by module
}

function requireFile(url){
  try{
    let X=new XMLHttpRequest();
    X.open("GET", new URL(url,workerBaseURI), 0); // sync
    X.send();
    if (X.status && X.status !== 200)  throw new Error(X.statusText);
    return X.responseText;
  }catch(e){
    console.log('problem loading url ',url,'base',workerBaseURI,' error:',e.message)
    throw e
  }
}

function requireModule(url, source){
    try {
        const exports={};
        if(!source) source = requireFile(url)
        const module = { id: url, uri: url, exports:exports, source }; //according to node.js modules 
        // fix, add comment to show source on Chrome Dev Tools
        source="//@ sourceURL="+url+"\n" + source;
        //------
        const anonFn = new Function("require", "exports", "module", source); //create a Fn with module code, and 3 params: require, exports & module
        anonFn(require, exports, module); // call the Fn, Execute the module
        return module
    } catch (err) {
        console.error("Error loading module "+url, err.message);
        throw err;
    }
}

require.cache = {}  
require.alias = {}


const initCanvas = (canvas, callback)=>{

  // convert HTML events (mouse movement) to viewer changes
  let lastX = 0
  let lastY = 0

  let pointerDown = false

  const moveHandler = (ev) => {
    if(!pointerDown) return
    const cmd = {
      worker: 'render',
      dx: lastX - ev.pageX,
      dy: ev.pageY - lastY     
    }

    const shiftKey = (ev.shiftKey === true) || (ev.touches && ev.touches.length > 2)
    cmd.action = shiftKey ? 'pan':'rotate'
    callback(cmd)

    lastX = ev.pageX
    lastY = ev.pageY

    ev.preventDefault()
  }
  const downHandler = (ev) => {
    pointerDown = true
    lastX = ev.pageX
    lastY = ev.pageY
    canvas.setPointerCapture(ev.pointerId)
    ev.preventDefault()
  }

  const upHandler = (ev) => {
    pointerDown = false
    canvas.releasePointerCapture(ev.pointerId)
    ev.preventDefault()
  }

  const wheelHandler = (ev) => {
    callback({action:'zoom', dy:ev.deltaY, worker: 'render'})
    ev.preventDefault()
  }

  canvas.onpointermove = moveHandler
  canvas.onpointerdown = downHandler
  canvas.onpointerup = upHandler
  canvas.onwheel = wheelHandler
}

const cmdHandler = (handlers)=>(cmd)=>{
  const fn = handlers[cmd.action]
  if (!fn) throw new Error('no handler for type: ' + cmd.action)
  fn(cmd);
}









const makeScriptWorker = ({callback, convertToSolids})=>{
  let workerBaseURI, onInit

  function runMain(params={}){
    console.log('runMain');
    let time = Date.now()
    let solids = main(params)
    let solidsTime = Date.now() - time
    scriptStats = `generate solids ${solidsTime}ms`

    let transfer = []
    if(convertToSolids === 'buffers'){
      CSGToBuffers.clearCache()
      entities = solids.map((csg)=>CSGToBuffers(csg, transfer))
    }else if(convertToSolids === 'regl'){    
      const { entitiesFromSolids } = require('@jscad/regl-renderer')
      time = Date.now()
      entities = entitiesFromSolids({}, solids)
      scriptStats += ` convert to entities ${Date.now()-time}ms`
    }else{
      entities = solids
    }
    callback({action:'entities', worker:'render', entities, scriptStats}, transfer)
  }

  let initialized = false
  const handlers = {
    runScript: ({script,url, params={}})=>{
      if(!initialized){
        onInit = ()=>handlers.runScript({script,url, params})
      }    
      let script_module = requireModule(url,script)
      main = script_module.exports.main
      let gp = script_module.exports.getParameterDefinitions
      if(gp){
        callback({action:'parameterDefinitions', worker:'main', data:gp()})
      }
      runMain(params)
    },
    updateParams: ({params={}})=>{
      runMain(params)
    },
    init: (params)=>{
      let {baseURI, alias=[]} = params
      if(!baseURI && typeof document != 'undefined' && document.baseURI){
        baseURI = document.baseURI
      }
      
      if(baseURI) workerBaseURI = baseURI.toString()

      alias.forEach(arr=>{
        let [orig, ...aliases] = arr
        aliases.forEach(a=>{  
          require.alias[a] = orig
          if(a.toLowerCase().substr(-3)!=='.js') require.alias[a+'.js'] = orig
        })
      })
      initialized = true
      if(onInit) onInit()
    },
  }

  return {
    // called from outside to pass mesasges into worker
    postMessage: cmdHandler(handlers),
  }
}














/** Make render worker */

const makeRenderWorker = ()=>{
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

  function createContext (canvas, contextAttributes) {
    function get (type) {
      try {
        return {gl:canvas.getContext(type, contextAttributes), type}
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

  const startRenderer = ({canvas, cameraPosition, cameraTarget, axis={}, grid={}})=>{
    const { prepareRender, drawCommands, cameras, controls } = require('@jscad/regl-renderer')

    perspectiveCamera = cameras.perspective
    orbitControls = controls.orbit

    state.canvas = canvas
    state.camera = Object.assign({}, perspectiveCamera.defaults)
    if(cameraPosition) state.camera.position =  cameraPosition
    if(cameraTarget) state.camera.target   = cameraTarget

    resize({ width:canvas.width, height:canvas.height })

    state.controls = orbitControls.defaults

    const {gl, type} = createContext(canvas)
    // prepare the renderer
    const setupOptions = {
      glOptions: {gl}
    }
    if(type == 'webgl'){
        setupOptions.glOptions.optionalExtensions = ['oes_element_index_uint']      
    }
    renderer = prepareRender(setupOptions)

    gridOptions = {
      visuals: {
        drawCmd: 'drawGrid',
        show: grid.show || grid.show === undefined ,
        color: grid.color || [0, 0, 0, 1],
        subColor: grid.subColor || [0, 0, 1, 0.5],
        fadeOut: false,
        transparent: true
      },
      size: grid.size || [200, 200],
      ticks: grid.ticks || [10, 1]
    }

    axisOptions = {
      visuals: {
        drawCmd: 'drawAxis',
        show: axis.show || axis.show === undefined 
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
        drawMesh: drawCommands.drawMesh
      },
      // define the visual content
      entities: [
        gridOptions,
        axisOptions,
        ...entities
      ]
    }
    // the heart of rendering, as themes, controls, etc change

    updateView()
  }

  let renderTimer
  const tmFunc = typeof requestAnimationFrame === 'undefined' ? setTimeout : requestAnimationFrame

  function updateView(delay=8){
    if(renderTimer || !renderer) return
    renderTimer = tmFunc(updateAndRender,delay)
  }

  const doRotatePanZoom = () => {

    if (rotateDelta[0] || rotateDelta[1]) {
      const updated = orbitControls.rotate({ controls: state.controls, camera: state.camera, speed: rotateSpeed }, rotateDelta)
      state.controls = { ...state.controls, ...updated.controls }
      rotateDelta = [0, 0]
    }

    if (panDelta[0] || panDelta[1]) {
      const updated = orbitControls.pan({ controls:state.controls, camera:state.camera, speed: panSpeed }, panDelta)
      state.controls = { ...state.controls, ...updated.controls }
      panDelta = [0, 0]
      state.camera.position = updated.camera.position
      state.camera.target = updated.camera.target
    }

    if (zoomDelta) {
      const updated = orbitControls.zoom({ controls:state.controls, camera:state.camera, speed: zoomSpeed }, zoomDelta)
      state.controls = { ...state.controls, ...updated.controls }
      zoomDelta = 0
    }
  }

  const updateAndRender = (timestamp) => {
    renderTimer = null
    doRotatePanZoom()

    const updates = orbitControls.update({ controls: state.controls, camera: state.camera })
    state.controls = { ...state.controls, ...updates.controls }
    if(state.controls.changed) updateView(16) // for elasticity in rotate / zoom

    state.camera.position = updates.camera.position
    perspectiveCamera.update(state.camera)
    renderOptions.entities = [
      gridOptions,
      axisOptions,
      ...entities
    ]
    let time = Date.now()
    renderer(renderOptions)
    if(updateRender){
      console.log(updateRender, ' first render', Date.now()-time);
      updateRender = '';
    }
  }

  function resize({width,height}){  
    state.canvas.width = width
    state.canvas.height = height
    perspectiveCamera.setProjection(state.camera, state.camera, { width, height })
    perspectiveCamera.update(state.camera, state.camera)
    updateView()
  }

  const handlers = {
    pan: ({dx,dy})=>{
      panDelta[0] += dx
      panDelta[1] += dy
      updateView()  
    },
    rotate: ({dx,dy})=>{
      rotateDelta[0] -= dx
      rotateDelta[1] -= dy
      updateView()
    },
    zoom: ({dy})=>{
      zoomDelta += dy
      updateView()
    },
    resize,
    entities: (params)=>{
      entities = params.entities
      updateRender = params.scriptStats
      updateView()
    },
    init: (params)=>{
      if(params.canvas) startRenderer(params)
      initialized = true
    },
  }

  return {
    // called from outside to pass mesasges into worker
    postMessage: cmdHandler(handlers),
  }
}










return (params)=>{
  let { canvas, baseURI=(typeof document === 'undefined') ? '':document.location.toString(), scope='main', renderInWorker, render, callback=()=>{}, scriptUrl='demo-worker.js', alias, convertToSolids=false } = params
  // by default 'render' messages go outside of this instance (result of modeling)
  let sendToRender = callback
  let scriptWorker, renderWorker
  workerBaseURI = baseURI

  const sendCmd = (params, transfer)=>{
    if(params.worker === 'render') 
      sendToRender(params, transfer)
    else if(params.worker === 'script')
      scriptWorker.postMessage(params, transfer)
    else{
      // parameter definitions will arrive from scriptWorker
      callback(params, transfer)
    }
  }

  const updateSize = function({width,height}){
    sendCmd({ action:'resize', worker:'render', width: canvas.offsetWidth, height: canvas.offsetHeight})
  }


  renderInWorker = !!(canvas && renderInWorker && canvas.transferControlToOffscreen)
  const makeRenderWorkerHere = (scope === 'main' && canvas && !renderInWorker) || (scope === 'worker' && render)
  // worker is in current thread
  if(makeRenderWorkerHere){
    console.log('render in scope: '+scope);
    renderWorker = makeRenderWorker({callback:sendCmd})
    sendToRender = (params, transfer)=>renderWorker.postMessage(params, transfer)
  } 

  if(scope === 'main'){
//    let extraScript = renderInWorker ? `,'https://unpkg.com/@jscad/regl-renderer'`:''
    let script =`let baseURI = '${baseURI}'
importScripts(new URL('${scriptUrl}',baseURI))
let worker = jscadWorker({
  baseURI: baseURI,
  convertToSolids: ${convertToSolids},
  scope:'worker', 
  callback:(params)=>self.postMessage(params), 
  render:${renderInWorker}
})
self.addEventListener('message', (e)=>worker.postMessage(e.data))
`
    let blob = new Blob([script],{type: 'text/javascript'})
    scriptWorker = new Worker(window.URL.createObjectURL(blob))
    scriptWorker.addEventListener('message',(e)=>sendCmd(e.data))
    scriptWorker.postMessage({action:'init', baseURI, alias})
    if(renderInWorker) renderWorker = scriptWorker

    if(canvas){
      initCanvas(canvas, sendCmd)
      window.addEventListener('resize',updateSize)
    }
  }else{
    scriptWorker = makeScriptWorker({callback:sendCmd, convertToSolids})
    callback({action:'workerInit',worker:'main'})
  }

  if(canvas){  
    // redirect 'render' messages to renderWorker
    sendToRender = (params, transfer)=>renderWorker.postMessage(params, transfer)
    let width  = canvas.width  = canvas.clientWidth
    let height = canvas.height = canvas.clientHeight
    if(scope == 'main'){
      const offscreen = renderInWorker ? canvas.transferControlToOffscreen() : canvas
      renderWorker.postMessage({action:'init', worker:'render', canvas:offscreen, width, height}, [offscreen])
    }
  }

  return {  
    updateSize,
    updateParams:({params={}})=>sendCmd({ action:'updateParams', worker:'script', params}),
    runScript: ({script,url=''})=>sendCmd({ action:'runScript', worker:'script', script, url}),
    postMessage: sendCmd,
  }
}


// multi purpose module
});
