import { AuthenticationError, ForbiddenError } from '@redwoodjs/api'
import { db } from 'src/lib/db'

export const requireOwnership = async ({
  userId,
  userName,
  projectId,
}: { userId?: string; userName?: string; projectId?: string } = {}) => {
  // IMPORTANT, don't forget to await this function, as it will only block
  // unwanted db actions if it has time to look up resources in the db.
  if (!context.currentUser) {
    throw new AuthenticationError("You don't have permission to do that.")
  }
  if (!userId && !userName && !projectId) {
    throw new ForbiddenError("You don't have access to do that.")
  }

  if (context.currentUser.roles?.includes('admin')) {
    if (context.currentUser?.sub === '5cea3906-1e8e-4673-8f0d-89e6a963c096') {
      throw new ForbiddenError("That's a local admin ONLY.")
    }
    return
  }

  const netlifyUserId = context.currentUser?.sub
  if (userId && userId !== netlifyUserId) {
    throw new ForbiddenError("You don't own this resource.")
  }

  if (userName) {
    const user = await db.user.findUnique({
      where: { userName },
    })

    if (!user || user.id !== netlifyUserId) {
      throw new ForbiddenError("You don't own this resource.")
    }
  }

  if (projectId) {
    const user = await db.project
      .findUnique({
        where: { id: projectId },
      })
      .user()

    if (!user || user.id !== netlifyUserId) {
      throw new ForbiddenError("You don't own this resource.")
    }
  }
}
