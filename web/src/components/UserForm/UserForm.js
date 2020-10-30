import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'
import { useState } from 'react';
import { navigate, routes } from '@redwoodjs/router'
import { useFlash } from '@redwoodjs/web'
import ImageUploader from '../PartForm/ImageUploader'
const UserForm = (props) => {
  const { addMessage } = useFlash()
  // const [bio, setBio] = useState(props?.user?.bio)
  const [imageUrl, setImageUrl] = useState(props?.user?.image)
  const onSubmit = async (data, e) => {

    await props.onSave({
      ...data,
      image: imageUrl
    }, props?.user?.id)
    addMessage('User updated.', { classes: 'rw-flash-success' })
  }

  return (
    <div className="rw-form-wrapper">
      <Form onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="email"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Email
        </Label>
        <TextField
          name="email"
          defaultValue={props.user?.email}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <FieldError name="email" className="rw-field-error" />

        {/* <Label
          name="image"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Image
        </Label>
        <TextField
          name="image"
          defaultValue={props.user?.image}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />
        <FieldError name="image" className="rw-field-error" /> */}
        <ImageUploader onImageUpload={({cloudinaryPublicId}) => setImageUrl(cloudinaryPublicId)} />

        <Label
          name="bio"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Bio
        </Label>
        <TextField
          name="bio"
          defaultValue={props.user?.bio}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <FieldError name="bio" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default UserForm
