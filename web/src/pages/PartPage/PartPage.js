import { useAuth } from '@redwoodjs/auth'

import MainLayout from 'src/layouts/MainLayout'
import PartCell from 'src/components/PartCell'
import Seo from 'src/components/Seo/Seo'

const PartPage = ({ userName, partTitle }) => {
  const { currentUser } = useAuth()
  return (
    <MainLayout>
      <Seo title={partTitle} description={partTitle} lang="en-US" />

      <PartCell
        userName={userName}
        partTitle={partTitle}
        currentUserId={currentUser?.sub}
      />
    </MainLayout>
  )
}

export default PartPage
