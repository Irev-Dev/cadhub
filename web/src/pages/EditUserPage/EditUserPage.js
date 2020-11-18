import MainLayout from 'src/layouts/MainLayout'
import EditUserCell from 'src/components/EditUserCell'
import Seo from 'src/components/Seo/Seo'

const EditUserPage = ({ id }) => {
  return (
    <MainLayout>
      <Seo title="Edit user" description="Edit user page" lang="en-US" />

      <EditUserCell id={id} />
    </MainLayout>
  )
}

export default EditUserPage
