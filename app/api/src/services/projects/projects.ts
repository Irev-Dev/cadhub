import type { Prisma } from '@prisma/client'
import type { ResolverArgs } from '@redwoodjs/api'

import { db } from 'src/lib/db'
import {
  foreignKeyReplacement,
  enforceAlphaNumeric,
  generateUniqueString,
  generateUniqueStringWithoutSeed,
  destroyImage,
} from 'src/services/helpers'
import { requireAuth } from 'src/lib/auth'
import { requireOwnership } from 'src/lib/owner'

export const projects = ({ userName }) => {
  if (!userName) {
    return db.project.findMany({ where: { deleted: false } })
  }
  return db.project.findMany({
    where: {
      deleted: false,
      user: {
        userName,
      },
    },
  })
}

export const project = ({ id }: Prisma.ProjectWhereUniqueInput) => {
  return db.project.findUnique({
    where: { id },
  })
}
export const projectByUserAndTitle = async ({ userName, projectTitle }) => {
  const user = await db.user.findUnique({
    where: {
      userName,
    },
  })
  return db.project.findUnique({
    where: {
      title_userId: {
        title: projectTitle,
        userId: user.id,
      },
    },
  })
}
const isUniqueProjectTitle = (userId: string) => async (seed: string) =>
  db.project.findUnique({
    where: {
      title_userId: {
        title: seed,
        userId,
      },
    },
  })

interface CreateProjectArgs {
  input: Prisma.ProjectCreateArgs['data']
}

export const createProject = async ({ input }: CreateProjectArgs) => {
  requireAuth()
  console.log(input.userId)
  const isUniqueCallback = isUniqueProjectTitle(input.userId)
  let title = input.title
  if (!title) {
    title = await generateUniqueStringWithoutSeed(isUniqueCallback)
  }
  return db.project.create({
    data: foreignKeyReplacement({
      ...input,
      title,
    }),
  })
}

export const forkProject = async ({ input }) => {
  // Only difference between create and fork project is that fork project will generate a unique title
  // (for the user) if there is a conflict
  const isUniqueCallback = isUniqueProjectTitle(input.userId)
  const title = await generateUniqueString(input.title, isUniqueCallback)
  // TODO change the description to `forked from userName/projectName ${rest of description}`
  return db.project.create({
    data: foreignKeyReplacement({ ...input, title }),
  })
}

interface UpdateProjectArgs extends Prisma.ProjectWhereUniqueInput {
  input: Prisma.ProjectUpdateInput
}

export const updateProject = async ({ id, input }: UpdateProjectArgs) => {
  requireAuth()
  await requireOwnership({ projectId: id })
  if (input.title) {
    input.title = enforceAlphaNumeric(input.title)
  }
  const originalProject = await db.project.findUnique({ where: { id } })
  const imageToDestroy =
    originalProject.mainImage !== input.mainImage &&
    input.mainImage &&
    originalProject.mainImage
  const update = await db.project.update({
    data: foreignKeyReplacement(input),
    where: { id },
  })
  if (imageToDestroy) {
    console.log(
      `image destroyed, publicId: ${imageToDestroy}, projectId: ${id}, replacing image is ${input.mainImage}`
    )
    // destroy after the db has been updated
    destroyImage({ publicId: imageToDestroy })
  }
  return update
}

export const deleteProject = async ({ id }: Prisma.ProjectWhereUniqueInput) => {
  requireAuth()
  await requireOwnership({ projectId: id })
  return db.project.update({
    data: {
      deleted: true,
    },
    where: { id },
  })
}

export const Project = {
  user: (_obj, { root }: ResolverArgs<ReturnType<typeof project>>) =>
    db.project.findUnique({ where: { id: root.id } }).user(),
  Comment: (_obj, { root }: ResolverArgs<ReturnType<typeof project>>) =>
    db.project
      .findUnique({ where: { id: root.id } })
      .Comment({ orderBy: { createdAt: 'desc' } }),
  Reaction: (_obj, { root }: ResolverArgs<ReturnType<typeof project>>) =>
    db.project
      .findUnique({ where: { id: root.id } })
      .Reaction({ where: { userId: _obj.userId } }),
}
