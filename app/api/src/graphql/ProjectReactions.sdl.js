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
    projectReactions: [ProjectReaction!]!
    projectReaction(id: String!): ProjectReaction
    projectReactionsByProjectId(projectId: String!): [ProjectReaction!]!
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
    updateProjectReaction(
      id: String!
      input: UpdateProjectReactionInput!
    ): ProjectReaction!
    deleteProjectReaction(id: String!): ProjectReaction!
  }
`
