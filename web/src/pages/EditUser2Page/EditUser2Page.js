import MainLayout from 'src/layouts/MainLayout'
import EditUser2Cell from 'src/components/EditUser2Cell'

const UserPage = ({ userName }) => {
  return (
    <MainLayout>
      <EditUser2Cell userName={userName}/>
    </MainLayout>
  )
}

export default UserPage
