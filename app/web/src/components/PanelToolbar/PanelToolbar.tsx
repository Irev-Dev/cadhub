import { MouseEventHandler, useContext } from 'react'
import { MosaicWindowContext } from 'react-mosaic-component'
import Svg from 'src/components/Svg/Svg'
import StaticImageMessage from 'src/components/StaticImageMessage/StaticImageMessage'

const PanelToolbar = ({
  panelName,
  showTopGradient,
  onClick,
}: {
  panelName: 'Viewer' | 'Console'
  showTopGradient?: boolean
  onClick?: MouseEventHandler
}) => {
  const { mosaicWindowActions } = useContext(MosaicWindowContext)
  return (
    <>
      {showTopGradient && (
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-ch-gray-800 to-transparent" />
      )}
      <div className="absolute top-0 right-0 flex items-center h-9">
        {panelName === 'Viewer' && <StaticImageMessage />}
        <button
          className={
            'bg-ch-gray-760 text-ch-gray-300 px-3 rounded-bl-lg h-full ' +
            (!onClick ? 'cursor-not-allowed' : '')
          }
          aria-label={`${panelName} settings`}
          onClick={onClick}
          disabled={!onClick}
        >
          <Svg name="gear" className="w-7 p-0.5" />
        </button>
        {mosaicWindowActions.connectDragSource(
          <div className=" text-ch-gray-760 bg-ch-gray-300 cursor-grab px-1.5 h-full flex items-center">
            <Svg name="drag-grid" className="w-4 p-px" />
          </div>
        )}
      </div>
    </>
  )
}

export default PanelToolbar
