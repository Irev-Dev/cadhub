import PartReactionsLayout from 'src/layouts/PartReactionsLayout'
import EditPartReactionCell from 'src/components/EditPartReactionCell'

const EditPartReactionPage = ({ id }) => {
  return (
    <PartReactionsLayout>
      <EditPartReactionCell id={id} />
    </PartReactionsLayout>
  )
}

export default EditPartReactionPage
