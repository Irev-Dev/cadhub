import {useState} from 'react'
import { useMutation } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

const SEND_EMAIL_MUTATION = gql`
  mutation sendEmailMutation($email: Email!) {
  sendAllUsersEmail(input: $email) {
    accepted
  }
}
`

const AdminEmailPage = () => {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sendEmailMutation] = useMutation(SEND_EMAIL_MUTATION, {
    onCompleted: ({sendAllUsersEmail}) => {
      toast.success(`Emails sent, ${sendAllUsersEmail?.accepted.join(', ')}`)
      setSubject('')
      setBody('')
    },
  })

  const sendEmail = () => sendEmailMutation({ variables: { email: { subject, body } } })

  return (
    <div className="flex justify-center">
      <div className="max-w-7xl pt-8">
        <h2 className="" style={{width: '46rem'}}>Email all users</h2>
        <label htmlFor="subject">Subject</label>
        <input name="subject" className="rounded border border-gray-400 px-2 w-full" value={subject} onChange={({target}) => setSubject(target.value)}/>
        <label htmlFor="body">Body</label>
        <textarea className="w-full rounded border border-gray-400 p-2" name="text" value={body} onChange={({target}) => setBody(target.value)}></textarea>
        <button className="rounded px-2 p-1 mt-4 bg-ch-purple-400 text-indigo-200" onClick={sendEmail}>Send</button>
      </div>
      <Toaster timeout={1500} />
    </div>
  )
}

export default AdminEmailPage
