import MainLayout from 'src/layouts/MainLayout'
import EditUserCell from 'src/components/EditUserCell'

const EditUserPage = ({ id }) => {
  return (
    <MainLayout>
      <EditUserCell id={id} />
    </MainLayout>
  )
}

export default EditUserPage
