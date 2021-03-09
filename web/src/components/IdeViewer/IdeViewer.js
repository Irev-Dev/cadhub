import { useContext } from 'react'
import { IdeContext } from 'src/components/IdeToolbarNew'

const IdeViewer = () => {
  const { state } = useContext(IdeContext)
  const image =
    state.objectData?.type === 'png' &&
    state.objectData?.data &&
    window.URL.createObjectURL(state.objectData?.data)
  return (
    <div className="p-8 border-2 m-2">
      <div className="pb-4">hi I'm viewer</div>
      <div>
        I should be showing an{' '}
        <span className="font-mono uppercase">{state.objectData?.type}</span>{' '}
        right now with the data{' '}
      </div>
      {image && (
        <div>
          <img src={image} className="" />
        </div>
      )}
    </div>
  )
}

export default IdeViewer
