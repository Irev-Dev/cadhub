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
    socialCards: [SocialCard!]! @skipAuth
    socialCard(id: String!): SocialCard @skipAuth
  }
`
