export const schema = gql`
  type Comment {
    id: String!
    text: String!
    user: User!
    userId: String!
    part: Part!
    partId: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    comments: [Comment!]!
    comment(id: String!): Comment
  }

  input CreateCommentInput {
    text: String!
    userId: String!
    partId: String!
  }

  input UpdateCommentInput {
    text: String
    userId: String
    partId: String
  }

  type Mutation {
    createComment(input: CreateCommentInput!): Comment!
    updateComment(id: String!, input: UpdateCommentInput!): Comment!
    deleteComment(id: String!): Comment!
  }
`
