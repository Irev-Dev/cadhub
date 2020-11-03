import User from 'src/components/User'
import {Fragment} from 'react'
import ImageUploader from 'src/components/ImageUploader'
import Button from 'src/components/Button'
import Editor from "rich-markdown-editor";

export const QUERY = gql`
  query FIND_USER_BY_ID($userName: String!) {
    user: userName(userName: $userName) {
      id
      userName
      email
      createdAt
      updatedAt
      image
      bio
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>User not found</div>

export const Success = ({ user }) => {
  const {userName, email} = user
  const keyValueDisplay = Object.entries({userName, name: email}) // TODO add name field to user
  return (
    <>
      <div className="max-w-2xl mx-auto mt-20 ">
        <div className="flex" >
          <div className="w-40 flex-shrink-0">
            <ImageUploader
              className="rounded-half rounded-br-lg shadow-md border-2 border-gray-200 border-solid"
              aspectRatio={1}
              imageUrl={user.image === 'abc' ? '': user.image}
            />
          </div>
          <div className="ml-6 flex flex-col justify-between">
            <div className="grid items-center" style={{gridTemplateColumns: 'auto 1fr'}}>
              {keyValueDisplay.map(([property, value]) => (<Fragment key={property}>
                <span className="capitalize text-gray-500 text-sm align-middle">{property}:</span>
                <span className="pl-2 text-indigo-800 font-medium text-xl mb-px pb-px align-middle">{value}</span>
              </Fragment>))}
            </div>
            <Button>Edit Profile</Button>
          </div>
        </div>
        <div className="mt-10">
          <h3 className="text-3xl text-gray-500 font-ropa-sans">Bio:</h3>
          <div name="description" className="markdown-overrides rounded-lg shadow-md bg-white p-12 my-6 min-h-md">
            <Editor
              defaultValue={user.bio}
              readOnly
            />
          </div>
        </div>
      </div>
    </>
  )
}
