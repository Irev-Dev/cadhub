import MainLayout from 'src/layouts/MainLayout'
import EditPartCell from 'src/components/EditPartCell'
import Seo from 'src/components/Seo/Seo'

const EditPartPage = ({ id }) => {
  return (
    <MainLayout>
      <Seo title="Edit part" description="Edit part page" lang="en-US" />

      <EditPartCell id={id} />
    </MainLayout>
  )
}

export default EditPartPage
