import EmbedProjectCell from 'src/components/EmbedProjectCell'

const EmbedProjectPage = ({ userName, projectTitle }) => {
  return (
    <>
      <EmbedProjectCell userName={userName} projectTitle={projectTitle} />
    </>
  )
}

export default EmbedProjectPage
