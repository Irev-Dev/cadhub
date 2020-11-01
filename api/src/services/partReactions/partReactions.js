import { db } from 'src/lib/db'
import { foreignKeyReplacement } from 'src/services/helpers'

export const partReactions = () => {
  return db.partReaction.findMany()
}

export const partReaction = ({ id }) => {
  return db.partReaction.findOne({
    where: { id },
  })
}

export const createPartReaction = ({ input }) => {
  return db.partReaction.create({
    data: foreignKeyReplacement(input),
  })
}

export const updatePartReaction = ({ id, input }) => {
  return db.partReaction.update({
    data: foreignKeyReplacement(input),
    where: { id },
  })
}

export const deletePartReaction = ({ id }) => {
  return db.partReaction.delete({
    where: { id },
  })
}

export const PartReaction = {
  user: (_obj, { root }) =>
    db.partReaction.findOne({ where: { id: root.id } }).user(),
  part: (_obj, { root }) =>
    db.partReaction.findOne({ where: { id: root.id } }).part(),
}
