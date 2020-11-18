import MainLayout from 'src/layouts/MainLayout'
import EditUser2Cell from 'src/components/EditUser2Cell'
import Seo from 'src/components/Seo/Seo'

const UserPage = ({ userName }) => {
  return (
    <MainLayout>
      <Seo title={userName} description="Add new part page" lang="en-US" />

      <EditUser2Cell userName={userName} />
    </MainLayout>
  )
}

export default UserPage
