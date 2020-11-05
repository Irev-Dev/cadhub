import { db } from 'src/lib/db'

export const users = () => {
  return db.user.findMany()
}

export const user = ({ id }) => {
  return db.user.findOne({
    where: { id },
  })
}

export const userName = ({ userName }) => {
  return db.user.findOne({
    where: { userName },
  })
}

export const createUser = ({ input }) => {
  return db.user.create({
    data: input,
  })
}

export const updateUser = ({ id, input }) => {
  return db.user.update({
    data: input,
    where: { id },
  })
}

export const updateUserByUserName = ({ userName, input }) => {
  return db.user.update({
    data: input,
    where: { userName },
  })
}

export const deleteUser = ({ id }) => {
  return db.user.delete({
    where: { id },
  })
}

export const User = {
  Part: (_obj, { root }) => db.user.findOne({ where: { id: root.id } }).Part(),
  Reaction: (_obj, { root }) =>
    db.user.findOne({ where: { id: root.id } }).Reaction(),
  Comment: (_obj, { root }) =>
    db.user.findOne({ where: { id: root.id } }).Comment(),
}
