import Seo from 'src/components/Seo/Seo'
import IdeWrapper from 'src/components/IdeWrapper/IdeWrapper'
import { Toaster } from '@redwoodjs/web/toast'
import { useIdeState } from 'src/helpers/hooks/useIdeState'
import type { Project } from 'src/components/IdeProjectCell/IdeProjectCell'
import { IdeContext } from 'src/helpers/hooks/useIdeContext'

interface Props {
  cadPackage: string
  project?: Project
}

const DevIdePage = ({ cadPackage, project }: Props) => {
  const [state, thunkDispatch] = useIdeState()
  return (
    <div className="h-screen flex flex-col">
      <Seo
        title="new ide in development"
        description="new ide in development"
        lang="en-US"
      />
      <Toaster timeout={9000} />
      <IdeContext.Provider value={{ state, thunkDispatch, project }}>
        <IdeWrapper cadPackage={cadPackage.toLocaleLowerCase()} />
      </IdeContext.Provider>
    </div>
  )
}

export default DevIdePage
