import { useEffect } from 'react'
import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'

import MainLayout from 'src/layouts/MainLayout'
import Part2Cell from 'src/components/Part2Cell'


const NewPart2Page = ({userName}) => {
  const { isAuthenticated, currentUser } = useAuth()
  useEffect(() => {!isAuthenticated &&
    navigate(routes.home())},
  [currentUser])
  return (
    <MainLayout>
      <Part2Cell
        userName={userName}
        currentUserId={currentUser?.sub}
        isEditable
      />
    </MainLayout>
  )
}

export default NewPart2Page
