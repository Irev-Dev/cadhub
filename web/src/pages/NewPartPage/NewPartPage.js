import MainLayout from 'src/layouts/MainLayout'
import NewPart from 'src/components/NewPart'
import Seo from 'src/components/Seo/Seo'

const NewPartPage = () => {
  return (
    <MainLayout>
      <Seo title="New Part" description="New part page" lang="en-US" />

      <NewPart />
    </MainLayout>
  )
}

export default NewPartPage
