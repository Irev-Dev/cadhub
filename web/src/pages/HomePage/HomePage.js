import MainLayout from 'src/layouts/MainLayout'
import PartsCell from 'src/components/PartsCell'
import LandingSection from 'src/components/LandingSection'
import Seo from 'src/components/Seo/Seo'

const PartsPage = () => {
  return (
    <MainLayout>
      <Seo title="Parts page" description="Cadhub parts page" lang="en-US" />
      <LandingSection />
      <PartsCell shouldFilterPartsWithoutImage />
    </MainLayout>
  )
}

export default PartsPage
