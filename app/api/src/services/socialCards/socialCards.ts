import { ResolverArgs, BeforeResolverSpecType } from '@redwoodjs/graphql-server'
import type { Prisma } from '@prisma/client'

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

export const SocialCard = {
  project: (_obj, { root }: ResolverArgs<ReturnType<typeof socialCard>>) =>
    db.socialCard.findUnique({ where: { id: root.id } }).project(),
}
