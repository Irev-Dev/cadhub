import { db } from 'src/lib/db'

export const parts = () => {
  return db.part.findMany()
}

export const part = ({ id }) => {
  return db.part.findOne({
    where: { id },
  })
}

export const createPart = ({ input }) => {
  return db.part.create({
    data: input,
  })
}

export const updatePart = ({ id, input }) => {
  return db.part.update({
    data: input,
    where: { id },
  })
}

export const deletePart = ({ id }) => {
  return db.part.delete({
    where: { id },
  })
}
