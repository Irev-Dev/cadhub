import { db } from 'src/lib/db'
import { foreignKeyReplacement } from 'src/services/helpers'

export const comments = () => {
  return db.comment.findMany()
}

export const comment = ({ id }) => {
  return db.comment.findOne({
    where: { id },
  })
}

export const createComment = ({ input }) => {
  return db.comment.create({
    data: foreignKeyReplacement(input),
  })
}

export const updateComment = ({ id, input }) => {
  return db.comment.update({
    data: foreignKeyReplacement(input),
    where: { id },
  })
}

export const deleteComment = ({ id }) => {
  return db.comment.delete({
    where: { id },
  })
}

export const Comment = {
  user: (_obj, { root }) =>
    db.comment.findOne({ where: { id: root.id } }).user(),
  part: (_obj, { root }) =>
    db.comment.findOne({ where: { id: root.id } }).part(),
}
