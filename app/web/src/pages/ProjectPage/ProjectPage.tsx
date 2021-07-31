import { useAuth } from '@redwoodjs/auth'

import ProjectCell from 'src/components/ProjectCell'
import Seo from 'src/components/Seo/Seo'
import { useIdeState } from 'src/helpers/hooks/useIdeState'
import { IdeContext } from 'src/helpers/hooks/useIdeContext'
import { Toaster } from '@redwoodjs/web/toast'

const ProjectPage = ({ userName, projectTitle }) => {
  const { currentUser } = useAuth()
  const [state, thunkDispatch] = useIdeState()
  const cacheInvalidator = new Date().toISOString().split('-').slice(0, 2).join('-')
  const socialImageUrl = `/.netlify/functions/og-image-generator/${userName}/${projectTitle}/og-image-${cacheInvalidator}.jpg`
  return (
    <>
      <Seo title={projectTitle} description={projectTitle} socialImageUrl={socialImageUrl} lang="en-US" />
      <Toaster timeout={1500} />
      <IdeContext.Provider value={{ state, thunkDispatch, project: null }}>
        <ProjectCell
          userName={userName}
          projectTitle={projectTitle}
          currentUserId={currentUser?.sub}
        />
      </IdeContext.Provider>
    </>
  )
}

export default ProjectPage
