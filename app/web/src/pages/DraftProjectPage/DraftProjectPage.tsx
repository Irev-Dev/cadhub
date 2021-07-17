import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { useEffect } from 'react'
import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'

import DevIdePage from 'src/pages/DevIdePage/DevIdePage'
import useUser from 'src/helpers/hooks/useUser'
import { CREATE_PROJECT_MUTATION } from 'src/components/ProjectCell/ProjectCell'

const DraftProjectPage = ({ cadPackage }: { cadPackage: string }) => {
  const { isAuthenticated } = useAuth()
  const { user, loading } = useUser()
  const [createProject] = useMutation(CREATE_PROJECT_MUTATION, {
    onCompleted: ({ createProject }) => {
      navigate(
        routes.ide({
          userName: createProject?.user?.userName,
          projectTitle: createProject?.title,
        })
      )
      toast.success('Project Created.')
    },
  })
  useEffect(() => {
    if (isAuthenticated && user) {
      createProject({ variables: { input: { userId: user.id, cadPackage } } })
    }
  }, [isAuthenticated, user])
  if (loading || user?.id) {
    return <div>loading</div>
  }
  return <DevIdePage cadPackage={cadPackage} />
}

export default DraftProjectPage
