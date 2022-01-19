import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { navigate, routes } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'
import { makeStlDownloadHandler } from 'src/helpers/download_stl'
import { useIdeState } from 'src/helpers/hooks/useIdeState'
import { IdeContext } from 'src/helpers/hooks/useIdeContext'
import { CREATE_PROJECT_MUTATION } from 'src/components/NavPlusButton/NavPlusButton'

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
        cadPackage
        forkedFrom {
          id
          title
          user {
            id
            userName
          }
        }
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

export const Success = ({ userProject, refetch }) => {
  const { currentUser } = useAuth()
  const [state, thunkDispatch] = useIdeState()
  const [updateProject] = useMutation(UPDATE_PROJECT_MUTATION, {
    onCompleted: ({ updateProject }) => {
      navigate(
        routes.project({
          userName: updateProject.user.userName,
          projectTitle: updateProject.title,
        })
      )
      toast.success('Project updated.')
    },
  })
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
    onCompleted: () => {
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

  const onStlDownload = makeStlDownloadHandler({
    type: state.objectData?.type,
    ideType: state.ideType,
    geometry: state.objectData?.data,
    quality: state.objectData?.quality,
    fileName: `${userProject.Project.title}.stl`,
    thunkDispatch,
  })

  return (
    <IdeContext.Provider
      value={{
        state,
        thunkDispatch,
        project: {
          ...userProject?.Project,
          user: {
            id: userProject.id,
            image: userProject.image,
            userName: userProject.userName,
          },
        },
      }}
    >
      <ProjectProfile
        userProject={userProject}
        onSave={onSave}
        onDelete={onDelete}
        onReaction={onReaction}
        onComment={onComment}
        onStlDownload={onStlDownload}
      />
    </IdeContext.Provider>
  )
}
