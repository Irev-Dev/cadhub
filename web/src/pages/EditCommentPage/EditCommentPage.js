import MainLayout from 'src/layouts/MainLayout'
import EditCommentCell from 'src/components/EditCommentCell'

const EditCommentPage = ({ id }) => {
  return (
    <MainLayout>
      <EditCommentCell id={id} />
    </MainLayout>
  )
}

export default EditCommentPage
