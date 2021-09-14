import MainLayout from 'src/layouts/MainLayout'
import Seo from 'src/components/Seo/Seo'
import { Hero } from 'src/components/Hero/Hero'

const ProjectsPage = () => {
  return (
    <MainLayout shouldRemoveFooterInIde>
      <Seo
        title="CadHub Home page"
        description="Learn about Code CAD and the CadHub community"
        lang="en-US"
        socialImageUrl="https://cadhub.xyz/default-social-image.jpg"
      />
      <Hero />
    </MainLayout>
  )
}

export default ProjectsPage
