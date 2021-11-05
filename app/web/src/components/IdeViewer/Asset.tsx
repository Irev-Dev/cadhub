import * as THREE from 'three'
import { useState } from 'react'
import { useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useEdgeSplit } from 'src/helpers/hooks/useEdgeSplit'
import texture from './dullFrontLitMetal.png'
import type { ArtifactTypes } from 'src/helpers/cadPackages/common'

const thresholdAngle = 12

export function Asset({
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
