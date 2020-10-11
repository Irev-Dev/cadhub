export const schema = gql`
  type Part {
    id: Int!
    title: String!
    description: String!
    code: String!
    mainImage: String!
    createdAt: DateTime!
  }

  type Query {
    parts: [Part!]!
    part(id: Int!): Part
  }

  input CreatePartInput {
    title: String!
    description: String!
    code: String
    mainImage: String
  }

  input UpdatePartInput {
    title: String
    description: String
    code: String
    mainImage: String
  }

  type Mutation {
    createPart(input: CreatePartInput!): Part!
    updatePart(id: Int!, input: UpdatePartInput!): Part!
    deletePart(id: Int!): Part!
  }
`
