export const schema = gql`
  type ProjectReaction {
    id: String!
    emote: String!
    user: User!
    userId: String!
    project: Project!
    projectId: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    projectReactions: [ProjectReaction!]! @skipAuth
    projectReaction(id: String!): ProjectReaction @skipAuth
    projectReactionsByProjectId(projectId: String!): [ProjectReaction!]!
      @skipAuth
  }

  input ToggleProjectReactionInput {
    emote: String!
    userId: String!
    projectId: String!
  }

  input UpdateProjectReactionInput {
    emote: String
    userId: String
    projectId: String
  }

  type Mutation {
    toggleProjectReaction(input: ToggleProjectReactionInput!): ProjectReaction!
      @requireAuth
    updateProjectReaction(
      id: String!
      input: UpdateProjectReactionInput!
    ): ProjectReaction! @requireAuth
    deleteProjectReaction(id: String!): ProjectReaction! @requireAuth
  }
`
