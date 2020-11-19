import MainLayout from 'src/layouts/MainLayout'
import User2Cell from 'src/components/User2Cell'
import Seo from 'src/components/Seo/Seo'

const UserPage = ({ userName }) => {
  return (
    <MainLayout>
      <Seo title={userName} description="User page" lang="en-US" />

      <User2Cell userName={userName} />
    </MainLayout>
  )
}

export default UserPage
