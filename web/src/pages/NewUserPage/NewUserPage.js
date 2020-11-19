import MainLayout from 'src/layouts/MainLayout'
import NewUser from 'src/components/NewUser'
import Seo from 'src/components/Seo/Seo'

const NewUserPage = () => {
  return (
    <MainLayout>
      <Seo title="New user" description="New user page" lang="en-US" />

      <NewUser />
    </MainLayout>
  )
}

export default NewUserPage
