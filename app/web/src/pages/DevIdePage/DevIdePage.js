import { createContext } from 'react'
import Seo from 'src/components/Seo/Seo'
import IdeToolbar from 'src/components/IdeToolbarNew'
import { Toaster } from '@redwoodjs/web/toast'
import { useIdeState } from 'src/helpers/hooks/useIdeState'

export const IdeContext = createContext()
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
        <IdeToolbar cadPackage={cadPackage} />
      </IdeContext.Provider>
    </div>
  )
}

export default DevIdePage
