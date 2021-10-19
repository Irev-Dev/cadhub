import { UserInputError, ForbiddenError } from '@redwoodjs/graphql-server'
import { db } from 'src/lib/db'
import { requireAuth } from 'src/lib/auth'
import { requireOwnership } from 'src/lib/owner'
import { enforceAlphaNumeric, destroyImage } from 'src/services/helpers'
import type { Prisma } from '@prisma/client'

function userNameVerification(userName: string): string {
  if (userName.length < 5) {
    throw new ForbiddenError('userName too short')
  }
  if (userName && ['new', 'edit', 'update'].includes(userName)) {
    //TODO complete this and use a regexp so that it's not case sensitive, don't want someone with the userName eDiT
    throw new UserInputError(
      `You've tried to used a protected word as you userName, try something other than `
    )
  }
  if (userName) {
    return enforceAlphaNumeric(userName)
  }
}

function nameVerification(name: string) {
  if (typeof name === 'string' && name.length < 3) {
    throw new ForbiddenError('name too short')
  }
}

export const users = () => {
  requireAuth({ role: 'admin' })
  return db.user.findMany()
}

export const user = ({ id }) => {
  return db.user.findUnique({
    where: { id },
  })
}

export const userName = ({ userName }) => {
  return db.user.findUnique({
    where: { userName },
  })
}

export const createUser = ({ input }) => {
  requireAuth({ role: 'admin' })
  createUserInsecure({ input })
}
export const createUserInsecure = ({
  input,
}: {
  input: Prisma.UserUncheckedCreateInput
}) => {
  if (typeof input.userName === 'string') {
    input.userName = userNameVerification(input.userName)
  }
  nameVerification(input.name)
  return db.user.create({
    data: input,
  })
}

export const updateUser = ({
  id,
  input,
}: {
  id: string
  input: Prisma.UserUncheckedCreateInput
}) => {
  requireAuth()
  if (typeof input.userName === 'string') {
    input.userName = userNameVerification(input.userName)
  }
  nameVerification(input.name)
  return db.user.update({
    data: input,
    where: { id },
  })
}

export const updateUserByUserName = async ({
  userName,
  input,
}: {
  userName: string
  input: Prisma.UserUncheckedCreateInput
}) => {
  requireAuth()
  await requireOwnership({ userName })
  if (typeof input.userName === 'string') {
    input.userName = userNameVerification(input.userName)
  }
  nameVerification(input.name)
  const originalProject = await db.user.findUnique({ where: { userName } })
  const imageToDestroy =
    originalProject.image !== input.image && originalProject.image
  const update = await db.user.update({
    data: input,
    where: { userName },
  })
  if (imageToDestroy) {
    // destroy after the db has been updated
    destroyImage({ publicId: imageToDestroy })
  }
  return update
}

export const deleteUser = ({ id }) => {
  requireAuth({ role: 'admin' })
  return db.user.delete({
    where: { id },
  })
}

export const User = {
  Projects: (_obj, { root }) =>
    db.user.findUnique({ where: { id: root.id } }).Project(),
  Project: (_obj, { root }) =>
    _obj.projectTitle &&
    db.project.findUnique({
      where: {
        title_userId: {
          title: _obj.projectTitle,
          userId: root.id,
        },
      },
    }),
  Reaction: (_obj, { root }) =>
    db.user.findUnique({ where: { id: root.id } }).Reaction(),
  Comment: (_obj, { root }) =>
    db.user.findUnique({ where: { id: root.id } }).Comment(),
  SubjectAccessRequest: (_obj, { root }) =>
    db.user.findUnique({ where: { id: root.id } }).SubjectAccessRequest(),
}
