import MainLayout from 'src/layouts/MainLayout'
import Seo from 'src/components/Seo/Seo'
import { Hero } from 'src/components/Hero/Hero'

const HomePage = () => {
  return (
    <MainLayout shouldRemoveFooterInIde>
      <Seo
        title="CadHub Home page"
        description="Learn about Code CAD and the CadHub community"
        lang="en-US"
        socialImageUrl="http://cadhub.xyz/default-social-image.jpg"
      />
      <Hero />
    </MainLayout>
  )
}

export default HomePage
