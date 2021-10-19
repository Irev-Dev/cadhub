export const schema = gql`
  type Envelope {
    from: String
    to: [String!]!
  }

  type EmailResponse {
    accepted: [String!]!
    rejected: [String!]!
  }

  input Email {
    subject: String!
    body: String!
  }

  type Mutation {
    sendAllUsersEmail(input: Email!): EmailResponse! @requireAuth
  }
`
