import MainLayout from 'src/layouts/MainLayout'
import UserCell from 'src/components/UserCell'
import Seo from 'src/components/Seo/Seo'

const UserPage = ({ id }) => {
  return (
    <MainLayout>
      <Seo title="User" description="User page" lang="en-US" />

      <UserCell id={id} />
    </MainLayout>
  )
}

export default UserPage
