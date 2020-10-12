import { Form, TextField, Submit, TextAreaField, FieldError, FormError } from '@redwoodjs/forms'
import { useMutation, Flash, useFlash } from '@redwoodjs/web'
import MainLayout from 'src/layouts/MainLayout'
import { useForm } from 'react-hook-form'

const CREATE_CONTACT = gql`
  mutation CreateContactMutation($input: CreateContactInput!) {
    createContact(input: $input) {
      id
    }
  }
`

const ContactPage = () => {
  const formMethods = useForm()
  const { addMessage } = useFlash()
  const [create, {loading, error}] = useMutation(CREATE_CONTACT, {
    onCompleted: () => {
      addMessage('Thank you for your submission!', {
        style: { backgroundColor: 'green', color: 'white', padding: '1rem' }
      })
      formMethods.reset()
    },
  })
  const onSubmit = async (data) => {
    try {
      await create({ variables: { input: data } })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <MainLayout>
      <Flash timeout={2000} />
      <h1>Hi Test</h1>
      <Form onSubmit={onSubmit} validation={{ mode: 'onBlur' }} error={error} formMethods={formMethods}>
        <FormError
          error={error}
          wrapperStyle={{ color: 'red', backgroundColor: 'lavenderblush' }}
        />
        <label htmlFor="name">Name</label>
        <TextField name="name" validation={{required: true}} errorClassName="error" />
        <FieldError name="name" className="error" />

        <label htmlFor="email">Email</label>
        <TextField name="email" validation={{required: true}} errorClassName="error" />
        <FieldError name="email" className="error" />

        <label htmlFor="message">Message</label>
        <TextAreaField name="message" validation={{required: true}} errorClassName="error" />
        <FieldError name="message" className="error" />

        <Submit disabled={loading}>Save</Submit>
      </Form>
    </MainLayout>
  )
}

export default ContactPage
