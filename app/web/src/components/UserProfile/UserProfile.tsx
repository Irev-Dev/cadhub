import { useState, useEffect, useRef, useReducer, ReactNode } from 'react'
import { useAuth } from '@redwoodjs/auth'
import { Link, navigate, routes } from '@redwoodjs/router'
import ProjectsOfUser from 'src/components/ProjectsOfUserCell'
import IdeHeader from 'src/components/IdeHeader/IdeHeader'
import Svg from 'src/components/Svg/Svg'
import { fieldsConfig, fieldReducer, UserProfileType, FieldConfigType } from './userProfileConfig'

function buildFieldsConfig(fieldsConfig, user) {
  Object.entries(fieldsConfig).forEach(([key, field] : [string, FieldConfigType]) => {
    field.currentValue = field.newValue = user[key]
    field.name = key
  })

  return fieldsConfig
}


const UserProfile = ({
  user,
  isEditable,
  loading,
  onSave,
  error,
  projects,
} : UserProfileType) => {
  const { currentUser } = useAuth()
  const hasEditPermission = currentUser?.sub === user.id
  useEffect(() => {
    isEditable && !hasEditPermission && navigate(routes.user({ userName: user.userName }))
  }, [currentUser])

  const initializedFields = buildFieldsConfig(fieldsConfig, user)
  const [fields, fieldDispatch] = useReducer(fieldReducer, initializedFields)

  return (
    <>
      <div className="md:h-screen flex flex-col text-lg font-fira-sans">
        <div className="flex">
          <Link
            to={routes.home()}
            className="w-16 h-16 flex items-center justify-center bg-ch-gray-900"
          >
            <Svg className="w-12" name="favicon" />
          </Link>
          <IdeHeader
            handleRender={() => {}}
            projectOwner={user?.userName}
            projectOwnerImage={user?.image}
            projectOwnerId={user?.id}
          >
            
            <span></span> 
          </IdeHeader>
        </div>
        <div className="relative flex-grow h-full">
          <div className="grid md:grid-cols-profile-layout grid-flow-row-dense absolute inset-0">
            {/* Side panel */}
            <section className="bg-ch-gray-760 font-fira-sans p-12 md:overflow-y-auto ch-scrollbar">
              <div className="flex gap-6">
                {!isEditable && (
                  <div className="w-28 flex-shrink-0">
                    <fields.image.component
                      field={fields.image}
                      user={user}
                      save={onSave} 
                      hasEditPermission={hasEditPermission}
                    />
                  </div>
                )}
                <div>
                  <fields.name.component
                    field={fields.name}
                    dispatch={fieldDispatch}
                    user={user}
                    save={onSave}
                    hasEditPermission={hasEditPermission}
                  />
                  <fields.userName.component
                    field={fields.userName}
                    dispatch={fieldDispatch}
                    user={user}
                    save={onSave}
                    hasEditPermission={hasEditPermission}
                  />
                </div>
              </div>
              <div className="mt-10">
                <fields.bio.component
                  field={fields.bio}
                  dispatch={fieldDispatch}
                  user={user}
                  save={onSave}
                  hasEditPermission={hasEditPermission}
                />
              </div>
              <div className="my-5">
                <fields.createdAt.component
                  field={fields.createdAt}
                />
              </div>
            </section>
            {/* Viewer */}
            <div className="py-10 px-8 w-full h-full relative bg-ch-gray-800 md:overflow-y-auto ch-scrollbar">
              <h3 className="text-2xl text-ch-gray-500 mb-4 md:hidden">Projects</h3>
              <ProjectsOfUser userName={user?.userName} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserProfile
