import { useState, useEffect } from 'react'
import SubjectAccessRequestsCell from 'src/components/SubjectAccessRequestsCell'
import { useQuery, useMutation } from '@redwoodjs/web'
import { Form, Submit } from '@redwoodjs/forms'

import MainLayout from 'src/layouts/MainLayout'
import Seo from 'src/components/Seo/Seo'
import InputTextForm from 'src/components/InputTextForm'
import { toast } from '@redwoodjs/web/dist/toast'

export const QUERY = gql`
  query SUBJECT_ACCESS_REQUEST($userName: String!) {
    userName(userName: $userName) {
      id
      userName
      email
      name
      createdAt
      updatedAt
      image
      bio
      Projects {
        id
        title
        description
        code
        mainImage
        createdAt
        updatedAt
        deleted
      }
      Reaction {
        id
        emote
        project {
          id
          title
        }
        createdAt
        updatedAt
      }
      Comment {
        id
        text
        project {
          id
          title
        }
        createdAt
        updatedAt
      }
      SubjectAccessRequest {
        id
        comment
        createdAt
        updatedAt
      }
    }
  }
`

const CREATE_SUBJECT_ACCESS_REQUEST_MUTATION = gql`
  mutation CreateSubjectAccessRequestMutation(
    $input: CreateSubjectAccessRequestInput!
  ) {
    createSubjectAccessRequest(input: $input) {
      id
      comment
      payload
      userId
      createdAt
      updatedAt
    }
  }
`

const SubjectAccessRequestPage = () => {
  const [input, setInput] = useState({})
  const { data } = useQuery(QUERY, {
    skip: !input.userName,
    variables: { userName: input.userName },
  })
  const onSubmit = (input) => {
    setInput(input)
  }
  const stringData = JSON.stringify(data?.userName)
  const [createSubjectAccessRequest] = useMutation(
    CREATE_SUBJECT_ACCESS_REQUEST_MUTATION,
    {
      onCompleted: () => {
        toast.success('SubjectAccessRequest created.')
      },
    }
  )
  useEffect(() => {
    if (stringData) {
      createSubjectAccessRequest({
        variables: {
          input: {
            comment: input?.comment,
            payload: stringData,
            userId: data?.userName?.id,
          },
        },
      })
    }
  }, [stringData])
  return (
    <MainLayout>
      <Seo
        title={'Subject Access Request'}
        description="Code of Conduct"
        lang="en-US"
      />
      <section className="max-w-6xl mx-auto mt-20">
        <SubjectAccessRequestsCell />
        Here to fulfill a user's right to portability, before running this
        please check that the query in
        "pages/SubjectAccessRequestPage/SubjectAccessRequestPage.js" is
        up-to-date.
        <Form onSubmit={onSubmit}>
          <div
            className="grid items-center gap-2"
            style={{ gridTemplateColumns: 'auto 1fr' }}
          >
            <span className="capitalize text-gray-500 text-sm align-middle my-3">
              userName:
            </span>
            <InputTextForm
              className="text-xl"
              name="userName"
              validation={{
                required: true,
              }}
            />
            <div />
            <div className="mt-10">
              Please add how they made the request, who is fulling it (who you
              are) and any other details
            </div>
            <span className="capitalize text-gray-500 text-sm align-middle my-3">
              comment:
            </span>
            <InputTextForm
              className="text-xl"
              name="comment"
              validation={{
                required: true,
              }}
            />
          </div>
          <Submit className="bg-indigo-200 text-indigo-800 p-2 px-4 shadow hover:shadow-lg mt-4 rounded">
            Submit
          </Submit>
        </Form>
        <pre className="whitespace-pre-wrap">{stringData}</pre>
      </section>
    </MainLayout>
  )
}

export default SubjectAccessRequestPage
