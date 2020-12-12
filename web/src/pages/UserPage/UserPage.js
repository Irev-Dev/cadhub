import MainLayout from 'src/layouts/MainLayout'
import UserCell from 'src/components/UserCell'
import Seo from 'src/components/Seo/Seo'

const UserPage = ({ userName }) => {
  return (
    <MainLayout>
      <Seo title={userName} description="User page" lang="en-US" />

      <UserCell userName={userName} />
    </MainLayout>
  )
}

export default UserPage
