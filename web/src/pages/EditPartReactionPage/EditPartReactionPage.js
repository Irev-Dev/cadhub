import MainLayout from 'src/layouts/MainLayout'
import EditPartReactionCell from 'src/components/EditPartReactionCell'

const EditPartReactionPage = ({ id }) => {
  return (
    <MainLayout>
      <EditPartReactionCell id={id} />
    </MainLayout>
  )
}

export default EditPartReactionPage
