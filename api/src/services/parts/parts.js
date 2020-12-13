import { db } from 'src/lib/db'
import {
  foreignKeyReplacement,
  enforceAlphaNumeric,
  generateUniqueString,
} from 'src/services/helpers'
import { requireAuth } from 'src/lib/auth'
import { requireOwnership } from 'src/lib/owner'

export const parts = () => {
  return db.part.findMany({ where: { deleted: false } })
}

export const part = ({ id }) => {
  return db.part.findOne({
    where: { id },
  })
}
export const partByUserAndTitle = async ({ userName, partTitle }) => {
  const user = await db.user.findOne({
    where: {
      userName,
    },
  })
  return db.part.findOne({
    where: {
      title_userId: {
        title: partTitle,
        userId: user.id,
      },
    },
  })
}

export const createPart = async ({ input }) => {
  requireAuth()
  return db.part.create({
    data: foreignKeyReplacement(input),
  })
}

export const forkPart = async ({ input }) => {
  // Only difference between create nda clone part is that clone part will generate a unique title
  // (for the user) if there is a conflict
  const isUniqueCallback = async (seed) =>
    db.part.findOne({
      where: {
        title_userId: {
          title: seed,
          userId: input.userId,
        },
      },
    })
  const title = await generateUniqueString(input.title, isUniqueCallback)
  // TODO change the description to `forked from userName/partName ${rest of description}`
  return db.part.create({
    data: foreignKeyReplacement({ ...input, title }),
  })
}

export const updatePart = async ({ id, input }) => {
  requireAuth()
  await requireOwnership({ partId: id })
  if (input.title) {
    input.title = enforceAlphaNumeric(input.title)
  }
  return db.part.update({
    data: foreignKeyReplacement(input),
    where: { id },
  })
}

export const deletePart = async ({ id }) => {
  requireAuth()
  await requireOwnership({ partId: id })
  return db.part.update({
    data: {
      deleted: true,
    },
    where: { id },
  })
}

export const Part = {
  user: (_obj, { root }) => db.part.findOne({ where: { id: root.id } }).user(),
  Comment: (_obj, { root }) =>
    db.part.findOne({ where: { id: root.id } }).Comment(),
  Reaction: (_obj, { root }) =>
    db.part
      .findOne({ where: { id: root.id } })
      .Reaction({ where: { userId: _obj.userId } }),
}
