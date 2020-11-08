import MainLayout from 'src/layouts/MainLayout'
import PartReactionCell from 'src/components/PartReactionCell'

const PartReactionPage = ({ id }) => {
  return (
    <MainLayout>
      <PartReactionCell id={id} />
    </MainLayout>
  )
}

export default PartReactionPage
