import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import useUser from 'src/helpers/hooks/useUser'
import DevIdePage from 'src/pages/DevIdePage/DevIdePage'

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
  description: string
  code: string
  mainImage: string
  createdAt: string
  cadPackage: 'openscad' | 'cadquery'
  user: {
    id: string
    userName: string
    image: string
  }
}

export const UPDATE_PROJECT_MUTATION_IDE = gql`
  mutation UpdateProjectMutationIde($id: String!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
    }
  }
`

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
  const { user } = useUser()
  const [updateProject, { loading, error }] = useMutation(
    UPDATE_PROJECT_MUTATION_IDE,
    {
      onCompleted: () => {
        toast.success('Project updated.')
      },
    }
  )
  return <DevIdePage cadPackage={project?.cadPackage} project={project} />
}
