import { makeEncodedLink } from './helpers'
import { copyTextToClipboard } from 'src/helpers/clipboard'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'

const FullScriptEncoding = () => {
  const { state } = useIdeContext()
  const encodedLink = makeEncodedLink(state.code)
  return (
    <div className="p-4">
      <p className="text-sm pb-4 border-b border-gray-700">
        Encodes your CodeCad script into a URL so that you can share your work
      </p>
      <input
        value={encodedLink.replace(/^.+:\/\//g, '')}
        readOnly
        className="py-1 px-2 mt-4 text-xs border border-ch-purple-450 w-full"
      />
      <button
        className="w-full bg-ch-purple-450 hover:bg-ch-purple-400 py-1 rounded-b text-gray-300"
        onClick={() => copyTextToClipboard(encodedLink)}
      >
        Copy URL
      </button>
    </div>
  )
}

export default FullScriptEncoding
