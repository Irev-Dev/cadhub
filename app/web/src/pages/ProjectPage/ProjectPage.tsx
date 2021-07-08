import { useAuth } from '@redwoodjs/auth'

import ProjectCell from 'src/components/ProjectCell'
import Seo from 'src/components/Seo/Seo'
import { useIdeState } from 'src/helpers/hooks/useIdeState'
import { IdeContext } from 'src/helpers/hooks/useIdeContext'

const ProjectPage = ({ userName, projectTitle }) => {
  const { currentUser } = useAuth()
  const [state, thunkDispatch] = useIdeState()
  return (
    <>
      <Seo title={projectTitle} description={projectTitle} lang="en-US" />
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
