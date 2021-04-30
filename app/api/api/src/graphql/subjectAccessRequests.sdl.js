export const schema = gql`
  type SubjectAccessRequest {
    id: String!
    comment: String!
    payload: String!
    user: User!
    userId: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    subjectAccessRequests: [SubjectAccessRequest!]!
    subjectAccessRequest(id: String!): SubjectAccessRequest
  }

  input CreateSubjectAccessRequestInput {
    comment: String!
    payload: String!
    userId: String!
  }

  input UpdateSubjectAccessRequestInput {
    comment: String
    payload: String
    userId: String
  }

  type Mutation {
    createSubjectAccessRequest(
      input: CreateSubjectAccessRequestInput!
    ): SubjectAccessRequest!
    updateSubjectAccessRequest(
      id: String!
      input: UpdateSubjectAccessRequestInput!
    ): SubjectAccessRequest!
    deleteSubjectAccessRequest(id: String!): SubjectAccessRequest!
  }
`
