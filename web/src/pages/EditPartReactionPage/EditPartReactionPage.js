import MainLayout from 'src/layouts/MainLayout'
import EditPartReactionCell from 'src/components/EditPartReactionCell'
import Seo from 'src/components/Seo/Seo'

const EditPartReactionPage = ({ id }) => {
  return (
    <MainLayout>
      <Seo
        title="Edit part reaction"
        description="Edit part reaction page"
        lang="en-US"
      />

      <EditPartReactionCell id={id} />
    </MainLayout>
  )
}

export default EditPartReactionPage
