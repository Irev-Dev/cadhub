import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  TextAreaField,
  Submit,
} from '@redwoodjs/forms'
import { useState } from 'react';
import { navigate, routes } from '@redwoodjs/router'
import { useFlash } from '@redwoodjs/web'

import Editor from "rich-markdown-editor";

const PartForm = (props) => {
  const { addMessage } = useFlash()
  const [description, setDescription] = useState(props?.part?.description)
  const onSubmit = async (data, e) => {

    await props.onSave({
      ...data,
      description,
    }, props?.part?.id)
    const shouldOpenIde = e?.nativeEvent?.submitter?.dataset?.openIde
    if(shouldOpenIde) {
      navigate(routes.partIde({id: props?.part?.id}))
    } else {
      navigate(routes.part({id: props?.part?.id}))
    }
    addMessage('Part updated.', { classes: 'rw-flash-success' })
  }

  return (
    <div className="max-w-7xl mx-auto mt-10">
      <Form onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="title"
          className="p-0"
          errorClassName="rw-label rw-label-error"
        >
          Title
        </Label>
        <TextField
          name="title"
          defaultValue={props.part?.title}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <FieldError name="title" className="rw-field-error" />

        <Label
          name="mainImage"
          className="p-0"
          errorClassName="rw-label rw-label-error"
        >
          Main image
        </Label>
        <TextField
          name="mainImage"
          defaultValue={props.part?.mainImage}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: false }}
        />
        <FieldError name="mainImage" className="rw-field-error" />

        <Label
          name="description"
          className="p-0"
          errorClassName="rw-label rw-label-error"
        >
          Description
        </Label>
        <div name="description" className="markdown-overrides bg-white p-12 my-10 min-h-md">
          <Editor
            defaultValue={props.part?.description}
            onChange={(valueFn) => setDescription(valueFn())}
          />
        </div>

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
          <Submit disabled={props.loading} data-open-ide={true} className="rw-button rw-button-blue">
            Save and open IDE
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default PartForm
