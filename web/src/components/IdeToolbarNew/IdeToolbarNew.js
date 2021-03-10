import IdeContainer from 'src/components/IdeContainer'
import { createContext } from 'react'
import { useIdeState } from 'src/helpers/hooks/useIdeState'

export const IdeContext = createContext()

const IdeToolbarNew = () => {
  const [state, dispatch] = useIdeState()
  function setIdeType(ide) {
    dispatch({ type: 'setIdeType', payload: { message: ide } })
  }
  function handleRender() {
    dispatch({ type: 'render', payload: { code: state.code } })
  }

  return (
    <IdeContext.Provider value={{ state, dispatch }}>
      <div className="p-8 border-2">
        <div>hi I'm the toolbar</div>
        <nav className="flex">
          <button
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
          </button>
          <button onClick={handleRender} className="p-2 br-2 border-2 m-2">
            Render
          </button>
        </nav>
        <IdeContainer />
      </div>
    </IdeContext.Provider>
  )
}

export default IdeToolbarNew
