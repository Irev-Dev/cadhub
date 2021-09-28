import { useAuth } from '@redwoodjs/auth'

import ProjectCell from 'src/components/ProjectCell'
import Seo from 'src/components/Seo/Seo'
import { Toaster } from '@redwoodjs/web/toast'
import { makeSocialPublicId } from 'src/helpers/hooks/useUpdateProjectImages'

const ProjectPage = ({ userName, projectTitle }) => {
  const { currentUser } = useAuth()
  const socialImageUrl = `http://res.cloudinary.com/irevdev/image/upload/c_scale,w_1200/v1/CadHub/${makeSocialPublicId(
    userName,
    projectTitle
  )}`
  return (
    <>
      <Seo
        title={projectTitle}
        description={projectTitle}
        socialImageUrl={socialImageUrl}
        lang="en-US"
      />
      <Toaster timeout={1500} />
      <ProjectCell
        userName={userName}
        projectTitle={projectTitle}
        currentUserId={currentUser?.sub}
      />
    </>
  )
}

export default ProjectPage
