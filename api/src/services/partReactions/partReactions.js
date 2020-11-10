import { UserInputError } from '@redwoodjs/api'

import { requireAuth } from 'src/lib/auth'
import { requireOwnership } from 'src/lib/owner'
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

export const togglePartReaction = async ({ input }) => {
  // if write fails emote_userId_partId @@unique constraint, then delete it instead
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
    dbPromise = await db.partReaction.create({
      data: foreignKeyReplacement(input),
    })
  } catch (e) {
    dbPromise = db.partReaction.delete({
      where: { emote_userId_partId: inputClone },
    })
  }
  return dbPromise
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
