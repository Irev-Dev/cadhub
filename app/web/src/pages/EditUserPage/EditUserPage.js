import EditUserCell from 'src/components/EditUserCell'
import Seo from 'src/components/Seo/Seo'

const UserPage = ({ userName }) => {
  return (
    <>
      <Seo title={userName} description="Add new project page" lang="en-US" />

      <EditUserCell userName={userName} isEditable />
    </>
  )
}

export default UserPage
