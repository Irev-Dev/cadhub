import MainLayout from 'src/layouts/MainLayout'
import PartCell from 'src/components/PartCell'

const PartPage = ({ id }) => {
  return (
    <MainLayout>
      <PartCell id={id} />
    </MainLayout>
  )
}

export default PartPage
