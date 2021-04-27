import { createContext, useEffect } from 'react'
import IdeContainer from 'src/components/IdeContainer'
import { isBrowser } from '@redwoodjs/prerender/browserUtils'
import { useIdeState, codeStorageKey } from 'src/helpers/hooks/useIdeState'
import { copyTextToClipboard } from 'src/helpers/clipboard'
import { requestRender } from 'src/helpers/hooks/useIdeState'

export const IdeContext = createContext()
const IdeToolbarNew = ({ cadPackage }) => {
  const [state, thunkDispatch] = useIdeState()
  const scriptKey = 'encoded_script'
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
    const [key, scriptBase64] = hash.slice(1).split('=')
    if (key === scriptKey) {
      const script = atob(scriptBase64)
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
      const scriptBase64 = btoa(state.code)
      window.location.hash = `encoded_script=${scriptBase64}`
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
