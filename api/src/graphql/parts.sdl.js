export const schema = gql`
  type Part {
    id: String!
    title: String!
    description: String
    code: String
    mainImage: String
    createdAt: DateTime!
    updatedAt: DateTime!
    user: User!
    userId: String!
    Comment: [Comment]!
    Reaction: [PartReaction]!
  }

  type Query {
    parts: [Part!]!
    part(id: String!): Part
  }

  input CreatePartInput {
    title: String!
    description: String
    code: String
    mainImage: String
    userId: String!
  }

  input UpdatePartInput {
    title: String
    description: String
    code: String
    mainImage: String
    userId: String
  }

  type Mutation {
    createPart(input: CreatePartInput!): Part!
    updatePart(id: String!, input: UpdatePartInput!): Part!
    deletePart(id: String!): Part!
  }
`
