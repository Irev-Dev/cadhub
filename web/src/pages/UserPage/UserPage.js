import MainLayout from 'src/layouts/MainLayout'
import UserCell from 'src/components/UserCell'

const UserPage = ({ id }) => {
  return (
    <MainLayout>
      <UserCell id={id} />
    </MainLayout>
  )
}

export default UserPage
