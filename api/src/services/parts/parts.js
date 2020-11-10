import { db } from 'src/lib/db'
import { foreignKeyReplacement, enforceAlphaNumeric } from 'src/services/helpers'
import { requireAuth } from 'src/lib/auth'
import { requireOwnership } from 'src/lib/owner'

export const parts = () => {
  return db.part.findMany()
}

export const part = ({ id }) => {
  return db.part.findOne({
    where: { id },
  })
}
export const partByUserAndTitle = async ({ userName, partTitle }) => {
  const user = await db.user.findOne({
    where: {
      userName
    }
  })
  return db.part.findOne({
    where: {
      title_userId: {
        title: partTitle,
        userId: user.id,
      }
    },
  })
}

export const createPart = async ({ input }) => {
  requireAuth()
  return db.part.create({
    data: foreignKeyReplacement(input),
  })
}

export const updatePart = async ({ id, input }) => {
  requireAuth()
  await requireOwnership({partId: id})
  if(input.title) {
    input.title = enforceAlphaNumeric(input.title)
  }
  return db.part.update({
    data: foreignKeyReplacement(input),
    where: { id },
  })
}

export const deletePart = ({ id }) => {
  requireAuth()
  return db.part.delete({
    where: { id },
  })
}

export const Part = {
  user: (_obj, { root }) => db.part.findOne({ where: { id: root.id } }).user(),
  Comment: (_obj, { root }) =>
    db.part.findOne({ where: { id: root.id } }).Comment(),
  Reaction: (_obj, { root }) =>
    db.part.findOne({ where: { id: root.id } }).Reaction({where: {userId: _obj.userId}}),
}
