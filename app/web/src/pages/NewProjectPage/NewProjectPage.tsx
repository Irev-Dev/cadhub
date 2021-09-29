import { useEffect } from 'react'
import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'

import MainLayout from 'src/layouts/MainLayout'
import ProjectCell from 'src/components/ProjectCell'
import Seo from 'src/components/Seo/Seo'

const NewProjectPage = ({ userName }) => {
  const { isAuthenticated, currentUser } = useAuth()
  useEffect(() => {
    !isAuthenticated && navigate(routes.home())
  }, [currentUser, isAuthenticated])
  return (
    <MainLayout>
      <Seo
        title="New project"
        description="Add new project page"
        lang="en-US"
      />

      <ProjectCell
        userName={userName}
        currentUserId={currentUser?.sub}
        isEditable
      />
    </MainLayout>
  )
}

export default NewProjectPage
