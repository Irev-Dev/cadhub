import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { navigate, routes } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'

import ProjectProfile from 'src/components/ProjectProfile/ProjectProfile'
import { QUERY as PROJECT_REACTION_QUERY } from 'src/components/ProjectReactionsCell'

export const QUERY = gql`
  query FIND_PROJECT_BY_USERNAME_TITLE(
    $userName: String!
    $projectTitle: String
    $currentUserId: String
  ) {
    userProject: userName(userName: $userName) {
      id
      name
      userName
      bio
      image
      Project(projectTitle: $projectTitle) {
        id
        title
        description
        code
        mainImage
        createdAt
        updatedAt
        userId
        cadPackage
        Reaction {
          emote
        }
        userReactions: Reaction(userId: $currentUserId) {
          emote
        }
        Comment {
          id
          text
          createdAt
          user {
            userName
            image
          }
        }
      }
    }
  }
`

const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProjectMutation($id: String!, $input: UpdateProjectInput!) {
    updateProject: updateProject(id: $id, input: $input) {
      id
      title
      description
      code
      mainImage
      userId
      Reaction {
        emote
      }
      user {
        id
        userName
      }
    }
  }
`
export const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProjectMutation($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      title
      user {
        id
        userName
      }
    }
  }
`
const TOGGLE_REACTION_MUTATION = gql`
  mutation ToggleReactionMutation($input: ToggleProjectReactionInput!) {
    toggleProjectReaction(input: $input) {
      id
      emote
    }
  }
`
const CREATE_COMMENT_MUTATION = gql`
  mutation CreateCommentMutation($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      text
    }
  }
`
const DELETE_PROJECT_MUTATION = gql`
  mutation DeleteProjectMutation($id: String!) {
    deleteProject(id: $id) {
      id
      title
      user {
        id
        userName
      }
    }
  }
`

export const Loading = () => <div className="h-screen">Loading...</div>

export const Empty = () => <div className="h-full">Empty</div>

export const Failure = ({ error }) => <div>Error: {error.message}</div>

export const Success = ({
  userProject,
  variables: { isEditable },
  refetch,
}) => {
  const { currentUser } = useAuth()
  const [updateProject, { loading, error }] = useMutation(
    UPDATE_PROJECT_MUTATION,
    {
      onCompleted: ({ updateProject }) => {
        navigate(
          routes.project({
            userName: updateProject.user.userName,
            projectTitle: updateProject.title,
          })
        )
        toast.success('Project updated.')
      },
    }
  )
  const [createProject] = useMutation(CREATE_PROJECT_MUTATION, {
    onCompleted: ({ createProject }) => {
      navigate(
        routes.project({
          userName: createProject?.user?.userName,
          projectTitle: createProject?.title,
        })
      )
      toast.success('Project Created.')
    },
  })
  const onSave = async (id, input) => {
    if (!id) {
      await createProject({ variables: { input } })
    } else {
      await updateProject({ variables: { id, input } })
    }
    refetch()
  }
  const [deleteProject] = useMutation(DELETE_PROJECT_MUTATION, {
    onCompleted: ({ deleteProject }) => {
      navigate(routes.home())
      toast.success('Project deleted.')
    },
  })

  const onDelete = () => {
    userProject?.Project?.id &&
      deleteProject({ variables: { id: userProject?.Project?.id } })
  }

  const [toggleReaction] = useMutation(TOGGLE_REACTION_MUTATION, {
    onCompleted: () => refetch(),
    refetchQueries: [
      {
        query: PROJECT_REACTION_QUERY,
        variables: { projectId: userProject?.Project?.id },
      },
    ],
  })
  const onReaction = (emote) =>
    toggleReaction({
      variables: {
        input: {
          emote,
          userId: currentUser.sub,
          projectId: userProject?.Project?.id,
        },
      },
    })

  const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
    onCompleted: () => refetch(),
  })
  const onComment = (text) =>
    createComment({
      variables: {
        input: {
          text,
          userId: currentUser.sub,
          projectId: userProject?.Project?.id,
        },
      },
    })

  return (
    <ProjectProfile
      userProject={userProject}
      onSave={onSave}
      onDelete={onDelete}
      loading={loading}
      error={error}
      isEditable={isEditable}
      onReaction={onReaction}
      onComment={onComment}
    />
  )
}
