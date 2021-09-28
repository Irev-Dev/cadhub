import { useEffect, useReducer } from 'react'
import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'
import ProjectsOfUser from 'src/components/ProjectsOfUserCell'
import TopNav from 'src/components/TopNav/TopNav'
import {
  fieldComponents,
  fieldReducer,
  UserProfileType,
  FieldType,
} from './userProfileConfig'

// This function initializes the state management object for each of the fields
function buildFieldsConfig(fieldsConfig, user, hasPermissionToEdit) {
  return Object.fromEntries(
    Object.keys(fieldsConfig).map((key: string): [string, FieldType] => [
      key,
      {
        name: key,
        currentValue: user[key],
        newValue: user[key],
        isEditing: false,
        hasPermissionToEdit,
      },
    ])
  )
}

const UserProfile = ({ user, isEditing, onSave }: UserProfileType) => {
  const { currentUser } = useAuth()
  const hasPermissionToEdit = currentUser?.sub === user.id
  useEffect(() => {
    isEditing &&
      !hasPermissionToEdit &&
      navigate(routes.user({ userName: user.userName }))
  }, [currentUser])

  const initializedFields = buildFieldsConfig(
    fieldComponents,
    user,
    hasPermissionToEdit
  )
  const [fields, fieldDispatch] = useReducer(fieldReducer, initializedFields)
  const {
    name: NameField,
    userName: UserNameField,
    image: ImageField,
    bio: BioField,
    createdAt: MemberSinceField,
  } = fieldComponents

  return (
    <>
      <div className="md:h-screen flex flex-col text-lg font-fira-sans">
        <div className="flex">
          <TopNav />
        </div>
        <div className="relative flex-grow h-full">
          <div className="grid md:grid-cols-profile-layout grid-flow-row-dense absolute inset-0">
            {/* Side panel */}
            <section className="bg-ch-gray-760 font-fira-sans p-12 md:overflow-y-auto ch-scrollbar">
              <div className="flex gap-6">
                {!isEditing && (
                  <div className="w-28 flex-shrink-0">
                    <ImageField
                      field={fields.image}
                      dispatch={fieldDispatch}
                      user={user}
                      save={onSave}
                      hasPermissionToEdit={hasPermissionToEdit}
                    />
                  </div>
                )}
                <div>
                  <NameField
                    field={fields.name}
                    dispatch={fieldDispatch}
                    user={user}
                    save={onSave}
                    hasPermissionToEdit={hasPermissionToEdit}
                  />
                  <UserNameField
                    field={fields.userName}
                    dispatch={fieldDispatch}
                    user={user}
                    save={onSave}
                    hasPermissionToEdit={hasPermissionToEdit}
                  />
                </div>
              </div>
              <div className="mt-10">
                <BioField
                  field={fields.bio}
                  dispatch={fieldDispatch}
                  user={user}
                  save={onSave}
                  hasPermissionToEdit={hasPermissionToEdit}
                />
              </div>
              <div className="my-5">
                <MemberSinceField field={fields.createdAt} />
              </div>
            </section>
            {/* Viewer */}
            <div className="py-10 px-8 w-full h-full relative bg-ch-gray-800 md:overflow-y-auto ch-scrollbar">
              <h3 className="text-2xl text-ch-gray-500 mb-4 md:hidden">
                Projects
              </h3>
              <ProjectsOfUser userName={user?.userName} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserProfile
