import { IdeContext } from 'src/components/IdeToolbarNew'
import { useRef, useState, useEffect, useContext } from 'react'
import { Canvas, extend, useFrame, useThree } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

extend({ OrbitControls })

let debounceTimeoutId
function Controls({ onCameraChange, onDragStart }) {
  const controls = useRef()
  const { scene, camera, gl } = useThree()
  useEffect(() => {
    // init camera position
    camera.position.x = 16
    camera.position.y = 12
    camera.fov = 22.5 // matches default openscad fov

    // Order matters with Euler rotations
    // We want it to rotate around the z or vertical axis first then the x axis to match openscad
    // in Three.js Y is the vertical axis (Z for openscad)
    camera.rotation._order = 'YXZ'
    const getRotations = () => {
      const { x, y, z } = camera.rotation
      const rad2Deg = 180 / Math.PI
      const scadX = (x + Math.PI / 2) * rad2Deg
      const scadZ = y * rad2Deg
      const scadY = z * rad2Deg
      return [scadX, scadY, scadZ]
    }
    const getPositions = () => {
      const { x: scadX, y: scadZ, z: negScadY } = camera.position
      const scale = 10
      const scadY = -negScadY
      return [scadX * scale, scadY * scale, scadZ * scale]
    }

    if (controls.current) {
      const dragCallback = () => {
        clearTimeout(debounceTimeoutId)
        debounceTimeoutId = setTimeout(() => {
          const [rx, ry, rz] = getRotations()
          const [x, y, z] = getPositions()

          onCameraChange({
            position: { x, y, z },
            rotation: { x: rx, y: ry, z: rz },
          })
        }, 400)
      }
      const dragStart = () => {
        onDragStart()
        clearTimeout(debounceTimeoutId)
      }
      controls.current.addEventListener('end', dragCallback)
      controls.current.addEventListener('start', dragStart)
      const oldCurrent = controls.current
      dragCallback()
      return () => {
        oldCurrent.removeEventListener('end', dragCallback)
        oldCurrent.removeEventListener('start', dragStart)
      }
    }
  }, [])

  useFrame(() => controls.current.update())
  return (
    <orbitControls
      ref={controls}
      args={[camera, gl.domElement]}
      rotateSpeed={0.5}
    />
  )
}

function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()

  return (
    <mesh {...props} ref={mesh} scale={[1, 1, 1]}>
      <boxBufferGeometry args={props.size} />
      <meshStandardMaterial color={props.color} />
    </mesh>
  )
}
let currentCode // I have no idea why this works and using state.code is the dispatch doesn't but it was always stale
const IdeViewer = () => {
  const { state, dispatch } = useContext(IdeContext)
  const [isDragging, setIsDragging] = useState(false)
  const [image, setImage] = useState()

  useEffect(() => {
    setImage(
      state.objectData?.type === 'png' &&
        state.objectData?.data &&
        window.URL.createObjectURL(state.objectData?.data)
    )
    setIsDragging(false)
  }, [state.objectData])
  currentCode = state.code
  return (
    <div className="p-8 border-2 m-2">
      <div className="relative" style={{ height: '500px', width: '500px' }}>
        {state.isLoading && (
          <div className="inset-0 absolute flex items-center justify-center">
            <div className="h-16 w-16 bg-pink-600 rounded-full animate-ping"></div>
          </div>
        )}
        {image && (
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              isDragging ? 'opacity-25' : 'opacity-100'
            }`}
          >
            <img src={image} className="" />
          </div>
        )}
        <div
          className={`opacity-0 opacity- absolute inset-0 transition-opacity duration-500 ${
            isDragging ? 'opacity-100' : 'hover:opacity-50'
          }`}
          onMouseDown={() => setIsDragging(true)}
        >
          <Canvas>
            <Controls
              onDragStart={() => setIsDragging(true)}
              onCameraChange={({ position, rotation }) => {
                dispatch({
                  type: 'render',
                  payload: {
                    code: currentCode,
                    camera: {
                      position,
                      rotation,
                    },
                  },
                })
              }}
            />
            <ambientLight />
            <pointLight position={[15, 5, 10]} />
            <Box position={[0, 4.95, 0]} size={[0.1, 10, 0.1]} color="cyan" />
            <Box
              position={[0, 0, -5.05]}
              size={[0.1, 0.1, 10]}
              color="orange"
            />
            <Box
              position={[5.05, 0, 0]}
              size={[10, 0.1, 0.1]}
              color="hotpink"
            />
          </Canvas>
        </div>
      </div>
    </div>
  )
}

export default IdeViewer
