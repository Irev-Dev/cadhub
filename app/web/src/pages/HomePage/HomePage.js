import MainLayout from 'src/layouts/MainLayout'
import ProjectsCell from 'src/components/ProjectsCell'
import LandingSection from 'src/components/LandingSection'
import Seo from 'src/components/Seo/Seo'

const ProjectsPage = () => {
  return (
    <MainLayout>
      <Seo
        title="Projects page"
        description="Cadhub Projects page"
        lang="en-US"
      />
      <LandingSection />
      <ProjectsCell shouldFilterProjectsWithoutImage />
    </MainLayout>
  )
}

export default ProjectsPage
