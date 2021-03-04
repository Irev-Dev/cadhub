import IdeContainer from 'src/components/IdeContainer'
import { createContext } from 'react'
import { useIdeState } from 'src/helpers/hooks/useIdeState'

export const IdeContext = createContext()

const IdeToolbarNew = () => {
  const [state, dispatch] = useIdeState()
  return (
    <IdeContext.Provider value={{ state, dispatch }}>
      <div className="p-8 border-2">
        <div>hi I'm the toolbar</div>
        <IdeContainer />
      </div>
    </IdeContext.Provider>
  )
}

export default IdeToolbarNew
