import { createContext, useEffect } from 'react'
import IdeContainer from 'src/components/IdeContainer'
import { isBrowser } from '@redwoodjs/prerender/browserUtils'
import { useIdeState, codeStorageKey } from 'src/helpers/hooks/useIdeState'
import { copyTextToClipboard } from 'src/helpers/clipboard'
import { requestRender } from 'src/helpers/hooks/useIdeState'
import { encode, decode } from 'src/helpers/compress'

export const IdeContext = createContext()
const IdeToolbarNew = ({ cadPackage }) => {
  const [state, thunkDispatch] = useIdeState()
  const scriptKey = 'encoded_script'
  const scriptKeyV2 = 'encoded_script_v2'
  useEffect(() => {
    thunkDispatch({
      type: 'initIde',
      payload: { cadPackage },
    })
    // load code from hash if it's there
    let hash
    if (isBrowser) {
      hash = window.location.hash
    }
    const [key, encodedScript] = hash.slice(1).split('=')
    if (key === scriptKey) {
      const script = atob(encodedScript)
      thunkDispatch({ type: 'updateCode', payload: script })
    } else if (key === scriptKeyV2) {
      const script = decode(encodedScript)
      thunkDispatch({ type: 'updateCode', payload: script })
    }
    window.location.hash = ''
    setTimeout(() => handleRender()) // definitely a little hacky, timeout with no delay is just to push it into the next event loop.
  }, [cadPackage])
  function handleRender() {
    thunkDispatch((dispatch, getState) => {
      const state = getState()
      dispatch({ type: 'setLoading' })
      requestRender({
        state,
        dispatch,
        code: state.code,
        viewerSize: state.viewerSize,
        camera: state.camera,
      })
    })
    localStorage.setItem(codeStorageKey, state.code)
  }
  function handleMakeLink() {
    if (isBrowser) {
      const encodedScript = encode(state.code)
      window.location.hash = `${scriptKeyV2}=${encodedScript}`
      copyTextToClipboard(window.location.href)
    }
  }

  return (
    <IdeContext.Provider value={{ state, thunkDispatch }}>
      <div className="h-full flex flex-col">
        <nav className="flex">
          <button
            onClick={handleRender}
            className="border-2 px-2 text-gray-700 text-sm m-1"
          >
            Render
          </button>
          <button
            onClick={handleMakeLink}
            className="border-2 text-gray-700 px-2 text-sm m-1 ml-2"
          >
            Copy link
          </button>
        </nav>
        <IdeContainer />
      </div>
    </IdeContext.Provider>
  )
}

export default IdeToolbarNew
