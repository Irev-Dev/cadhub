import { useMutation } from '@redwoodjs/web'

const UPDATE_PROJECT_MUTATION_HOOK = gql`
  mutation UpdateProjectMutationHook(
    $id: String!
    $input: UpdateProjectInput!
  ) {
    updateProject: updateProject(id: $id, input: $input) {
      id
    }
  }
`

export const useUpdateProject = ({ onCompleted }) => {
  const [updateProject, { loading, error }] = useMutation(
    UPDATE_PROJECT_MUTATION_HOOK,
    { onCompleted }
  )

  return { updateProject, loading, error }
}
