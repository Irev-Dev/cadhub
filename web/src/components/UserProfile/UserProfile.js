import { useState, useEffect } from 'react'
import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'
import Editor from 'rich-markdown-editor'
import ImageUploader from 'src/components/ImageUploader'
import Button from 'src/components/Button'
import ProfileTextInput from 'src/components/ProfileTextInput'
import PartsOfUser from 'src/components/PartsOfUserCell'

const UserProfile = ({ user, isEditable, loading, onSave, error, parts }) => {
  const { currentUser } = useAuth()
  const canEdit = currentUser?.sub === user.id
  const isImageEditable = !isEditable && canEdit // image is editable when not in profile edit mode in order to separate them as it's too hard too to upload an image to cloudinary temporarily until the use saves (and maybe have to clean up) for the time being
  useEffect(() => {
    isEditable && !canEdit && navigate(routes.user({ userName: user.userName }))
  }, [currentUser])
  const [input, setInput] = useState({
    userName: user.userName,
    name: user.name,
    bio: user.bio,
    image: user.image,
  })
  const { userName, name } = input
  const editableTextFields = { userName, name }
  return (
    <>
      <section className="max-w-2xl mx-auto mt-20 ">
        <div className="flex">
          {!isEditable && (
            <div className="w-40 flex-shrink-0">
              <ImageUploader
                className="rounded-half rounded-br-lg shadow-md border-2 border-gray-200 border-solid"
                onImageUpload={({ cloudinaryPublicId: image }) => {
                  onSave(user.userName, {
                    ...input,
                    image,
                  })
                }}
                aspectRatio={1}
                isEditable={isImageEditable}
                imageUrl={user.image}
                width={300}
              />
            </div>
          )}
          <div className="ml-6 flex flex-col justify-between">
            <ProfileTextInput
              fields={editableTextFields}
              onChange={({ userName, name }) =>
                setInput({
                  ...input,
                  name,
                  userName: userName.replace(/([^a-zA-Z\d_:])/g, '-'),
                })
              }
              isEditable={isEditable}
            />
            {isEditable ? (
              <Button
                className="bg-indigo-200"
                iconName="plus"
                onClick={() => onSave(user.userName, input)}
              >
                Save Profile
              </Button> // TODO replace pencil with a save icon
            ) : canEdit ? (
              <Button
                className="bg-indigo-200"
                iconName="pencil"
                onClick={() =>
                  navigate(routes.editUser({ userName: user.userName }))
                }
              >
                Edit Profile
              </Button>
            ) : null}
          </div>
        </div>
        <div className="mt-10">
          <h3 className="text-3xl text-gray-500 font-ropa-sans">Bio:</h3>
          <div
            name="description"
            className="markdown-overrides rounded-lg shadow-md bg-white p-12 my-6 min-h-md"
          >
            <Editor
              defaultValue={user.bio || ''}
              readOnly={!isEditable}
              onChange={(bioFn) =>
                setInput({
                  ...input,
                  bio: bioFn(),
                })
              }
            />
          </div>
        </div>
        <div className="mt-10">
          <h3 className="text-3xl text-gray-500 font-ropa-sans">Parts:</h3>
          <PartsOfUser userName={user?.userName} />
        </div>
      </section>
    </>
  )
}

export default UserProfile
