import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import { requestRender } from 'src/helpers/hooks/useIdeState'
import { PureIdeViewer } from './PureIdeViewer'

const IdeViewer = ({
  handleOwnCamera = false,
  isMinimal = false,
}: {
  handleOwnCamera?: boolean,
  isMinimal?: boolean,
}) => {
  const { state, thunkDispatch } = useIdeContext()
  const dataType = state.objectData?.type
  const artifact = state.objectData?.data
  const ideType = state.ideType

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
      if (
        ['png', 'INIT'].includes(state?.objectData?.type) &&
        (ideType === 'openscad' ||
          state?.objectData?.type === 'INIT' ||
          !state?.objectData?.type)
      ) {
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
      ideType={ideType}
      isMinimal={isMinimal}
    />
  )
}

export default IdeViewer
