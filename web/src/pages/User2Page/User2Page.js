import MainLayout from 'src/layouts/MainLayout'
import User2Cell from 'src/components/User2Cell'

const UserPage = ({ userName }) => {
  return (
    <MainLayout>
      <User2Cell userName={userName} />
    </MainLayout>
  )
}

export default UserPage
