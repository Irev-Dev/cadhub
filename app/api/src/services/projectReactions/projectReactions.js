import { UserInputError } from '@redwoodjs/api'

import { requireAuth } from 'src/lib/auth'
import { requireOwnership } from 'src/lib/owner'
import { db } from 'src/lib/db'
import { foreignKeyReplacement } from 'src/services/helpers'

export const projectReactions = () => {
  return db.projectReaction.findMany()
}

export const projectReaction = ({ id }) => {
  return db.projectReaction.findUnique({
    where: { id },
  })
}

export const projectReactionsByProjectId = ({ projectId }) => {
  return db.projectReaction.findMany({
    where: { projectId },
  })
}

export const toggleProjectReaction = async ({ input }) => {
  // if write fails emote_userId_projectId @@unique constraint, then delete it instead
  requireAuth()
  await requireOwnership({ userId: input?.userId })
  const legalReactions = ['❤️', '👍', '😄', '🙌'] // TODO figure out a way of sharing code between FE and BE, so this is consistent with web/src/components/EmojiReaction/EmojiReaction.js
  if (!legalReactions.includes(input.emote)) {
    throw new UserInputError(
      `You can't react with '${
        input.emote
      }', only the following are allowed: ${legalReactions.join(', ')}`
    )
  }
  let dbPromise
  const inputClone = { ...input } // TODO foreignKeyReplacement mutates input, which I should fix but am lazy right now
  try {
    dbPromise = await db.projectReaction.create({
      data: foreignKeyReplacement(input),
    })
  } catch (e) {
    dbPromise = db.projectReaction.delete({
      where: { emote_userId_projectId: inputClone },
    })
  }
  return dbPromise
}

export const updateProjectReaction = ({ id, input }) => {
  return db.projectReaction.update({
    data: foreignKeyReplacement(input),
    where: { id },
  })
}

export const deleteProjectReaction = ({ id }) => {
  return db.projectReaction.delete({
    where: { id },
  })
}

export const ProjectReaction = {
  user: (_obj, { root }) =>
    db.projectReaction.findUnique({ where: { id: root.id } }).user(),
  project: (_obj, { root }) =>
    db.projectReaction.findUnique({ where: { id: root.id } }).project(),
}
