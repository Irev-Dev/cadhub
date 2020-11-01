import MainLayout from 'src/layouts/MainLayout'
import CommentCell from 'src/components/CommentCell'

const CommentPage = ({ id }) => {
  return (
    <MainLayout>
      <CommentCell id={id} />
    </MainLayout>
  )
}

export default CommentPage
