import MainLayout from 'src/layouts/MainLayout'
import IdeCascadeStudio from 'src/components/IdeCascadeStudio'
import Seo from 'src/components/Seo/Seo'

const DraftPartPage = () => {
  return (
    <MainLayout shouldRemoveFooterInIde>
      <Seo
        title="draft part"
        description="black slate to hack on a new part"
        lang="en-US"
      />
      <IdeCascadeStudio />
    </MainLayout>
  )
}

export default DraftPartPage
