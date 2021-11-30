import OutBound from 'src/components/OutBound/OutBound'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'

const StaticImageMessage = () => {
  const { state } = useIdeContext()
  if ((state.ideType !== 'openscad' && state.ideType !== 'curv') || state.objectData?.type !== 'png') {
    return null
  }
  return state.ideType === 'openscad' ?
    <OutBound
      to="https://learn.cadhub.xyz/docs/general-cadhub/openscad-previews"
      className="text-ch-gray-300 border-ch-gray-300 rounded-md mr-12 px-2 py-1 text-xs"
    >
      Why reload each camera move?
    </OutBound>
  : <div className="text-ch-gray-300 border-ch-gray-300 rounded-md mr-12 px-2 py-1 text-xs">
    Alpha Curv integration, no camera support currently.
  </div>
}

export default StaticImageMessage
