import { UserInputError } from '@redwoodjs/api'

import { db } from 'src/lib/db'


const validate = (input) => {
  if (input.email && !input.email.match(/[^@]+@[^.]+\..+/)) {
    throw new UserInputError("Can't create new contact", {
      messages: {
        email: ['is not formatted like an email address'],
      },
    })
  }
}

export const contacts = () => {
  return db.contact.findMany()
}

export const createContact = ({ input }) => {

  validate(input)
  return db.contact.create({ data: input })
}
