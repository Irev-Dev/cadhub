export const schema = gql`
  type User {
    id: String!
    userName: String!
    email: String!
    name: String
    createdAt: DateTime!
    updatedAt: DateTime!
    image: String
    bio: String
    Projects: [Project]!
    Project(projectTitle: String): Project
    Reaction: [ProjectReaction]!
    Comment: [Comment]!
    SubjectAccessRequest: [SubjectAccessRequest]!
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: String!): User @skipAuth
    userName(userName: String!): User @skipAuth
  }

  input CreateUserInput {
    userName: String!
    email: String!
    name: String
    image: String
    bio: String
  }

  input UpdateUserInput {
    userName: String
    email: String
    name: String
    image: String
    bio: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: String!, input: UpdateUserInput!): User! @requireAuth
    updateUserByUserName(userName: String!, input: UpdateUserInput!): User!
      @requireAuth
    deleteUser(id: String!): User! @requireAuth
  }
`
