export const schema = gql`
  type Comment {
    id: String!
    text: String!
    user: User!
    userId: String!
    project: Project!
    projectId: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    comments: [Comment!]! @skipAuth
    comment(id: String!): Comment @skipAuth
  }

  input CreateCommentInput {
    text: String!
    userId: String!
    projectId: String!
  }

  input UpdateCommentInput {
    text: String
    userId: String
    projectId: String
  }

  type Mutation {
    createComment(input: CreateCommentInput!): Comment! @requireAuth
    updateComment(id: String!, input: UpdateCommentInput!): Comment!
      @requireAuth
    deleteComment(id: String!): Comment! @requireAuth
  }
`
