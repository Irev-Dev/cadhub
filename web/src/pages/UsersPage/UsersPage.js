import MainLayout from 'src/layouts/MainLayout'
import UsersCell from 'src/components/UsersCell'
import Seo from 'src/components/Seo/Seo'

const UsersPage = () => {
  return (
    <MainLayout>
      <Seo title="Users" description="Users page" lang="en-US" />

      <UsersCell />
    </MainLayout>
  )
}

export default UsersPage
