import IdeProjectCell from 'src/components/IdeProjectCell'
import Seo from 'src/components/Seo/Seo'
import { makeSocialPublicId } from 'src/helpers/hooks/useUpdateProjectImages'

const IdeProjectPage = ({ userName, projectTitle }) => {
  const socialImageUrl = `http://res.cloudinary.com/irevdev/image/upload/c_scale,w_1200/v1/CadHub/${makeSocialPublicId(
    userName,
    projectTitle
  )}`
  return (
    <>
      <Seo
        title={projectTitle}
        description={projectTitle}
        socialImageUrl={socialImageUrl}
        lang="en-US"
      />
      <IdeProjectCell userName={userName} projectTitle={projectTitle} />
    </>
  )
}

export default IdeProjectPage
