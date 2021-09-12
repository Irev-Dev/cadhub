import MainLayout from 'src/layouts/MainLayout'
import EditUserCell from 'src/components/EditUserCell'
import Seo from 'src/components/Seo/Seo'

const UserPage = ({ userName }) => {
  return (
    <>
      <Seo title={userName} description="User page" lang="en-US" />

      <EditUserCell userName={userName} />
    </>
  )
}

export default UserPage
