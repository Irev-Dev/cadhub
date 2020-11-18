import MainLayout from 'src/layouts/MainLayout'
import EditCommentCell from 'src/components/EditCommentCell'
import Seo from 'src/components/Seo/Seo'

const EditCommentPage = ({ id }) => {
  return (
    <MainLayout>
      <Seo title="Edit comment" description="Edit comment page" lang="en-US" />

      <EditCommentCell id={id} />
    </MainLayout>
  )
}

export default EditCommentPage
