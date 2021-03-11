import { IdeContext } from 'src/components/IdeToolbarNew'
import { useRef, useState, useEffect, useContext, useMemo } from 'react'
import { Canvas, extend, useFrame, useThree } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

extend({ OrbitControls })

function Controls({ onCameraChange }) {
  const controls = useRef()
  const { scene, camera, gl } = useThree()
  useEffect(() => {
    // init camera position
    camera.position.x = 12
    camera.position.y = 12
    // Euler rotation can be problematic since order matters
    // We want it to rotate around the z or vertical axis first then the x axis
    // in Three Y is the vertical axis (Z for openscad)
    camera.rotation._order = 'YXZ'

    if (controls.current) {
      const callback = ({ target }) => {
        const getRotations = () => {
          const { x, y, z } = target.object.rotation
          const rad2Deg = 180 / Math.PI
          const scadX = (x + Math.PI / 2) * rad2Deg
          const scadZ = y * rad2Deg
          const scadY = z * rad2Deg
          return [scadX, scadY, scadZ]
        }
        const getPositions = () => {
          const { x: scadX, y: scadZ, z: negScadY } = target.object.position
          const scale = 10 // I'm not sure why this is exactly 10
          const scadY = -negScadY
          return [scadX * scale, scadY * scale, scadZ * scale]
        }
        const [rx, ry, rz] = getRotations()
        const [x, y, z] = getPositions()

        onCameraChange({
          position: { x, y, z },
          rotation: { x: rx, y: ry, z: rz },
        })
      }
      controls.current.addEventListener('end', callback)
      const oldCurrent = controls.current
      return () => oldCurrent.removeEventListener('end', callback)
    }
  }, [])

  useFrame(() => controls.current.update())
  return (
    <orbitControls
      ref={controls}
      args={[camera, gl.domElement]}
      enableDamping
      dampingFactor={0.1}
      rotateSpeed={0.5}
    />
  )
}

function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()

  return (
    <mesh {...props} ref={mesh} scale={[1, 1, 1]}>
      <boxBufferGeometry args={[props.size, props.size, props.size]} />
      <meshStandardMaterial color={props.color} />
    </mesh>
  )
}
let currentCode // I have no idea why this works and using state.code is the dispatch doesn't but it was always stale
const IdeViewer = () => {
  const { state, dispatch } = useContext(IdeContext)
  const [isDragging, setIsDragging] = useState(false)

  const image = useMemo(
    () =>
      state.objectData?.type === 'png' &&
      state.objectData?.data &&
      window.URL.createObjectURL(state.objectData?.data),
    [state.objectData]
  )
  currentCode = state.code
  return (
    <div className="p-8 border-2 m-2">
      <div className="pb-4">
        Rotating the Three.js Cube should than update the openscad camera to
        view the CAD object from the same angle. But having trouble translating
        between the two coordinate systems. OpenScad's camera only changes X and
        Z angles and Y is always 0. Where as rotation values from Three seem to
        change all x, y and z. I probably need to learn a bit more about 3d
        math.
      </div>
      <div className="relative" style={{ height: '500px', width: '500px' }}>
        {image && (
          <div
            className="absolute inset-0"
            style={{ opacity: isDragging ? '0%' : '100%' }}
          >
            <img src={image} className="" />
          </div>
        )}
        <div
          className={`opacity-0 absolute inset-0 ${
            isDragging ? 'opacity-100' : 'hover:opacity-50'
          }`}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
        >
          <Canvas>
            <Controls
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
            <Box position={[0, 0, 0]} size={10} color="orange" />
            <Box position={[0, 5, 0]} size={1} color="cyan" />
            <Box position={[0, 0, 5]} size={1} color="magenta" />
            <Box position={[5, 0, 0]} size={1} color="hotpink" />
          </Canvas>
        </div>
      </div>
    </div>
  )
}

export default IdeViewer
