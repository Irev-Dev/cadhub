import useUser from 'src/helpers/hooks/useUser'
import { useIdeState } from 'src/helpers/hooks/useIdeState'
import { IdeContext } from 'src/helpers/hooks/useIdeContext'
import EmbedViewer from '../EmbedViewer/EmbedViewer'

export const QUERY = gql`
  query FIND_PROJECT_BY_USENAME_TITLE(
    $projectTitle: String!
    $userName: String!
  ) {
    project: projectByUserAndTitle(
      projectTitle: $projectTitle
      userName: $userName
    ) {
      id
      title
      description
      code
      mainImage
      createdAt
      cadPackage
      user {
        id
        userName
        image
      }
    }
  }
`

export interface Project {
  id: string
  title: string
  code: string
  description: string
  mainImage: string
  createdAt: string
  cadPackage: 'openscad' | 'cadquery'
  user: {
    id: string
    userName: string
    image: string
  }
}

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Project not found</div>

interface SaveCodeArgs {
  input: any
  id: string
  isFork: boolean
}

export const Success = ({
  project,
  refetch,
}: {
  project: Project
  refetch: any
}) => {
  const [state, thunkDispatch] = useIdeState()


  return (
      <IdeContext.Provider value={{ state, thunkDispatch, project }}>
        <EmbedViewer project={project} />
      </IdeContext.Provider>
  )
}
