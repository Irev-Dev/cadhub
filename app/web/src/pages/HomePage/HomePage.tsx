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
      <div className="bg-ch-gray-800 py-20">
        <ProjectsCell shouldFilterProjectsWithoutImage />
      </div>
    </MainLayout>
  )
}

export default ProjectsPage
