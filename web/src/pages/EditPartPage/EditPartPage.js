import MainLayout from 'src/layouts/MainLayout'
import EditPartCell from 'src/components/EditPartCell'

const EditPartPage = ({ id }) => {
  return (
    <MainLayout>
      <EditPartCell id={id} />
    </MainLayout>
  )
}

export default EditPartPage
