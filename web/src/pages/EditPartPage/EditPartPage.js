import PartsLayout from 'src/layouts/PartsLayout'
import EditPartCell from 'src/components/EditPartCell'

const EditPartPage = ({ id }) => {
  return (
    <PartsLayout>
      <EditPartCell id={id} />
    </PartsLayout>
  )
}

export default EditPartPage
