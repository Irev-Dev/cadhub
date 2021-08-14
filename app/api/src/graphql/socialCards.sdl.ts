export const schema = gql`
  type SocialCard {
    id: String!
    projectId: String!
    project: Project!
    createdAt: DateTime!
    updatedAt: DateTime!
    url: String
    outOfDate: Boolean!
  }

  type Query {
    socialCards: [SocialCard!]!
    socialCard(id: String!): SocialCard
  }

  input CreateSocialCardInput {
    projectId: String!
    url: String
    outOfDate: Boolean!
  }

  input UpdateSocialCardInput {
    projectId: String
    url: String
    outOfDate: Boolean
  }

  type Mutation {
    createSocialCard(input: CreateSocialCardInput!): SocialCard!
    updateSocialCard(id: String!, input: UpdateSocialCardInput!): SocialCard!
    deleteSocialCard(id: String!): SocialCard!
    updateSocialCardByProjectId(projectId: String!, url: String!): SocialCard!
  }
`
