import MainLayout from 'src/layouts/MainLayout'
import Seo from 'src/components/Seo/Seo'
import IdeToolbar from 'src/components/IdeToolbarNew'

const DevIdePage = () => {
  return (
    <MainLayout>
      <Seo
        title="new ide in development"
        description="new ide in development"
        lang="en-US"
      />
      <IdeToolbar />
    </MainLayout>
  )
}

export default DevIdePage
