import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { navigate, routes } from '@redwoodjs/router'
import { QUERY as UsersProjectsQuery } from 'src/components/ProjectsOfUserCell'
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
export const FORK_PROJECT_MUTATION = gql`
  mutation ForkProjectMutation($input: CreateProjectInput!) {
    forkProject(input: $input) {
      id
      title
      user {
        userName
      }
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
  const [forkProject] = useMutation(FORK_PROJECT_MUTATION, {
    refetchQueries: [
      {
        query: UsersProjectsQuery,
        variables: { userName: user?.userName },
      },
    ],
    onCompleted: ({ forkProject }) => {
      navigate(
        routes.ide({
          userName: forkProject?.user?.userName,
          projectTitle: forkProject?.title,
        })
      )
      toast.success('Project Forked.')
    },
  })

  const saveCode = async ({ input, id, isFork }: SaveCodeArgs) => {
    if (!isFork) {
      await updateProject({ variables: { id, input } })
      refetch()
      return
    }
    forkProject({ variables: { input } })
  }
  return <DevIdePage cadPackage={project?.cadPackage} project={project} />
}
