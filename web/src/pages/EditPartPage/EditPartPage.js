import EditPartCell from 'src/components/EditPartCell'
import MainLayout from 'src/layouts/MainLayout'

const EditPartPage = ({ id }) => {
  return (
    <MainLayout>
      <EditPartCell id={id} />
    </MainLayout>
  )
}

export default EditPartPage
