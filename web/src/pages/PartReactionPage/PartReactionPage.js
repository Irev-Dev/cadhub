import MainLayout from 'src/layouts/MainLayout'
import PartReactionCell from 'src/components/PartReactionCell'
import Seo from 'src/components/Seo/Seo'

const PartReactionPage = ({ id }) => {
  return (
    <MainLayout>
      <Seo
        title="Part reaction"
        description="Part reaction page"
        lang="en-US"
      />

      <PartReactionCell id={id} />
    </MainLayout>
  )
}

export default PartReactionPage
