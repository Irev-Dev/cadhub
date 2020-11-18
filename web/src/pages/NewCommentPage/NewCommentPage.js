import MainLayout from 'src/layouts/MainLayout'
import NewComment from 'src/components/NewComment'
import Seo from 'src/components/Seo/Seo'

const NewCommentPage = () => {
  return (
    <MainLayout>
      <Seo
        title="New comment page"
        description="New comment page"
        lang="en-US"
      />

      <NewComment />
    </MainLayout>
  )
}

export default NewCommentPage
