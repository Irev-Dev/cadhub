import { createContext } from 'react'
import Seo from 'src/components/Seo/Seo'
import IdeWrapper from 'src/components/IdeWrapper/IdeWrapper'
import { Toaster } from '@redwoodjs/web/toast'
import { useIdeState, State, initialState } from 'src/helpers/hooks/useIdeState'

interface IdeContextType {
  state: State
  thunkDispatch: (actionOrThunk: any) => any
}

export const IdeContext = createContext<IdeContextType>({
  state: initialState,
  thunkDispatch: () => {},
})
const DevIdePage = ({ cadPackage }) => {
  const [state, thunkDispatch] = useIdeState()
  return (
    <div className="h-screen flex flex-col">
      <Seo
        title="new ide in development"
        description="new ide in development"
        lang="en-US"
      />
      <Toaster timeout={9000} />
      <IdeContext.Provider value={{ state, thunkDispatch }}>
        <IdeWrapper cadPackage={cadPackage} />
      </IdeContext.Provider>
    </div>
  )
}

export default DevIdePage
