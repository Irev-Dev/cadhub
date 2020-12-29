import { useMutation, useFlash } from '@redwoodjs/web'
import { navigate, routes } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'

import PartProfile from 'src/components/PartProfile'

export const QUERY = gql`
  query FIND_PART_BY_USERNAME_TITLE(
    $userName: String!
    $partTitle: String
    $currentUserId: String
  ) {
    userPart: userName(userName: $userName) {
      id
      name
      userName
      bio
      image
      Part(partTitle: $partTitle) {
        id
        title
        description
        code
        mainImage
        createdAt
        updatedAt
        userId
        Reaction {
          emote
        }
        userReactions: Reaction(userId: $currentUserId) {
          emote
        }
        Comment {
          id
          text
          user {
            userName
            image
          }
        }
      }
    }
  }
`

const UPDATE_PART_MUTATION = gql`
  mutation UpdatePartMutation($id: String!, $input: UpdatePartInput!) {
    updatePart: updatePart(id: $id, input: $input) {
      id
      title
      user {
        id
        userName
      }
    }
  }
`
const CREATE_PART_MUTATION = gql`
  mutation CreatePartMutation($input: CreatePartInput!) {
    createPart(input: $input) {
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
  mutation ToggleReactionMutation($input: TogglePartReactionInput!) {
    togglePartReaction(input: $input) {
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
const DELETE_PART_MUTATION = gql`
  mutation DeletePartMutation($id: String!) {
    deletePart(id: $id) {
      id
      title
      user {
        id
        userName
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => <div>Error: {error.message}</div>

export const Success = ({ userPart, variables: { isEditable }, refetch }) => {
  const { currentUser } = useAuth()
  const { addMessage } = useFlash()
  const [updateUser, { loading, error }] = useMutation(UPDATE_PART_MUTATION, {
    onCompleted: ({ updatePart }) => {
      navigate(
        routes.part({
          userName: updatePart.user.userName,
          partTitle: updatePart.title,
        })
      )
      addMessage('Part updated.', { classes: 'rw-flash-success' })
    },
  })
  const [createPart] = useMutation(CREATE_PART_MUTATION, {
    onCompleted: ({ createPart }) => {
      navigate(
        routes.part({
          userName: createPart?.user?.userName,
          partTitle: createPart?.title,
        })
      )
      addMessage('Part Created.', { classes: 'rw-flash-success' })
    },
  })
  const onSave = (id, input) => {
    if (!id) {
      createPart({ variables: { input } })
      return
    }
    updateUser({ variables: { id, input } })
  }
  const [deletePart] = useMutation(DELETE_PART_MUTATION, {
    onCompleted: ({ deletePart }) => {
      navigate(routes.home())
      addMessage('Part deleted.', { classes: 'rw-flash-success' })
    },
  })

  const onDelete = () => {
    userPart?.Part?.id && deletePart({ variables: { id: userPart?.Part?.id } })
  }

  const [toggleReaction] = useMutation(TOGGLE_REACTION_MUTATION, {
    onCompleted: () => refetch(),
  })
  const onReaction = (emote) =>
    toggleReaction({
      variables: {
        input: {
          emote,
          userId: currentUser.sub,
          partId: userPart?.Part?.id,
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
          partId: userPart?.Part?.id,
        },
      },
    })

  return (
    <PartProfile
      userPart={userPart}
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
