import { createContext } from 'react'
import IdeContainer from 'src/components/IdeContainer'
import { isBrowser } from '@redwoodjs/prerender/browserUtils'
import { useIdeState } from 'src/helpers/hooks/useIdeState'
import { copyTextToClipboard } from 'src/helpers/clipboard'

export const IdeContext = createContext()
const IdeToolbarNew = () => {
  const [state, dispatch] = useIdeState()
  function setIdeType(ide) {
    dispatch({ type: 'setIdeType', payload: { message: ide } })
  }
  function handleRender() {
    dispatch({ type: 'render', payload: { code: state.code } })
  }
  function handleMakeLink() {
    if (isBrowser) {
      const scriptBase64 = btoa(state.code)
      window.location.hash = `encoded_script=${scriptBase64}`
      copyTextToClipboard(window.location.href)
    }
  }

  return (
    <IdeContext.Provider value={{ state, dispatch }}>
      <div className="p-8 border-2">
        <nav className="flex">
          {/* <button
            onClick={() => setIdeType('openCascade')}
            className="p-2 br-2 border-2 m-2 bg-blue-200"
          >
            Switch to OpenCascade
          </button>
          <button
            onClick={() => setIdeType('openScad')}
            className="p-2 br-2 border-2 m-2 bg-indigo-200"
          >
            Switch to OpenSCAD
          </button> */}
          <button onClick={handleRender} className="p-2 br-2 border-2 m-2">
            Render
          </button>
          <button onClick={handleMakeLink} className="p-2 br-2 border-2 m-2">
            Copy link
          </button>
        </nav>
        <IdeContainer />
      </div>
    </IdeContext.Provider>
  )
}

export default IdeToolbarNew
