import { db } from 'src/lib/db'
import { requireAuth } from 'src/lib/auth'
import { requireOwnership } from 'src/lib/owner'

export const users = () => {
  requireAuth({ role: 'admin' })
  return db.user.findMany()
}

export const user = ({ id }) => {
  requireAuth()
  return db.user.findOne({
    where: { id },
  })
}

export const userName = ({ userName }) => {
  requireAuth()
  return db.user.findOne({
    where: { userName },
  })
}

export const createUser = ({ input }) => {
  requireAuth({ role: 'admin' })
  createUserInsecure({input})
}
export const createUserInsecure = ({ input }) => {
  return db.user.create({
    data: input,
  })
}

export const updateUser = ({ id, input }) => {
  requireAuth()
  return db.user.update({
    data: input,
    where: { id },
  })
}

export const updateUserByUserName = async ({ userName, input }) => {
  requireAuth()
  await requireOwnership({userName})
  return db.user.update({
    data: input,
    where: { userName },
  })
}

export const deleteUser = ({ id }) => {
  requireAuth({ role: 'admin' })
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
