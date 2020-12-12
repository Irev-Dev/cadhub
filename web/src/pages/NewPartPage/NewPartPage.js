import { useEffect } from 'react'
import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'

import MainLayout from 'src/layouts/MainLayout'
import PartCell from 'src/components/PartCell'
import Seo from 'src/components/Seo/Seo'

const NewPartPage = ({ userName }) => {
  const { isAuthenticated, currentUser } = useAuth()
  useEffect(() => {
    !isAuthenticated && navigate(routes.home())
  }, [currentUser])
  return (
    <MainLayout>
      <Seo title="New part" description="Add new part page" lang="en-US" />

      <PartCell
        userName={userName}
        currentUserId={currentUser?.sub}
        isEditable
      />
    </MainLayout>
  )
}

export default NewPartPage
