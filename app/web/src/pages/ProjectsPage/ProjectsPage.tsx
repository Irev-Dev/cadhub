import ProjectsCell from 'src/components/ProjectsCell'
import MainLayout from 'src/layouts/MainLayout'
import Seo from 'src/components/Seo/Seo'

const ProjectsPage = () => {
  return (
    <MainLayout shouldRemoveFooterInIde>
      <Seo
        title="Projects page"
        description="Cadhub Projects page"
        socialImageUrl="https://cadhub.xyz/default-social-image.jpg"
        lang="en-US"
      />
      <div className="bg-ch-gray-800 pb-64">
        <h1 className="max-w-7xl mx-auto text-4xl px-4 py-4 pt-16 text-ch-gray-300 font-sans">
          Projects
        </h1>
        <ProjectsCell shouldFilterProjectsWithoutImage projectLimit={80} />
      </div>
    </MainLayout>
  )
}

export default ProjectsPage
