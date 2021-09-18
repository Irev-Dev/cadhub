import React, { ReactNode, useRef } from 'react'
import KeyValue from 'src/components/KeyValue/KeyValue'
import InputText from '../InputText/InputText'
import Editor from 'rich-markdown-editor'
import ImageUploader from 'src/components/ImageUploader'
import { User } from 'types/graphql'

export const fieldComponents = {
  name: NameField,
  userName: UserNameField,
  image: ImageField,
  bio: BioField,
  createdAt: MemberSinceField,
}

export interface UserProfileType {
  user: User
  isEditing: boolean
  loading: boolean
  error: boolean
  onSave: Function
  projects: {}[]
}

export interface FieldType {
  name: string
  currentValue: any
  newValue: any
  isEditing: boolean
  hasPermissionToEdit: boolean
}

export interface FieldComponentPropsType {
  field: FieldType
  dispatch?: React.Dispatch<Object>
  user?: User
  save?: Function
  hasPermissionToEdit?: boolean
}

interface ProfileKeyValueType extends FieldComponentPropsType {
  children: ReactNode
  bottom: boolean
}

const ProfileKeyValue = ({
  field,
  dispatch,
  user,
  save,
  hasPermissionToEdit,
  children,
  bottom = false,
}: ProfileKeyValueType) => {
  return (
    user[field.name] &&
    hasPermissionToEdit && (
      <KeyValue
        keyName={field.name}
        edit={{
          hasPermissionToEdit,
          isEditing: field.isEditing,
          onEdit: () => {
            if (field.isEditing && field.currentValue !== field.newValue) {
              save(user.userName, { [field.name]: field.newValue })
            }
            dispatch({
              type: 'SET_CURRENT_VALUE',
              payload: { field: field.name, value: field.newValue },
            })
            dispatch({ type: 'TOGGLE_EDITING', payload: field.name })
          },
        }}
        bottom={bottom}
        className="mb-4"
      >
        {children}
      </KeyValue>
    )
  )
}

function BioField(props) {
  const ref = useRef(null)
  const { field, dispatch } = props

  return (
    <ProfileKeyValue {...props}>
      <div
        id="bio-wrap"
        name="bio"
        className={
          'markdown-overrides rounded-sm pb-2 mt-2' +
          (field.isEditing ? ' min-h-md' : '')
        }
        onClick={(e) =>
          e?.target?.id === 'bio-wrap' && ref?.current?.focusAtEnd()
        }
      >
        <Editor
          ref={ref}
          defaultValue={field?.currentValue || ''}
          readOnly={!field.isEditing}
          onChange={(bio) =>
            dispatch({
              type: 'SET_NEW_VALUE',
              payload: { field: 'bio', value: bio() },
            })
          }
        />
      </div>
    </ProfileKeyValue>
  )
}

function MemberSinceField(props: FieldComponentPropsType) {
  return (
    <KeyValue keyName="Member Since">
      <p className="text-ch-gray-300">
        {new Date(props.field.currentValue).toLocaleDateString()}
      </p>
    </KeyValue>
  )
}

function ImageField(props: FieldComponentPropsType) {
  const { field, user, save, hasPermissionToEdit } = props
  return (
    <ImageUploader
      className="rounded-3xl rounded-tr-none shadow-md border-2 border-ch-gray-300"
      onImageUpload={({ cloudinaryPublicId: image }) => {
        save(user.userName, {
          image,
        })
      }}
      aspectRatio={1}
      isEditable={hasPermissionToEdit}
      imageUrl={user.image}
      width={300}
    />
  )
}

function NameField(props: FieldComponentPropsType) {
  const { user, dispatch, field } = props

  return (
    <ProfileKeyValue {...props} bottom={true}>
      {!field.isEditing ? (
        <h1 className="text-4xl">{user?.name}</h1>
      ) : (
        <InputText
          className="text-xl"
          value={field.newValue}
          onChange={({ target: { value } }) =>
            dispatch({
              type: 'SET_NEW_VALUE',
              payload: { field: 'name', value },
            })
          }
          isEditable={field.isEditing}
        />
      )}
    </ProfileKeyValue>
  )
}

function UserNameField(props: FieldComponentPropsType) {
  const { dispatch, field } = props

  return (
    <ProfileKeyValue {...props} bottom={true}>
      {!field.isEditing ? (
        <h2 className="text-ch-gray-400">
          @{field?.currentValue?.replace(/([^a-zA-Z\d_:])/g, '-')}
        </h2>
      ) : (
        <InputText
          className="text-xl"
          value={field.newValue}
          onChange={({ target: { value } }) =>
            dispatch({
              type: 'SET_NEW_VALUE',
              payload: { field: 'userName', value },
            })
          }
          isEditable={field.isEditing}
        />
      )}
    </ProfileKeyValue>
  )
}

export function fieldReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_EDITING':
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          isEditing:
            state[action.payload].hasPermissionToEdit &&
            !state[action.payload].isEditing
              ? true
              : false,
        },
      }
    case 'SET_NEW_VALUE':
      const newState = {
        ...state,
        [action.payload.field]: {
          ...state[action.payload.field],
          newValue: action.payload.value,
        },
      }
      return newState
    default:
      return state
  }
}
