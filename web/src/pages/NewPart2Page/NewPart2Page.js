import { useAuth } from '@redwoodjs/auth'

import MainLayout from 'src/layouts/MainLayout'
import Part2Cell from 'src/components/Part2Cell'


const NewPart2Page = ({userName}) => {
  const { currentUser } = useAuth()
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
