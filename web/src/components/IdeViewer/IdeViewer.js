import { IdeContext } from 'src/components/IdeToolbarNew'
import { useRef, useState, useEffect, useContext } from 'react'
import { Canvas, extend, useFrame, useThree } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Vector3 } from 'three'

extend({ OrbitControls })

let debounceTimeoutId
function Controls({ onCameraChange, onDragStart }) {
  const controls = useRef()
  const { camera, gl } = useThree()
  useEffect(() => {
    // init camera position
    camera.position.x = 200
    camera.position.y = 140
    camera.position.z = 20
    camera.far = 10000
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
      // Difficult to make this clean since I'm not sure why it works
      // The OpenSCAD camera seems hard to work with but maybe it's just me

      // this gives us a vector the same length as the camera.position
      const cameraViewVector = new Vector3(0, 0, 1)
        .applyQuaternion(camera.quaternion) // make unit vector of the camera
        .multiplyScalar(camera.position.length()) // make it the same length as the position vector

      // make a vector from the position vector to the cameraView vector
      const head2Head = new Vector3().subVectors(
        camera.position,
        cameraViewVector
      )
      return {
        // I can't seem to get normal vector addition to work
        // but this works
        position: {
          x: camera.position.x + head2Head.x,
          y: -camera.position.z - head2Head.z,
          z: camera.position.y + head2Head.y,
        },
        dist: camera.position.length(),
      }
    }

    if (controls.current) {
      const dragCallback = () => {
        clearTimeout(debounceTimeoutId)
        debounceTimeoutId = setTimeout(() => {
          const [x, y, z] = getRotations()
          const { position, dist } = getPositions()

          onCameraChange({
            position,
            rotation: { x, y, z },
            dist,
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
function Sphere(props) {
  const mesh = useRef()
  return (
    <mesh {...props} ref={mesh} scale={[1, 1, 1]}>
      <sphereBufferGeometry args={[2, 30, 30]} />
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

  const openSCADDeepOceanThemeBackground = '#323232'
  // the following are tailwind colors in hex, can't use these classes to color three.js meshes.
  const pink400 = '#F472B6'
  const indigo300 = '#A5B4FC'
  const indigo900 = '#312E81'
  return (
    <div className="p-8 border-2 m-2">
      <div
        className="relative"
        style={{
          height: '500px',
          width: '500px',
          backgroundColor: openSCADDeepOceanThemeBackground,
        }}
      >
        {image && (
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              isDragging ? 'opacity-25' : 'opacity-100'
            }`}
          >
            <img src={image} className="" />
          </div>
        )}
        {state.isLoading && (
          <div className="inset-0 absolute flex items-center justify-center">
            <div className="h-16 w-16 bg-pink-600 rounded-full animate-ping"></div>
          </div>
        )}
        <div
          className={`opacity-0 absolute inset-0 transition-opacity duration-500 ${
            isDragging ? 'opacity-100' : 'hover:opacity-50'
          }`}
          onMouseDown={() => setIsDragging(true)}
        >
          <Canvas>
            <Controls
              onDragStart={() => setIsDragging(true)}
              onCameraChange={(camera) => {
                dispatch({
                  type: 'render',
                  payload: {
                    code: currentCode,
                    camera,
                  },
                })
              }}
            />
            <ambientLight />
            <pointLight position={[15, 5, 10]} />
            <Sphere position={[0, 0, 0]} color={pink400} />
            <Box position={[0, 50, 0]} size={[1, 100, 1]} color={indigo900} />
            <Box position={[0, 0, -50]} size={[1, 1, 100]} color={indigo300} />
            <Box position={[50, 0, 0]} size={[100, 1, 1]} color={pink400} />
          </Canvas>
        </div>
      </div>
    </div>
  )
}

export default IdeViewer
