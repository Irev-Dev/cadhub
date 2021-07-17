import IdeProjectCell from 'src/components/IdeProjectCell'
import Seo from 'src/components/Seo/Seo'

const IdeProjectPage = ({ userName, projectTitle }) => {
  return (
    <>
      <Seo title={projectTitle} description={projectTitle} lang="en-US" />
      <IdeProjectCell userName={userName} projectTitle={projectTitle} />
    </>
  )
}

export default IdeProjectPage
