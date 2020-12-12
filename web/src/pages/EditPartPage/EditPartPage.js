import { useAuth } from '@redwoodjs/auth'

import MainLayout from 'src/layouts/MainLayout'
import PartCell from 'src/components/PartCell'
import Seo from 'src/components/Seo/Seo'

const EditPartPage = ({ userName, partTitle }) => {
  const { currentUser } = useAuth()
  return (
    <MainLayout>
      <Seo title={partTitle} description="Edit part page" lang="en-US" />

      <PartCell
        userName={userName}
        partTitle={partTitle}
        currentUserId={currentUser?.sub}
        isEditable
      />
    </MainLayout>
  )
}

export default EditPartPage
