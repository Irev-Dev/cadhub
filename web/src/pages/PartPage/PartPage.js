import PartsLayout from 'src/layouts/PartsLayout'
import PartCell from 'src/components/PartCell'

const PartPage = ({ id }) => {
  return (
    <PartsLayout>
      <PartCell id={id} />
    </PartsLayout>
  )
}

export default PartPage
