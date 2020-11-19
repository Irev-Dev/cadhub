import { useAuth } from '@redwoodjs/auth'

import MainLayout from 'src/layouts/MainLayout'
import Part2Cell from 'src/components/Part2Cell'
import Seo from 'src/components/Seo/Seo'

const Part2Page = ({ userName, partTitle }) => {
  const { currentUser } = useAuth()
  return (
    <MainLayout>
      <Seo title={partTitle} description={partTitle} lang="en-US" />

      <Part2Cell
        userName={userName}
        partTitle={partTitle}
        currentUserId={currentUser?.sub}
      />
    </MainLayout>
  )
}

export default Part2Page
