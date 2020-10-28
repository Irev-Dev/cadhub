import { useMutation, useFlash } from '@redwoodjs/web'
import { Link, routes } from '@redwoodjs/router'
import { Image as CloudinaryImage } from 'cloudinary-react'
import EmojiiReaction from 'src/components/EmojiReaction/EmojiReaction'

import avatar from 'src/assets/harold.jpg'

const DELETE_PART_MUTATION = gql`
  mutation DeletePartMutation($id: Int!) {
    deletePart(id: $id) {
      id
    }
  }
`

const MAX_STRING_LENGTH = 150

const truncate = (text) => {
  let output = text
  if (text && text.length > MAX_STRING_LENGTH) {
    output = output.substring(0, MAX_STRING_LENGTH) + '...'
  }
  return output
}

const jsonTruncate = (obj) => {
  return truncate(JSON.stringify(obj, null, 2))
}

const timeTag = (datetime) => {
  return (
    <time dateTime={datetime} title={datetime}>
      {new Date(datetime).toUTCString()}
    </time>
  )
}

const checkboxInputTag = (checked) => {
  return <input type="checkbox" checked={checked} disabled />
}

const PartsList = ({ parts }) => {
  const { addMessage } = useFlash()
  const [deletePart] = useMutation(DELETE_PART_MUTATION, {
    onCompleted: () => {
      addMessage('Part deleted.', { classes: 'rw-flash-success' })
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete part ' + id + '?')) {
      deletePart({ variables: { id }, refetchQueries: ['PARTS'] })
    }
  }

  return (
    <>
      <EmojiiReaction emotes={[
      {
         emoji: '❤️',
         count: 3,
      },
      {
         emoji: '😁',
         count: 2,
      },
   ]} callback={(e) => console.log(e)} />
    <div className="max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-5xl xl:max-w-6xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid- cols-4">
      {parts.map((part) => {
        return (
          <Link
            to={routes.part({ id: part.id })}
            title={'Show part ' + part.id + ' detail'}
            key={part.id}
            className="relative bg-gray-900 rounded-t-2xl"
          >
            <div className="rounded-t-2xl bg-gray-900">
              <div className="flex items-center p-2 text-indigo-200">
                <div className="h-full absolute inset-0 text-6xl flex items-center justify-center text-indigo-700" ><span>?</span></div>
                <div className="mr-4">
                  <img src={avatar} className="rounded-full h-10 w-10" />
                </div>
                <h3>{part.title}</h3>
              </div>
              <div className="relative z-10">
                <CloudinaryImage
                  className="object-cover w-full rounded shadow"
                  cloudName="irevdev"
                  publicId={part.mainImage}
                  width="300"
                  crop="scale"
                />
              </div>
            </div>
          </Link>
      )})}
    </div></>
  )
}

export default PartsList
