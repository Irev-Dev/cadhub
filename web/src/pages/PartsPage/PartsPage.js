import MainLayout from 'src/layouts/MainLayout'
import PartsCell from 'src/components/PartsCell'
import Seo from 'src/components/Seo/Seo'

const PartsPage = () => {
  return (
    <MainLayout>
      <Seo title="Parts page" description="Cadhub parts page" lang="en-US" />

      <PartsCell />
    </MainLayout>
  )
}

export default PartsPage
