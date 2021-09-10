import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useLoader, useThree, useFrame } from '@react-three/fiber'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { useEdgeSplit } from 'src/helpers/hooks/useEdgeSplit'
import texture from 'src/components/IdeViewer/dullFrontLitMetal.png'
import {
  useTexture,
  Environment,
  MeshDistortMaterial,
  Sphere,
} from '@react-three/drei'

const thresholdAngle = 10
export default function AssetWithGooey({
  assetUrl,
  offset,
  preset,
  scale,
}: {
  assetUrl: string
  offset: number[]
  preset?: string
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
  useFrame((state, delta) => {
    if (edgeRef.current) {
      edgeRef.current.rotation.y += 0.01

      coffeeRef.current.rotation.x = (-mouse.y * Math.PI) / 6
      coffeeRef.current.rotation.y = (mouse.x * Math.PI) / 6
    }
  })
  return (
    <group dispose={null} ref={edgeRef} position={position}>
      <group ref={coffeeRef}>
        <Environment preset={preset || 'warehouse'} />
        <mesh ref={mesh} scale={scaleArr} geometry={geo}>
          <meshPhysicalMaterial
            envMapIntensity={2}
            color="#F472B6"
            map={colorMap}
            clearcoat={0.2}
            clearcoatRoughness={0.01}
            roughness={1}
            metalness={0.9}
            smoothShading
          />
        </mesh>
        <lineSegments scale={scale} geometry={edges} renderOrder={100}>
          <lineBasicMaterial color="#aaaaff" />
        </lineSegments>
      </group>
      <pointLight
        position={[-1000, -1000, 1000]}
        color="#5555FF"
        intensity={1}
      />
      <ambientLight intensity={0.3} />
      <Gooey />
    </group>
  )
}

function randomSign(num: number): number {
  return Math.random() > 0.5 ? num : -num
}

function Gooey() {
  const blobsData = useMemo(() => {
    const firstSet = Array.from({ length: 10 }).map((_, index) => {
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
    const secondSet = Array.from({ length: 10 }).map((_, index) => {
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
            color="#5098F1"
            attach="material"
            distort={distort} // Strength, 0 disables the effect (default=1)
            speed={speed} // Speed (default=1)
            roughness={0}
            opacity={0.6}
            transparent
          />
        </Sphere>
      ))}
    </>
  )
}
