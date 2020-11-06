import { AuthenticationError, ForbiddenError, parseJWT } from '@redwoodjs/api'
import { db } from 'src/lib/db'

export const requireOwnership = async ({ id, userName } = {}) => {
  if (!context.currentUser) {
    throw new AuthenticationError("You don't have permission to do that.")
  }
  if(!id && !userName) {
    throw new ForbiddenError("You don't have access to do that.")
  }

  const netlifyUserId = context.currentUser?.sub
  if(id && id !== netlifyUserId) {
    throw new ForbiddenError("You don't own this resource.")
  }

  if(context.currentUser.roles?.includes('admin')) {
    return
  }

  const user = await db.user.findOne({
    where: { userName },
  })

  console.log(user, 'USER')
  if(!user) {
    throw new ForbiddenError("You don't own this resource.")
  }


}
