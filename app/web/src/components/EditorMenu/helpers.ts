import { flow, identity } from 'lodash/fp'
import { fileSave } from 'browser-fs-access'
import { MeshBasicMaterial, Mesh, Scene } from 'three'
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter'
import { requestRender, State } from 'src/helpers/hooks/useIdeState'
import { toast } from '@redwoodjs/web/toast'

export const PullTitleFromFirstLine = (code = '') => {
  const firstLine = code.split('\n').filter(identity)[0] || ''
  if (!(firstLine.startsWith('//') || firstLine.startsWith('#'))) {
    return 'object.stl'
  }
  return (
    (firstLine.replace(/^(\/\/|#)\s*(.+)/, (_, __, titleWithSpaces) =>
      titleWithSpaces.replaceAll(/\s/g, '-')
    ) || 'object') + '.stl'
  )
}

interface makeStlDownloadHandlerArgs {
  geometry: any
  fileName: string
  type: State['objectData']['type']
  ideType: State['ideType']
  thunkDispatch: (a: any) => any
  quality: State['objectData']['quality']
}

export const makeStlDownloadHandler =
  ({
    geometry,
    fileName,
    type,
    thunkDispatch,
    quality,
    ideType,
  }: makeStlDownloadHandlerArgs) =>
  () => {
    const makeStlBlobFromMesh = flow(
      (...meshes) => new Scene().add(...meshes),
      (scene) => new STLExporter().parse(scene),
      (stl) =>
        new Blob([stl], {
          type: 'text/plain',
        })
    )
    const makeStlBlobFromGeo = flow(
      (geo) => new Mesh(geo, new MeshBasicMaterial()),
      (mesh) => makeStlBlobFromMesh(mesh)
    )
    const saveFile = (blob) => {
      fileSave(blob, {
        fileName,
        extensions: ['.stl'],
      })
    }
    toast(
      "CadHub is a work in process and We're still working out kinks with the STL download."
    )
    if (geometry) {
      if (
        type === 'geometry' &&
        (quality === 'high' || ideType === 'openscad')
      ) {
        saveFile(makeStlBlobFromGeo(geometry))
      } else if (ideType == 'jscad') {
        const clonedGeometry = geometry.map((mesh) => mesh.clone())
        saveFile(makeStlBlobFromMesh(...clonedGeometry))
      } else {
        thunkDispatch((dispatch, getState) => {
          const state = getState()
          const specialCadProcess = ideType === 'openscad' && 'stl'
          dispatch({ type: 'setLoading' })
          requestRender({
            state,
            dispatch,
            quality: 'high',
            specialCadProcess,
          }).then(
            (result) => result && saveFile(makeStlBlobFromGeo(result.data))
          )
        })
      }
    }
  }
