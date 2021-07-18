import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Vector3 } from 'three'
import { requestRender } from 'src/helpers/hooks/useIdeState'
import texture from './dullFrontLitMetal.png'
import { TextureLoader } from 'three/src/loaders/TextureLoader'

const loader = new TextureLoader()
const colorMap = loader.load(texture)

extend({ OrbitControls })

function Asset({ geometry: incomingGeo }) {
  const mesh = useRef()
  const ref = useRef<any>({})
  useLayoutEffect(() => {
    if (incomingGeo?.attributes) {
      ref.current.attributes = incomingGeo.attributes
    }
  }, [incomingGeo])
  if (!incomingGeo) return null
  return (
    <mesh ref={mesh} scale={[1, 1, 1]}>
      <bufferGeometry attach="geometry" ref={ref} />
      <meshStandardMaterial map={colorMap} color="#F472B6" />
    </mesh>
  )
}

let debounceTimeoutId
function Controls({ onCameraChange, onDragStart, onInit }) {
  const controls = useRef<any>()
  const threeInstance = useThree()
  const { camera, gl } = threeInstance
  useEffect(() => {
    onInit(threeInstance)
    // init camera position
    camera.position.x = 200
    camera.position.y = 140
    camera.position.z = 20
    camera.far = 10000
    camera.fov = 22.5 // matches default openscad fov
    camera.updateProjectionMatrix()

    // Order matters with Euler rotations
    // We want it to rotate around the z or vertical axis first then the x axis to match openscad
    // in Three.js Y is the vertical axis (Z for openscad)
    camera.rotation._order = 'YXZ'
    const getRotations = () => {
      const { x, y, z } = camera?.rotation || {}
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
      controls?.current?.addEventListener('end', dragCallback)
      controls?.current?.addEventListener('start', dragStart)
      const oldCurrent = controls.current
      dragCallback()
      return () => {
        oldCurrent.removeEventListener('end', dragCallback)
        oldCurrent.removeEventListener('start', dragStart)
      }
    }
  }, [])

  useFrame(() => controls.current?.update())
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

const IdeViewer = ({ Loading }) => {
  const { state, thunkDispatch } = useIdeContext()
  const [isDragging, setIsDragging] = useState(false)
  const [image, setImage] = useState()

  const onInit = (threeInstance) => {
    thunkDispatch({ type: 'setThreeInstance', payload: threeInstance })
  }

  useEffect(() => {
    setImage(state.objectData?.type === 'png' && state.objectData?.data)
    setIsDragging(false)
  }, [state.objectData?.type, state.objectData?.data])

  // the following are tailwind colors in hex, can't use these classes to color three.js meshes.
  const pink400 = '#F472B6'
  const indigo300 = '#A5B4FC'
  const indigo900 = '#312E81'
  return (
    <div className="relative h-full bg-ch-gray-800">
      {state.isLoading && Loading}
      {image && (
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            isDragging ? 'opacity-25' : 'opacity-100'
          }`}
        >
          <img
            alt="code-cad preview"
            id="special"
            src={URL.createObjectURL(image)}
            className="h-full w-full"
          />
        </div>
      )}
      <div // eslint-disable-line jsx-a11y/no-static-element-interactions
        className={`opacity-0 absolute inset-0 transition-opacity duration-500 ${
          !(isDragging || state.objectData?.type !== 'png')
            ? 'hover:opacity-50'
            : 'opacity-100'
        }`}
        onMouseDown={() => setIsDragging(true)}
      >
        <Canvas>
          <Controls
            onDragStart={() => setIsDragging(true)}
            onInit={onInit}
            onCameraChange={(camera) => {
              thunkDispatch({
                type: 'updateCamera',
                payload: { camera },
              })
              thunkDispatch((dispatch, getState) => {
                const state = getState()
                if (['png', 'INIT'].includes(state.objectData?.type)) {
                  dispatch({ type: 'setLoading' })
                  requestRender({
                    state,
                    dispatch,
                    code: state.code,
                    viewerSize: state.viewerSize,
                    camera,
                  })
                }
              })
            }}
          />
          <ambientLight intensity={1} />
          <pointLight position={[15, 5, 10]} intensity={4} />
          <pointLight position={[-1000, -1000, -1000]} intensity={1} />
          <pointLight position={[-1000, 0, 1000]} intensity={1} />
          {state.objectData?.type === 'png' && (
            <>
              <Sphere position={[0, 0, 0]} color={pink400} />
              <Box position={[0, 50, 0]} size={[1, 100, 1]} color={indigo900} />
              <Box
                position={[0, 0, -50]}
                size={[1, 1, 100]}
                color={indigo300}
              />
              <Box position={[50, 0, 0]} size={[100, 1, 1]} color={pink400} />
            </>
          )}
          <Asset
            geometry={
              state.objectData?.type === 'geometry' && state.objectData?.data
            }
          />
        </Canvas>
      </div>
      {state.isLoading && (
        <div className="inset-0 absolute flex items-center justify-center">
          <div className="h-16 w-16 bg-pink-600 rounded-full animate-ping"></div>
        </div>
      )}
    </div>
  )
}

export default IdeViewer
