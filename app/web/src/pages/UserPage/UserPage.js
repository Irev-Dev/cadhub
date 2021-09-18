import MainLayout from 'src/layouts/MainLayout'
import EditUserCell from 'src/components/EditUserCell'
import Seo from 'src/components/Seo/Seo'
import { Toaster } from '@redwoodjs/web/toast'

const UserPage = ({ userName }) => {
  return (
    <>
      <Seo title={userName} description="User page" lang="en-US" />
      <Toaster timeout={9000} />

      <EditUserCell userName={userName} />
    </>
  )
}

export default UserPage
