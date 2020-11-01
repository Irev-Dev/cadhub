import CommentsLayout from 'src/layouts/CommentsLayout'
import CommentCell from 'src/components/CommentCell'

const CommentPage = ({ id }) => {
  return (
    <CommentsLayout>
      <CommentCell id={id} />
    </CommentsLayout>
  )
}

export default CommentPage
