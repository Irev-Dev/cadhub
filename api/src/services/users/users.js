import { db } from 'src/lib/db'
import { requireAuth } from 'src/lib/auth'

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

export const createUser = ({ input }) => {
  console.log(input)
  console.log(JSON.stringify(input))
  requireAuth({ role: 'admin' })
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

export const deleteUser = ({ id }) => {
  requireAuth({ role: 'admin' })
  return db.user.delete({
    where: { id },
  })
}
