export const schema = gql`
  type Envelope {
    from: String
    to: [String!]!
  }

  type EmailResponse {
    accepted: [String!]!
    rejected: [String!]!
    messageId: String!
    envelope: Envelope
  }

  input Email {
    subject: String!
    body: String!
  }

  type Mutation {
    sendAllUsersEmail(input: Email!): EmailResponse!
  }
`
