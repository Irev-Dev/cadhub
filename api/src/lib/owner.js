import { AuthenticationError, ForbiddenError, parseJWT } from '@redwoodjs/api'
import { db } from 'src/lib/db'

export const requireOwnership = async ({ userId, userName, partId } = {}) => {
  // IMPORTANT, don't forget to await this function, as it will only block
  // unwanted db actions if it has time to look up resources in the db.
  if (!context.currentUser) {
    throw new AuthenticationError("You don't have permission to do that.")
  }
  if(!userId && !userName && !partId) {
    throw new ForbiddenError("You don't have access to do that.")
  }

  if(context.currentUser.roles?.includes('admin')) {
    return
  }

  const netlifyUserId = context.currentUser?.sub
  if(userId && userId !== netlifyUserId) {
    throw new ForbiddenError("You don't own this resource.")
  }

  if(userName) {
    const user = await db.user.findOne({
      where: { userName },
    })

    if(!user || user.id !== netlifyUserId) {
      throw new ForbiddenError("You don't own this resource.")
    }
  }

  if(partId) {
    const user = await db.part.findOne({
      where: { id: partId },
    }).user()

    if(!user || user.id !== netlifyUserId) {
      throw new ForbiddenError("You don't own this resource.")
    }
  }

}
