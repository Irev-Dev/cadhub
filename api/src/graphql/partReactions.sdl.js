export const schema = gql`
  type PartReaction {
    id: String!
    emote: String!
    user: User!
    userId: String!
    part: Part!
    partId: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    partReactions: [PartReaction!]!
    partReaction(id: String!): PartReaction
  }

  input TogglePartReactionInput {
    emote: String!
    userId: String!
    partId: String!
  }

  input UpdatePartReactionInput {
    emote: String
    userId: String
    partId: String
  }

  type Mutation {
    togglePartReaction(input: TogglePartReactionInput!): PartReaction!
    updatePartReaction(
      id: String!
      input: UpdatePartReactionInput!
    ): PartReaction!
    deletePartReaction(id: String!): PartReaction!
  }
`
