import { createContext } from 'react'
import IdeContainer from 'src/components/IdeContainer'
import { isBrowser } from '@redwoodjs/prerender/browserUtils'
import { useIdeState, codeStorageKey } from 'src/helpers/hooks/useIdeState'
import { copyTextToClipboard } from 'src/helpers/clipboard'
import { requestRender } from 'src/helpers/hooks/useIdeState'

export const IdeContext = createContext()
const IdeToolbarNew = () => {
  const [state, thunkDispatch] = useIdeState()
  function setIdeType(ide) {
    thunkDispatch({ type: 'setIdeType', payload: { message: ide } })
  }
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
    <IdeContext.Provider value={{ state, thunkDispatch: thunkDispatch }}>
      <div className="h-full flex flex-col">
        <nav className="flex">
          <button
            onClick={() =>
              setIdeType(state.ideType === 'openScad' ? 'cadQuery' : 'openScad')
            }
            className="p-2 br-2 border-2 m-2 bg-blue-200"
          >
            Switch to {state.ideType === 'openScad' ? 'CadQuery' : 'OpenSCAD'}
          </button>
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
