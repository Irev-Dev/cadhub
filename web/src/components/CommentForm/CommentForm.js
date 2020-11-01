import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

const CommentForm = (props) => {
  const onSubmit = (data) => {
    props.onSave(data, props?.comment?.id)
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
          name="text"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Text
        </Label>
        <TextField
          name="text"
          defaultValue={props.comment?.text}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <FieldError name="text" className="rw-field-error" />

        <Label
          name="userId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          User id
        </Label>
        <TextField
          name="userId"
          defaultValue={props.comment?.userId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <FieldError name="userId" className="rw-field-error" />

        <Label
          name="partId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Part id
        </Label>
        <TextField
          name="partId"
          defaultValue={props.comment?.partId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <FieldError name="partId" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default CommentForm
