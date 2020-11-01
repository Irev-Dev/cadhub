import PartReactionsLayout from 'src/layouts/PartReactionsLayout'
import PartReactionCell from 'src/components/PartReactionCell'

const PartReactionPage = ({ id }) => {
  return (
    <PartReactionsLayout>
      <PartReactionCell id={id} />
    </PartReactionsLayout>
  )
}

export default PartReactionPage
