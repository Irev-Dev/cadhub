import MainLayout from 'src/layouts/MainLayout'
import CommentCell from 'src/components/CommentCell'
import Seo from 'src/components/Seo/Seo'

const CommentPage = ({ id }) => {
  return (
    <MainLayout>
      <Seo title="Comment" description="Comment page" lang="en-US" />

      <CommentCell id={id} />
    </MainLayout>
  )
}

export default CommentPage
