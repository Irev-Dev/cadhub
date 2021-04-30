import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

const SubjectAccessRequestForm = (props) => {
  const onSubmit = (data) => {
    props.onSave(data, props?.subjectAccessRequest?.id)
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
          name="comment"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Comment
        </Label>
        <TextField
          name="comment"
          defaultValue={props.subjectAccessRequest?.comment}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <FieldError name="comment" className="rw-field-error" />

        <Label
          name="payload"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Payload
        </Label>
        <TextField
          name="payload"
          defaultValue={props.subjectAccessRequest?.payload}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <FieldError name="payload" className="rw-field-error" />

        <Label
          name="userId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          User id
        </Label>
        <TextField
          name="userId"
          defaultValue={props.subjectAccessRequest?.userId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <FieldError name="userId" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default SubjectAccessRequestForm
