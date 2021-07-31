import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { useState } from 'react'
import type { Prisma } from '@prisma/client'
import { useAuth } from '@redwoodjs/auth'

import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import { UPDATE_PROJECT_MUTATION_IDE } from 'src/components/IdeProjectCell/IdeProjectCell'

export const useSaveCode = () => {
  const { currentUser } = useAuth()
  const { project } = useIdeContext()
  const [updateProject, { error }] = useMutation(UPDATE_PROJECT_MUTATION_IDE)
  const [nowError, setNowError] = useState(false)
  if (error && !nowError) {
    toast.success('problem updating updating project')
  }
  if (!!error !== nowError) {
    setNowError(!!error)
  }
  if (!currentUser || project?.user?.id !== currentUser?.sub) {
    return () => {}
  }
  return (input: Prisma.ProjectUpdateInput) => {
    updateProject({ variables: { id: project.id, input } })
  }
}
