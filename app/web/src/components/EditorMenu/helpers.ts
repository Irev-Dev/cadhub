import { flow, identity } from 'lodash/fp'
import { fileSave } from 'browser-fs-access'
import { MeshBasicMaterial, Mesh, Scene } from 'three'
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter'
import { requestRender } from 'src/helpers/hooks/useIdeState'

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

export const makeStlDownloadHandler =
  ({ geometry, fileName, type, thunkDispatch }) =>
  () => {
    const makeStlBlobFromGeo = flow(
      (geo) => new Mesh(geo, new MeshBasicMaterial()),
      (mesh) => new Scene().add(mesh),
      (scene) => new STLExporter().parse(scene),
      (stl) =>
        new Blob([stl], {
          type: 'text/plain',
        })
    )
    const saveFile = (geometry) => {
      const blob = makeStlBlobFromGeo(geometry)
      fileSave(blob, {
        fileName,
        extensions: ['.stl'],
      })
    }
    if (geometry) {
      if (type === 'geometry') {
        saveFile(geometry)
      } else {
        thunkDispatch((dispatch, getState) => {
          const state = getState()
          if (state.ideType === 'openScad') {
            dispatch({ type: 'setLoading' })
            requestRender({
              state,
              dispatch,
              code: state.code,
              viewerSize: state.viewerSize,
              camera: state.camera,
              specialCadProcess: 'stl',
            }).then((result) => result && saveFile(result.data))
          }
        })
      }
    }
  }
