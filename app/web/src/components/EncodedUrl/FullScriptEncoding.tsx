import { makeEncodedLink } from './helpers'
import { copyTextToClipboard } from 'src/helpers/clipboard'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'


const FullScriptEncoding = () => {
  const { state } = useIdeContext()
  const encodedLink = makeEncodedLink(state.code)
  return (
    <>
      <p className="text-sm pb-4 border-b border-gray-700">Encodes your CodeCad script into a URL so that you can share your work</p>
      <input value={encodedLink.replace(/^.+:\/\//g, '')} readOnly className="p-1 mt-4 text-xs rounded-t border border-gray-700 w-full" />
      <button className="w-full bg-gray-700 py-1 rounded-b text-gray-300" onClick={() => copyTextToClipboard(encodedLink)} >Copy URL</button>
    </>
  )
}

export default FullScriptEncoding
