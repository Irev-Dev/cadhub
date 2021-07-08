export const schema = gql`
  type Project {
    id: String!
    title: String!
    description: String
    code: String
    mainImage: String
    createdAt: DateTime!
    updatedAt: DateTime!
    user: User!
    userId: String!
    deleted: Boolean!
    cadPackage: CadPackage!
    Comment: [Comment]!
    Reaction(userId: String): [ProjectReaction]!
  }

  enum CadPackage {
    openscad
    cadquery
  }

  type Query {
    projects(userName: String): [Project!]!
    project(id: String!): Project
    projectByUserAndTitle(userName: String!, projectTitle: String!): Project
  }

  input CreateProjectInput {
    title: String
    description: String
    code: String
    mainImage: String
    userId: String!
    cadPackage: CadPackage!
  }

  input UpdateProjectInput {
    title: String
    description: String
    code: String
    mainImage: String
    userId: String
  }

  type Mutation {
    createProject(input: CreateProjectInput!): Project!
    forkProject(input: CreateProjectInput!): Project!
    updateProject(id: String!, input: UpdateProjectInput!): Project!
    deleteProject(id: String!): Project!
  }
`
