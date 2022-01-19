import { ResolverArgs } from '@redwoodjs/graphql-server'
import type { Prisma, Project as ProjectType } from '@prisma/client'
import { uploadImage, makeSocialPublicIdServer } from 'src/lib/cloudinary'

import { db } from 'src/lib/db'
import {
  foreignKeyReplacement,
  enforceAlphaNumeric,
  generateUniqueString,
  generateUniqueStringWithoutSeed,
  destroyImage,
} from 'src/services/helpers'
import { requireAuth } from 'src/lib/auth'
import { requireOwnership, requireProjectOwnership } from 'src/lib/owner'
import { sendDiscordMessage } from 'src/lib/discord'

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
const isUniqueProjectTitle =
  (userId: string) =>
  async (seed: string): Promise<boolean> =>
    !!(await db.project.findUnique({
      where: {
        title_userId: {
          title: seed,
          userId,
        },
      },
    }))

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
  requireAuth()
  const projectData = await db.project.findUnique({
    where: {
      id: input.forkedFromId,
    },
  })
  const isUniqueCallback = isUniqueProjectTitle(input.userId)
  let title = projectData.title

  title = await generateUniqueString(title, isUniqueCallback)

  const { code, description, cadPackage } = projectData

  return db.project.create({
    data: foreignKeyReplacement({
      ...input,
      title,
      code: input.code || code,
      description,
      cadPackage,
    }),
  })
}

interface UpdateProjectArgs extends Prisma.ProjectWhereUniqueInput {
  input: Prisma.ProjectUpdateInput
}

export const updateProject = async ({ id, input }: UpdateProjectArgs) => {
  const checkSocialCardValidity = async (
    projectId: string,
    input: UpdateProjectArgs['input'],
    oldProject: ProjectType
  ) => {
    const titleChange = input.title && input.title !== oldProject.title
    const descriptionChange =
      input.description && input.description !== oldProject.description
    if (titleChange || descriptionChange) {
      const socialCard = await db.socialCard.findUnique({
        where: { projectId },
      })
      if (socialCard) {
        return db.socialCard.update({
          data: { outOfDate: true },
          where: { id: socialCard.id },
        })
      }
    }
  }
  requireAuth()
  const originalProject = await requireProjectOwnership({ projectId: id })
  if (input.title) {
    input.title = enforceAlphaNumeric(input.title)
  }
  const socialCardPromise = checkSocialCardValidity(id, input, originalProject)
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
    await destroyImage({ publicId: imageToDestroy })
  }
  await socialCardPromise
  return update
}

export const updateProjectImages = async ({
  id,
  mainImage64,
  socialCard64,
}: {
  id: string
  mainImage64?: string
  socialCard64?: string
}): Promise<ProjectType> => {
  requireAuth()
  const project = await requireProjectOwnership({ projectId: id })
  const replaceSocialCard = async () => {
    if (!socialCard64) {
      return
    }
    let publicId = ''
    let socialCardId = ''
    try {
      ;({ id: socialCardId, url: publicId } = await db.socialCard.findUnique({
        where: { projectId: id },
      }))
    } catch (e) {
      const { userName } = await db.user.findUnique({
        where: { id: project.userId },
      })
      publicId = makeSocialPublicIdServer(userName, project.title)
    }
    const imagePromise = uploadImage({
      image64: socialCard64,
      uploadPreset: 'CadHub_project_images',
      publicId,
      invalidate: true,
    })
    const saveOrUpdateSocialCard = () => {
      const data = {
        outOfDate: false,
        url: publicId,
      }
      if (socialCardId) {
        return db.socialCard.update({
          data,
          where: { projectId: id },
        })
      }
      return db.socialCard.create({
        data: {
          ...data,
          project: {
            connect: {
              id: id,
            },
          },
        },
      })
    }
    const socialCardUpdatePromise = saveOrUpdateSocialCard()
    const [socialCard] = await Promise.all([
      socialCardUpdatePromise,
      imagePromise,
    ])
    return socialCard
  }

  const updateMainImage = async (): Promise<ProjectType> => {
    if (!mainImage64) {
      return project
    }
    const { public_id: mainImage } = await uploadImage({
      image64: mainImage64,
      uploadPreset: 'CadHub_project_images',
      invalidate: true,
    })
    const projectPromise = db.project.update({
      data: {
        mainImage,
      },
      where: { id },
    })
    let imageDestroyPromise = new Promise((r) => r(null))
    if (project.mainImage) {
      console.log(
        `image destroyed, publicId: ${project.mainImage}, projectId: ${id}, replacing image is ${mainImage}`
      )
      // destroy after the db has been updated
      imageDestroyPromise = destroyImage({ publicId: project.mainImage })
    }
    const [updatedProject] = await Promise.all([
      projectPromise,
      imageDestroyPromise,
    ]).then(async (result) => {
      const { userName } = await db.user.findUnique({
        where: { id: project.userId },
      })
      sendDiscordMessage(
        [
          `${userName} just added an image to their ${project.cadPackage} project:`,
          `  =>  ${project.title}`,
          ``,
          `Check it out, leave a comment, make them feel welcome!`,
          `https://cadhub.xyz/u/${userName}/${project.title}`,
        ].join('\n'),
        `https://res.cloudinary.com/irevdev/image/upload/c_scale,w_700/v1/${mainImage}`
      )
      return result
    })
    return updatedProject
  }

  const [updatedProject] = await Promise.all([
    updateMainImage(),
    replaceSocialCard(),
  ])

  return updatedProject
}

export const deleteProject = async ({ id }: Prisma.ProjectWhereUniqueInput) => {
  requireAuth()
  await requireOwnership({ projectId: id })
  const project = await db.project.findUnique({
    where: { id },
  })
  const childrenDeletePromises = [
    db.comment.deleteMany({ where: { projectId: project.id } }),
    db.projectReaction.deleteMany({ where: { projectId: project.id } }),
    db.socialCard.deleteMany({ where: { projectId: project.id } }),
  ]
  await Promise.all(childrenDeletePromises)
  await db.project.delete({
    where: { id },
  })
  return project
}

export const Project = {
  forkedFrom: (_obj, { root }) =>
    root.forkedFromId &&
    db.project.findUnique({ where: { id: root.forkedFromId } }),
  childForks: (_obj, { root }) =>
    db.project.findMany({ where: { forkedFromId: root.id } }),
  user: (_obj, { root }: ResolverArgs<ReturnType<typeof project>>) =>
    db.user.findUnique({ where: { id: root.userId } }),
  socialCard: (_obj, { root }: ResolverArgs<ReturnType<typeof project>>) =>
    db.project.findUnique({ where: { id: root.id } }).socialCard(),
  Comment: (_obj, { root }: ResolverArgs<ReturnType<typeof project>>) =>
    db.project
      .findUnique({ where: { id: root.id } })
      .Comment({ orderBy: { createdAt: 'desc' } }),
  Reaction: (_obj, { root }: ResolverArgs<ReturnType<typeof project>>) =>
    db.project
      .findUnique({ where: { id: root.id } })
      .Reaction({ where: { userId: _obj.userId } }),
}
