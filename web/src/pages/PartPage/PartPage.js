import PartsLayout from 'src/layouts/PartsLayout'
import MainLayout from 'src/layouts/MainLayout'
import PartCell from 'src/components/PartCell'

const PartPage = ({ id }) => {
  return (
    <MainLayout>
      <PartsLayout>
        <PartCell id={id} />
      </PartsLayout>
    </MainLayout>
  )
}

export default PartPage
