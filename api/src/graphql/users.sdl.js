export const schema = gql`
  type User {
    id: Int!
    email: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    image: String
    bio: String
  }

  type Query {
    users: [User!]!
    user(id: Int!): User
  }

  input CreateUserInput {
    email: String!
    issuer: String!
    image: String
    bio: String
  }

  input UpdateUserInput {
    email: String
    issuer: String
    image: String
    bio: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: Int!, input: UpdateUserInput!): User!
    deleteUser(id: Int!): User!
  }
`
