import {Fragment} from 'react'
import ImageUploader from 'src/components/ImageUploader'
import Button from 'src/components/Button'
import Editor from "rich-markdown-editor";
import ProfileTextInput from 'src/components/ProfileTextInput'


const UserProfile = ({user, isEditable}) => {
  console.log(isEditable)
  const {userName, email} = user
  const editableTextFields = {userName, name: email} // TODO add name field to user
  return (
    <>
      <div className="max-w-2xl mx-auto mt-20 ">
        <div className="flex" >
          <div className="w-40 flex-shrink-0">
            <ImageUploader
              className="rounded-half rounded-br-lg shadow-md border-2 border-gray-200 border-solid"
              aspectRatio={1}
              isEditable={isEditable}
              imageUrl={user.image === 'abc' ? '': user.image}
            />
          </div>
          <div className="ml-6 flex flex-col justify-between">
            <ProfileTextInput fields={editableTextFields} isEditable={isEditable}/>
            {isEditable ?
              <Button iconName="plus">Save Profile</Button> : // TODO replace pencil with a save icon
              <Button iconName="pencil">Edit Profile</Button>
            }
          </div>
        </div>
        <div className="mt-10">
          <h3 className="text-3xl text-gray-500 font-ropa-sans">Bio:</h3>
          <div name="description" className="markdown-overrides rounded-lg shadow-md bg-white p-12 my-6 min-h-md">
            <Editor
              defaultValue={user.bio}
              readOnly={!isEditable}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default UserProfile
