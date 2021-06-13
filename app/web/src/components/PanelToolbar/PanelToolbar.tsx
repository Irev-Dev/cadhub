import { useContext } from 'react'
import { MosaicWindowContext } from 'react-mosaic-component'
import Svg from 'src/components/Svg/Svg'

const PanelToolbar = ({ panelName }: { panelName: string }) => {
  const { mosaicWindowActions } = useContext(MosaicWindowContext)
  return (
    <div className="absolute top-0 right-0 flex items-center h-9">
      <button
        className="bg-gray-500 text-gray-300 px-3 rounded-bl-lg h-full cursor-not-allowed"
        aria-label={`${panelName} settings`}
        disabled
      >
        <Svg name="gear" className="w-7 p-px" />
      </button>
      {mosaicWindowActions.connectDragSource(
        <div className=" text-gray-500 bg-gray-300 cursor-grab px-2 h-full flex items-center">
          <Svg name="drag-grid" className="w-4 p-px" />
        </div>
      )}
    </div>
  )
}

export default PanelToolbar
