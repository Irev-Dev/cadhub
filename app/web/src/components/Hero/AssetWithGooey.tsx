import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useLoader, useThree, useFrame } from '@react-three/fiber'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { useEdgeSplit } from 'src/helpers/hooks/useEdgeSplit'
import texture from 'src/components/IdeViewer/dullFrontLitMetal.png'
import { useTexture, MeshDistortMaterial, Sphere } from '@react-three/drei'

const thresholdAngle = 10
export default function AssetWithGooey({
  assetUrl,
  offset,
  scale,
}: {
  assetUrl: string
  offset: number[]
  scale: number
}) {
  const geo = useLoader(STLLoader, assetUrl)
  const edgeRef = useRef(null)
  const coffeeRef = useRef(null)
  const mesh = useEdgeSplit((thresholdAngle * Math.PI) / 180, true, geo)
  const colorMap = useTexture(texture)
  const edges = React.useMemo(() => new THREE.EdgesGeometry(geo, 12), [geo])
  const position = [offset[0], offset[1], 5]
  const scaleArr = Array.from({ length: 3 }).map(() => scale)
  const { mouse } = useThree()
  const [rEuler, rQuaternion] = useMemo(
    () => [new THREE.Euler(), new THREE.Quaternion()],
    []
  )
  useFrame((state, delta) => {
    if (edgeRef.current) {
      edgeRef.current.rotation.y += 0.01
    }
    if (coffeeRef.current) {
      rEuler.set((-mouse.y * Math.PI) / 4, (mouse.x * Math.PI) / 2, 0)
      coffeeRef.current.quaternion.slerp(rQuaternion.setFromEuler(rEuler), 0.1)
    }
  })
  return (
    <group dispose={null} ref={edgeRef} position={position}>
      <group ref={coffeeRef}>
        <mesh ref={mesh} scale={scaleArr} geometry={geo}>
          <meshPhysicalMaterial
            envMapIntensity={2}
            color="#F472B6"
            map={colorMap}
            clearcoat={0.5}
            clearcoatRoughness={0.01}
            roughness={0}
            metalness={0.7}
            smoothShading
          />
        </mesh>
        <lineSegments scale={scale} geometry={edges} renderOrder={100}>
          <lineBasicMaterial color="#aaaaff" />
        </lineSegments>
      </group>
      <ambientLight intensity={2} />
      <Gooey />
    </group>
  )
}

function randomSign(num: number): number {
  return Math.random() > 0.5 ? num : -num
}

function Gooey() {
  const blobsData = useMemo(() => {
    const firstSet = Array.from({ length: 5 }).map((_, index) => {
      const dist = Math.random() * 3 + 2.5
      const x = randomSign(Math.random() * dist)
      const y = randomSign(Math.sqrt(dist * dist - x * x))
      const z = randomSign(Math.random() * 3)
      const position: [number, number, number] = [x, z, y]
      const size = Math.random() * 0.8 + 0.1
      const distort = Math.random() * 0.8 + 0.1
      const speed = (Math.random() * 0.8) / size / size + 0.1
      return { position, size, distort, speed }
    })
    const secondSet = Array.from({ length: 5 }).map((_, index) => {
      const dist = Math.random() * 3 + 1.5
      const x = randomSign(Math.random() * dist)
      const y = randomSign(Math.sqrt(dist * dist - x * x))
      const z = randomSign(Math.random() * 3)
      const position: [number, number, number] = [x, z, y]
      const size = Math.random() * 0.2 + 0.05
      const distort = Math.random() * 0.8 + 0.1
      const speed = (Math.random() * 0.5) / size / size + 0.1
      return { position, size, distort, speed }
    })
    return [...firstSet, ...secondSet]
  }, [])
  return (
    <>
      {blobsData.map(({ position, size, distort, speed }, index) => (
        <Sphere key={index} visible position={position} args={[size, 16, 200]}>
          <MeshDistortMaterial
            color="#173E6F"
            attach="material"
            distort={distort} // Strength, 0 disables the effect (default=1)
            speed={speed} // Speed (default=1)
            roughness={0.2}
            opacity={0.6}
            transparent
          />
        </Sphere>
      ))}
    </>
  )
}
