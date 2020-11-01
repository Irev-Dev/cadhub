import { db } from 'src/lib/db'
import { foreignKeyReplacement } from 'src/services/helpers'
import { user } from 'src/services/users/users'

export const parts = () => {
  return db.part.findMany()
}

export const part = ({ id }) => {
  return db.part.findOne({
    where: { id },
  })
}

export const createPart = async ({ input }) => {
  return db.part.create({
    data: foreignKeyReplacement(input),
  })
}

export const updatePart = ({ id, input }) => {
  return db.part.update({
    data: foreignKeyReplacement(input),
    where: { id },
  })
}

export const deletePart = ({ id }) => {
  return db.part.delete({
    where: { id },
  })
}

export const Part = {
  user: (_obj, { root }) => db.part.findOne({ where: { id: root.id } }).user(),
  Comment: (_obj, { root }) =>
    db.part.findOne({ where: { id: root.id } }).Comment(),
  Reaction: (_obj, { root }) =>
    db.part.findOne({ where: { id: root.id } }).Reaction(),
}
