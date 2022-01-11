import Seo from 'src/components/Seo/Seo'
import IdeViewer from 'src/components/IdeViewer/IdeViewer'
import { useIdeState } from 'src/helpers/hooks/useIdeState'
import type { Project } from 'src/components/EmbedProjectCell/EmbedProjectCell'
import { IdeContext } from 'src/helpers/hooks/useIdeContext'
import { use3dViewerResize } from 'src/helpers/hooks/use3dViewerResize'
import { useEffect } from 'react'


interface Props {
  project?: Project
}

const EmbedProject = ({ project }: Props) => {
  const [state, thunkDispatch] = useIdeState()
  const { viewerDomRef, handleViewerSizeUpdate } = use3dViewerResize()

  useEffect(() => {
    handleViewerSizeUpdate()
  }, [])

  return (
    <div className="flex flex-col h-screen" ref={viewerDomRef} >
        <IdeContext.Provider value={{ state, thunkDispatch, project }}>
            <IdeViewer />
        </IdeContext.Provider>
    </div>
  )
}

export default EmbedProject
