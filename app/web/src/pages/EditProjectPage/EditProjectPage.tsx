import { useAuth } from '@redwoodjs/auth'

import MainLayout from 'src/layouts/MainLayout'
import ProjectCell from 'src/components/ProjectCell'
import Seo from 'src/components/Seo/Seo'

const EditProjectPage = ({ userName, projectTitle }) => {
  const { currentUser } = useAuth()
  return (
    <MainLayout>
      <Seo title={projectTitle} description="Edit project page" lang="en-US" />

      <ProjectCell
        userName={userName}
        projectTitle={projectTitle}
        currentUserId={currentUser?.sub}
        isEditable
      />
    </MainLayout>
  )
}

export default EditProjectPage
