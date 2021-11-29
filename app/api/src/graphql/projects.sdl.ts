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

# should match enum in api/db/schema.prisma
  enum CadPackage {
    openscad
    cadquery
    jscad
    curv
  }

  type Query {
    projects(userName: String): [Project!]! @skipAuth
    project(id: String!): Project @skipAuth
    projectByUserAndTitle(userName: String!, projectTitle: String!): Project
      @skipAuth
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
    code: String
  }

  input UpdateProjectInput {
    title: String
    description: String
    code: String
    mainImage: String
    userId: String
  }

  type Mutation {
    createProject(input: CreateProjectInput!): Project! @requireAuth
    forkProject(input: ForkProjectInput!): Project! @requireAuth
    updateProject(id: String!, input: UpdateProjectInput!): Project!
      @requireAuth
    updateProjectImages(
      id: String!
      mainImage64: String
      socialCard64: String
    ): Project! @requireAuth
    deleteProject(id: String!): Project! @requireAuth
  }
`
