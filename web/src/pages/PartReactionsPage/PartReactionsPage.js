import MainLayout from 'src/layouts/MainLayout'
import PartReactionsCell from 'src/components/PartReactionsCell'
import Seo from 'src/components/Seo/Seo'

const PartReactionsPage = () => {
  return (
    <MainLayout>
      <Seo
        title="Part reactions"
        description="Part reactions page"
        lang="en-US"
      />

      <PartReactionsCell />
    </MainLayout>
  )
}

export default PartReactionsPage
