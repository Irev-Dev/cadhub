import MainLayout from 'src/layouts/MainLayout'
import PartsCell from 'src/components/PartsCell'
import LandingSection from 'src/components/LandingSection'
import Seo from 'src/components/Seo/Seo'
import IdeToolbar from 'src/components/IdeToolbarNew'

const PartsPage = () => {
  return (
    <MainLayout>
      <Seo title="Parts page" description="Cadhub parts page" lang="en-US" />
      <IdeToolbar />
      <LandingSection />
      <PartsCell shouldFilterPartsWithoutImage />
    </MainLayout>
  )
}

export default PartsPage
