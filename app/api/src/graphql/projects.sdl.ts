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
    socialCard: SocialCard
    Comment: [Comment]!
    Reaction(userId: String): [ProjectReaction]!
    forkedFromId: String
    forkedFrom: Project
    childForks: [Project]!
  }

  enum CadPackage {
    openscad
    cadquery
    jscad
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

  input ForkProjectInput {
    userId: String!
    forkedFromId: String
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
    forkProject(input: ForkProjectInput!): Project!
    updateProject(id: String!, input: UpdateProjectInput!): Project!
    updateProjectImages(
      id: String!
      mainImage64: String
      socialCard64: String
    ): Project!
    deleteProject(id: String!): Project!
  }
`
