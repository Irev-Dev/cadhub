import { useAuth } from '@redwoodjs/auth'

import MainLayout from 'src/layouts/MainLayout'
import Part2Cell from 'src/components/Part2Cell'

const EditPart2Page = ({userName, partTitle}) => {
  const { currentUser } = useAuth()
  return (
    <MainLayout>
      <Part2Cell
        userName={userName}
        partTitle={partTitle}
        currentUserId={currentUser.sub}
        isEditable
      />
    </MainLayout>
  )
}

export default EditPart2Page
