import MainLayout from 'src/layouts/MainLayout'
import CommentsCell from 'src/components/CommentsCell'
import Seo from 'src/components/Seo/Seo'

const CommentsPage = () => {
  return (
    <MainLayout>
      <Seo title="Comments" description="Comments page" lang="en-US" />

      <CommentsCell />
    </MainLayout>
  )
}

export default CommentsPage
