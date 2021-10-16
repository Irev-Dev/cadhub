import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import * as THREE from 'three'
import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import {
  PerspectiveCamera,
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  useTexture,
} from '@react-three/drei'
import { useEdgeSplit } from 'src/helpers/hooks/useEdgeSplit'
import { Vector3 } from 'three'
import { requestRender } from 'src/helpers/hooks/useIdeState'
import texture from './dullFrontLitMetal.png'
import Customizer from 'src/components/Customizer/Customizer'
import DelayedPingAnimation from 'src/components/DelayedPingAnimation/DelayedPingAnimation'
import type { ArtifactTypes } from 'src/helpers/cadPackages/common'
import { State } from 'src/helpers/hooks/useIdeState'

const thresholdAngle = 12

function Asset({
  geometry: incomingGeo,
  dataType,
  controlsRef,
}: {
  geometry: any // eslint-disable-line @typescript-eslint/no-explicit-any
  dataType: 'INIT' | ArtifactTypes
  controlsRef: React.MutableRefObject<any> // eslint-disable-line @typescript-eslint/no-explicit-any
}) {
  const threeInstance = useThree()
  const [initZoom, setInitZoom] = useState(true)
  const mesh = useEdgeSplit((thresholdAngle * Math.PI) / 180, true, incomingGeo)
  const edges = React.useMemo(
    () =>
      incomingGeo.length || dataType !== 'geometry'
        ? null
        : new THREE.EdgesGeometry(incomingGeo, thresholdAngle),
    [incomingGeo, dataType]
  )
  React.useEffect(() => {
    const getBoundingSphere = () => {
      if (dataType === 'geometry') {
        return incomingGeo.boundingSphere
      }
      const group = new THREE.Group()
      incomingGeo.forEach((mesh) => group.add(mesh))
      const bbox = new THREE.Box3().setFromObject(group)
      return bbox.getBoundingSphere(new THREE.Sphere())
    }
    const bSphere = getBoundingSphere()

    const zoomToFit = () => {
      const { center, radius } = bSphere
      const { camera } = threeInstance
      const offset = 3
      controlsRef.current.reset()
      controlsRef.current.target.copy(center)

      camera.position.copy(
        center
          .clone()
          .add(
            new THREE.Vector3(
              offset * radius,
              -offset * radius,
              offset * radius
            )
          )
      )
      camera.updateProjectionMatrix()
    }
    if (initZoom) {
      if (!bSphere) return
      zoomToFit()
      setInitZoom(false)
    }
  }, [incomingGeo, dataType, controlsRef, initZoom, threeInstance])
  const PrimitiveArray = React.useMemo(
    () =>
      dataType === 'primitive-array' &&
      incomingGeo?.map((mesh) => mesh.clone()),
    [dataType, incomingGeo]
  )
  const colorMap = useTexture(texture)

  if (!incomingGeo) return null
  if (PrimitiveArray)
    return PrimitiveArray.map((mesh, index) => (
      <primitive object={mesh} key={index} />
    ))

  return (
    <group dispose={null}>
      <mesh ref={mesh} scale={[1, 1, 1]} geometry={incomingGeo}>
        <meshPhysicalMaterial
          envMapIntensity={0.1}
          color="#F472B6"
          map={colorMap}
          clearcoat={0.1}
          clearcoatRoughness={0.2}
          roughness={10}
          metalness={0.7}
          smoothShading
        />
      </mesh>
      <lineSegments geometry={edges} renderOrder={100}>
        <lineBasicMaterial color="#aaaaff" opacity={0.5} transparent />
      </lineSegments>
    </group>
  )
}

let debounceTimeoutId
function Controls({
  onCameraChange,
  onDragStart,
  onInit,
  controlsRef,
  camera: scadCamera,
}: {
  onCameraChange: Function
  onDragStart: (a: any) => void
  onInit: Function
  controlsRef: React.MutableRefObject<any>
  camera: State['camera']
}) {
  const threeInstance = useThree()
  const { camera, gl } = threeInstance
  useEffect(() => {
    // setup three to openscad camera sync

    onInit(threeInstance)
    // init camera position
    camera.position.x = 80
    camera.position.y = 50
    camera.position.z = 50
    camera.far = 10000
    camera.fov = 22.5 // matches default openscad fov
    camera.updateProjectionMatrix()

    camera.rotation._order = 'ZYX'
    const getRotations = (): number[] => {
      const { x, y, z } = camera?.rotation || {}
      return [x, y, z].map((rot) => (rot * 180) / Math.PI)
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
      const { x, y, z } = head2Head.add(camera.position)
      return {
        position: { x: x / 2, y: y / 2, z: z / 2 },
        dist: camera.position.length() / 2,
      }
    }

    if (controlsRef.current) {
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
      controlsRef?.current?.addEventListener('end', dragCallback)
      controlsRef?.current?.addEventListener('start', dragStart)
      const oldCurrent = controlsRef.current
      dragCallback()
      return () => {
        oldCurrent.removeEventListener('end', dragCallback)
        oldCurrent.removeEventListener('start', dragStart)
      }
    }
  }, [camera, controlsRef])

  useEffect(() => {
    if (!scadCamera?.isScadUpdate || !scadCamera?.position) {
      return
    }
    // sync Three camera to OpenSCAD
    const { x, y, z } = scadCamera.position || {}
    const scadCameraPos = new Vector3(x * 2, y * 2, z * 2)
    const cameraViewVector = new Vector3(0, 0, 1)
    const { x: rx, y: ry, z: rz } = scadCamera.rotation || {}
    const scadCameraEuler = new THREE.Euler(
      ...[rx, ry, rz].map((r) => (r * Math.PI) / 180),
      'YZX'
    ) // I don't know why it seems to like 'YZX' order
    cameraViewVector.applyEuler(scadCameraEuler)
    cameraViewVector.multiplyScalar(scadCamera.dist * 2)

    const scadToThreeCameraPosition = new Vector3().subVectors(
      // I have no idea why this works
      cameraViewVector.clone().add(scadCameraPos),
      cameraViewVector
    )
    scadToThreeCameraPosition.multiplyScalar(
      scadCamera.dist / scadToThreeCameraPosition.length()
    )
    camera.position.copy(scadToThreeCameraPosition.clone())
    camera.updateProjectionMatrix()
  }, [scadCamera, camera])

  return (
    <OrbitControls
      makeDefault
      ref={controlsRef}
      args={[camera, gl.domElement]}
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

export function PureIdeViewer({
  dataType,
  artifact,
  onInit,
  onCameraChange,
  isLoading,
  isMinimal = false,
  scadRatio = 1,
  camera,
}: {
  dataType: 'INIT' | ArtifactTypes
  artifact: any
  isLoading: boolean
  onInit: Function
  onCameraChange: Function
  isMinimal?: boolean
  scadRatio?: number
  camera?: State['camera']
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [image, setImage] = useState()
  const controlsRef = useRef<any>()

  useEffect(() => {
    setImage(dataType === 'png' && artifact)
    setIsDragging(false)
  }, [dataType, artifact])

  // the following are tailwind colors in hex, can't use these classes to color three.js meshes.
  const pink400 = '#F472B6'
  const indigo300 = '#A5B4FC'
  const indigo900 = '#312E81'
  const jscadLightIntensity = dataType === 'primitive-array' ? 0.5 : 1.1
  return (
    <div className="relative h-full bg-ch-gray-800 cursor-grab">
      {image && (
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            isDragging ? 'opacity-25' : 'opacity-100'
          }`}
          style={{
            transform: `translate(${
              scadRatio !== 1 ? '-250px, -261px' : '0px, 0px'
            })`,
          }}
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
          !(isDragging || dataType !== 'png')
            ? 'hover:opacity-50'
            : 'opacity-100'
        }`}
        onMouseDown={() => setIsDragging(true)}
      >
        <Canvas linear={true} dpr={[1, 2]}>
          <Controls
            onDragStart={() => setIsDragging(true)}
            onInit={onInit}
            onCameraChange={onCameraChange}
            controlsRef={controlsRef}
            camera={camera}
          />
          <PerspectiveCamera makeDefault up={[0, 0, 1]}>
            <pointLight
              position={[0, 0, 100]}
              intensity={jscadLightIntensity}
            />
          </PerspectiveCamera>
          <ambientLight intensity={2 * jscadLightIntensity} />
          <pointLight
            position={[-1000, -1000, -1000]}
            color="#5555FF"
            intensity={1 * jscadLightIntensity}
          />
          <pointLight
            position={[-1000, 0, 1000]}
            color="#5555FF"
            intensity={1 * jscadLightIntensity}
          />
          <gridHelper
            args={[200, 20, 0xff5555, 0x555555]}
            material-opacity={0.2}
            material-transparent
            rotation-x={Math.PI / 2}
          />
          {!isMinimal && (
            <GizmoHelper alignment={'top-left'} margin={[80, 80]}>
              <GizmoViewport
                axisColors={['red', 'green', 'blue']}
                labelColor="black"
              />
            </GizmoHelper>
          )}
          {dataType === 'png' && (
            <>
              <Sphere position={[0, 0, 0]} color={pink400} />
              <Box position={[0, 50, 0]} size={[1, 100, 1]} color={indigo900} />
              <Box position={[0, 0, 50]} size={[1, 1, 100]} color={indigo300} />
              <Box position={[50, 0, 0]} size={[100, 1, 1]} color={pink400} />
            </>
          )}
          {dataType !== 'png' && artifact && (
            <Suspense fallback={null}>
              <Asset
                geometry={artifact}
                dataType={dataType}
                controlsRef={controlsRef}
              />
            </Suspense>
          )}
        </Canvas>
      </div>
      <DelayedPingAnimation isLoading={isLoading} />
      {!isMinimal && <Customizer />}
    </div>
  )
}

const IdeViewer = ({
  handleOwnCamera = false,
}: {
  handleOwnCamera?: boolean
}) => {
  const { state, thunkDispatch } = useIdeContext()
  const dataType = state.objectData?.type
  const artifact = state.objectData?.data

  const onInit = (threeInstance) => {
    thunkDispatch({ type: 'setThreeInstance', payload: threeInstance })
  }
  const onCameraChange = (camera) => {
    if (handleOwnCamera) {
      return
    }
    thunkDispatch({
      type: 'updateCamera',
      payload: { camera },
    })
    thunkDispatch((dispatch, getState) => {
      const state = getState()
      if (['png', 'INIT'].includes(state?.objectData?.type)) {
        dispatch({ type: 'setLoading' })
        requestRender({
          state,
          dispatch,
          camera,
          viewAll: state?.objectData?.type === 'INIT',
        })
      }
    })
  }

  return (
    <PureIdeViewer
      dataType={dataType}
      artifact={artifact}
      onInit={onInit}
      onCameraChange={onCameraChange}
      isLoading={state.isLoading}
      camera={state?.camera}
    />
  )
}

export default IdeViewer
