import { db } from 'src/lib/db'
import { requireAuth } from 'src/lib/auth'
import { foreignKeyReplacement } from 'src/services/helpers'

export const subjectAccessRequests = () => {
  requireAuth({ role: 'admin' })
  return db.subjectAccessRequest.findMany()
}

export const subjectAccessRequest = ({ id }) => {
  requireAuth({ role: 'admin' })
  return db.subjectAccessRequest.findUnique({
    where: { id },
  })
}

export const createSubjectAccessRequest = ({ input }) => {
  requireAuth({ role: 'admin' })
  return db.subjectAccessRequest.create({
    data: foreignKeyReplacement(input),
  })
}

export const updateSubjectAccessRequest = ({ id, input }) => {
  requireAuth({ role: 'admin' })
  return db.subjectAccessRequest.update({
    data: foreignKeyReplacement(input),
    where: { id },
  })
}

export const deleteSubjectAccessRequest = ({ id }) => {
  requireAuth({ role: 'admin' })
  return db.subjectAccessRequest.delete({
    where: { id },
  })
}

export const SubjectAccessRequest = {
  user: (_obj, { root }) =>
    db.subjectAccessRequest.findUnique({ where: { id: root.id } }).user(),
}
