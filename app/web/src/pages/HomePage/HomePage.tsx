import MainLayout from 'src/layouts/MainLayout'
import Seo from 'src/components/Seo/Seo'
import { Hero } from 'src/components/Hero/Hero'

const ProjectsPage = () => {
  return (
    <MainLayout shouldRemoveFooterInIde>
      <Seo
        title="Home page"
        description="Learn about Code CAD and the CadHub community"
        lang="en-US"
      />
      <Hero />
    </MainLayout>
  )
}

export default ProjectsPage
