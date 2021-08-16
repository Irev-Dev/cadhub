// This code has been copied from https://github.com/pmndrs/drei/blob/master/src/core/useEdgeSplit.tsx
// but modified to allow for updating geometry with `dependantGeometry`

import * as React from 'react'
import * as THREE from 'three'
import { EdgeSplitModifier } from 'three-stdlib'

export function useEdgeSplit(
  cutOffAngle: number,
  tryKeepNormals = true,
  dependantGeometry?: any
) {
  const ref = React.useRef<THREE.Mesh>()
  const original = React.useRef<THREE.BufferGeometry>()
  const modifier = React.useRef<EdgeSplitModifier>()

  React.useEffect(() => {
    if (!original.current && ref.current) {
      original.current = ref.current.geometry.clone()
      modifier.current = new EdgeSplitModifier()
    }
  }, [])

  React.useEffect(() => {
    original.current = dependantGeometry.clone()
    modifier.current = new EdgeSplitModifier()
  }, [dependantGeometry])

  React.useEffect(() => {
    if (original.current && ref.current && modifier.current) {
      const modifiedGeometry = modifier.current.modify(
        original.current,
        cutOffAngle,
        tryKeepNormals
      )
      modifiedGeometry.computeVertexNormals()

      ref.current.geometry = modifiedGeometry
    }
  }, [cutOffAngle, tryKeepNormals, dependantGeometry])

  return ref
}
