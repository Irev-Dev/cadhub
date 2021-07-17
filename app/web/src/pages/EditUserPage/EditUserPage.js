import MainLayout from 'src/layouts/MainLayout'
import EditUserCell from 'src/components/EditUserCell'
import Seo from 'src/components/Seo/Seo'

const UserPage = ({ userName }) => {
  return (
    <MainLayout>
      <Seo title={userName} description="Add new project page" lang="en-US" />

      <EditUserCell userName={userName} isEditable />
    </MainLayout>
  )
}

export default UserPage
