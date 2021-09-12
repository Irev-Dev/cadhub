import React, { ReactNode, useRef } from 'react'
import KeyValue from 'src/components/KeyValue/KeyValue'
import InputText from '../InputText/InputText'
import Editor from 'rich-markdown-editor'
import ImageUploader from 'src/components/ImageUploader'
import { User } from 'types/graphql'


export interface UserProfileType {
  user: User,
  isEditable: boolean,
  loading: boolean,
  error: boolean,
  onSave: Function,
  projects: {}[],
}

export interface FieldConfigType {
  name?: string, // introspection ugh
  editable: boolean,
  component?: ReactNode,
  needsRef?: boolean,
  isEditing?: boolean | undefined,
  onSave?: Function,
  currentValue?: any,
  newValue?: any,
}

const ProfileKeyValue = ({ field, dispatch, user, save, hasEditPermission, children, bottom = false }) => {
    return (
      <KeyValue
        keyName={field.name}
        hide={!user[field.name] && !hasEditPermission}
        canEdit={hasEditPermission}
        onEdit={() => {
          if (field.isEditing) {
            save(user.userName, { [field.name]: field.newValue })
          }
          dispatch({ type: "SET_CURRENT_VALUE", payload: { field: field.name, value: field.newValue }})
          dispatch({ type: "TOGGLE_EDITING", payload: field.name })
        }}
        isEditable={hasEditPermission && field.isEditing}
        bottom={bottom}
        className="mb-4"
      >
        { children }
      </KeyValue>
    )
  }

const bioField : FieldConfigType = {
    editable: true,
    needsRef: true,
    component: (props) => {
        const ref = useRef(null)

        const { dispatch, field } = props

        return <ProfileKeyValue {...props}>
          <div
            id="bio-wrap"
            name="bio"
            className={
              'markdown-overrides rounded-sm pb-2 mt-2' +
              (field.isEditable ? ' min-h-md' : '')
            }
            onClick={(e) =>
              e?.target?.id === 'bio-wrap' &&
              ref?.current?.focusAtEnd()
            }
          >
            <Editor
              ref={ref}
              defaultValue={field?.currentValue || ''}
              readOnly={!field.isEditing}
              onChange={(bio) => dispatch({ type: "SET_NEW_VALUE", payload: { field: field.bio, value: bio() }})}
            />
          </div>
        </ProfileKeyValue>
    },
}

const createdAtField : FieldConfigType = {
    editable: false,
    component: (props) => {
        const { field } = props

        return <KeyValue keyName="Member Since">
            <p className="text-ch-gray-300">{ new Date(field.currentValue).toLocaleDateString() }</p>
        </KeyValue>
    },
}

const imageField : FieldConfigType = {
    editable: true,
    component: (props) => {
        const { field, user, save, hasEditPermission } = props
        return (
            <ImageUploader
            className="rounded-3xl rounded-tr-none shadow-md border-2 border-ch-gray-300"
            onImageUpload={({ cloudinaryPublicId: image }) => {
                save(user.userName, {
                image,
                })
            }}
            aspectRatio={1}
            isEditable={hasEditPermission && !field.isEditing}
            imageUrl={user.image}
            width={300}
            />
        )
    },
}

const nameField : FieldConfigType = {
    editable: true,
    component: (props) => {
        const { user, dispatch, field } = props

        return <ProfileKeyValue {...props} bottom={true}>
            { (!field.isEditing) 
            ? <h1 className="text-4xl">{ user?.name }</h1>
            :  <InputText
                className="text-xl"
                value={field.newValue}
                onChange={({ target: { value } }) => dispatch({ type: "SET_NEW_VALUE", payload: { field: field.name, value }})}
                isEditable={!field.isEditable}
              />
        }
        </ProfileKeyValue>
    },
}

const userNameField : FieldConfigType = {
    editable: true,
    component: (props) => {
        const { dispatch, field } = props

        return <ProfileKeyValue {...props} bottom={true}>
            { (!field.isEditing) 
                ? <h2 className="text-ch-gray-400">@{ field?.currentValue?.replace(/([^a-zA-Z\d_:])/g, '-') }</h2>
                :  <InputText
                    className="text-xl"
                    value={field.newValue}
                    onChange={({ target: { value } }) => dispatch({ type: "SET_NEW_VALUE", payload: { field: field.name, value }})}
                    isEditable={!field.isEditable}
                    />
            }
        </ProfileKeyValue>
    },
}

export const fieldsConfig = {
  bio: bioField,
  createdAt: createdAtField,
  id: {
    editable: false,
  },
  image: imageField,
  name: nameField,
  updatedAt: {
    editable: false,
  },
  userName: userNameField,
}

export function fieldReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_EDITING":
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          isEditing: (state[action.payload].editable && !state[action.payload].isEditing) ? true : false,
        }
      }
    case "SET_NEW_VALUE":
      const newState = {
        ...state,
        [action.payload.field]: {
          ...state[action.payload.field],
          newValue: action.payload.value,
        }
      }
      return newState
    default:
      return state
  }
}