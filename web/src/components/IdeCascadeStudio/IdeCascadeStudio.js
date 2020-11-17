import { useAuth } from '@redwoodjs/auth'
import { Link, routes } from '@redwoodjs/router'
import CascadeController from 'src/helpers/cascadeController'
import IdeToolbar from 'src/components/IdeToolbar'
import { useEffect, useState } from 'react'

const IdeCascadeStudio = ({ part, saveCode, loading, error }) => {
  const [code, setCode] = useState(part.code)
  const { currentUser } = useAuth()
  const canEdit = currentUser?.sub === part?.user?.id
  useEffect(() => {
    // Cascade studio attaches "cascade-container" a div outside the react app in 'web/src/index.html', and so we are
    // "opening" and "closing" it for the ide part of the app by displaying none or block. Which is why this useEffect
    // returns a clean up function that hides the div again.
    const onCodeChange = (code) => setCode(code)
    CascadeController.initialise(onCodeChange, part.code)
    const element = document.getElementById('cascade-container')
    element.setAttribute('style', 'display: block; opacity: 100%; overflow: hidden; height: calc(100vh - 8rem)') // eslint-disable-line
    return () => {
      element.setAttribute('style',  'display: none; overflow: hidden; height: calc(100vh - 8rem)') // eslint-disable-line
    }
  }, [part.code])
  const isChanges = code !== part.code

  return (
    <>
      <div>
        <IdeToolbar
          canEdit={canEdit}
          isChanges={isChanges && !loading}
          onSave={() => {
            saveCode({
              input: {
                code,
                title: part?.title,
                userId: currentUser?.sub,
                description: part?.description,
              },
              id: part.id,
              isFork: !canEdit,
            })
          }}
          onExport={(type) => threejsViewport[`saveShape${type}`]()}
          userNamePart={{
            userName: part.user.userName,
            partTitle: part.title,
            image: part?.user?.image,
          }}
        />
      </div>
    </>
  )
}

export default IdeCascadeStudio
