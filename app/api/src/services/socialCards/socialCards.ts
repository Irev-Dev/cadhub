import type { Prisma } from '@prisma/client'
import type { ResolverArgs, BeforeResolverSpecType } from '@redwoodjs/api'

import { db } from 'src/lib/db'
import { requireAuth } from 'src/lib/auth'

// Used when the environment variable REDWOOD_SECURE_SERVICES=1
export const beforeResolver = (rules: BeforeResolverSpecType) => {
  rules.add(requireAuth)
}

export const socialCards = () => {
  return db.socialCard.findMany()
}

export const socialCard = ({ id }: Prisma.SocialCardWhereUniqueInput) => {
  return db.socialCard.findUnique({
    where: { id },
  })
}

interface CreateSocialCardArgs {
  input: Prisma.SocialCardCreateInput
}

export const createSocialCard = ({ input }: CreateSocialCardArgs) => {
  return db.socialCard.create({
    data: input,
  })
}

interface UpdateSocialCardArgs extends Prisma.SocialCardWhereUniqueInput {
  input: Prisma.SocialCardUpdateInput
}

export const updateSocialCard = ({ id, input }: UpdateSocialCardArgs) => {
  return db.socialCard.update({
    data: input,
    where: { id },
  })
}

export const updateSocialCardByProjectId = async ({
  projectId,
  url,
}: {
  url: string
  projectId: string
}) => {
  let id: string
  try {
    const socialCard = await db.project
      .findUnique({ where: { id: projectId } })
      .socialCard()
    id = socialCard.id
  } catch (e) {
    return db.socialCard.create({
      data: {
        url,
        project: {
          connect: {
            id: projectId,
          },
        },
      },
    })
  }

  return db.socialCard.update({
    data: { url },
    where: { id },
  })
}

export const deleteSocialCard = ({ id }: Prisma.SocialCardWhereUniqueInput) => {
  return db.socialCard.delete({
    where: { id },
  })
}

export const SocialCard = {
  project: (_obj, { root }: ResolverArgs<ReturnType<typeof socialCard>>) =>
    db.socialCard.findUnique({ where: { id: root.id } }).project(),
}
