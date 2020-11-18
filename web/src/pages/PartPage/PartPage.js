import MainLayout from 'src/layouts/MainLayout'
import PartCell from 'src/components/PartCell'
import Seo from 'src/components/Seo/Seo'

const PartPage = ({ id }) => {
  return (
    <MainLayout>
      <Seo title="Part" description="Part page" lang="en-US" />

      <PartCell id={id} />
    </MainLayout>
  )
}

export default PartPage
