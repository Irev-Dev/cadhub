import Editor from "rich-markdown-editor";

// import Part from 'src/components/Part'
import ImageUploader from 'src/components/ImageUploader'
import Breadcrumb from 'src/components/Breadcrumb'
import EmojiReaction from 'src/components/EmojiReaction'
import Button from 'src/components/Button'

export const QUERY = gql`
  query FIND_PART_BY_USERNAME_TITLE($userName: String!, $partTitle: String!) {
    userPart: userName(userName: $userName) {
      name
      userName
      bio
      image
      id
      Part(partTitle: $partTitle) {
        id
        title
        description
        code
        mainImage
        createdAt
        updatedAt
        userId
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => <div>Error: {error.message}</div>

export const Success = ({ userPart, variables }) => {
  return (
    <>
      <div className="grid mt-20 gap-8" style={{gridTemplateColumns: 'auto 12rem minmax(12rem, 42rem) 10rem auto'}}>

        {/* Side column */}
        <aside className="col-start-2">
          <ImageUploader
            className="rounded-half rounded-br-lg shadow-md border-2 border-gray-200 border-solid"
            onImageUpload={() => {}}
            aspectRatio={1}
            imageUrl={userPart.image === 'abc' ? '': userPart.image}
          />
          <h4 className="text-indigo-800 text-xl underline text-right py-4">{userPart?.name}</h4>
          <div className="h-px bg-indigo-200 mb-4" />
          {/* TODO hook up to emoji data properly */}
          <EmojiReaction
            // emotes={[{emoji: '❤️',count: 3},{emoji: '😁',count: 2},{emoji: '😜',count: 2},{emoji: '🤩',count: 2},{emoji: '🤣',count: 2},{emoji: '🙌',count: 2},{emoji: '🚀',count: 2}]}
            emotes={[{emoji: '❤️',count: 3},{emoji: '😁',count: 2}]}
            // emotes={[]}
            onEmote={() => {}}
          />
          <Button
            className="mt-6 ml-auto hover:shadow-lg bg-gradient-to-r from-transparent to-indigo-100"
            shouldAnimateHover
            iconName="plus"
            onClick={() => {}}
          >
            Comments 11
          </Button>
          <Button
            className="mt-4 ml-auto shadow-md hover:shadow-lg bg-indigo-200"
            shouldAnimateHover
            iconName="plus"
            onClick={() => {}}
          >
            Open IDE
          </Button>
          <Button
            className="mt-4 ml-auto shadow-md hover:shadow-lg bg-indigo-200"
            shouldAnimateHover
            iconName="pencil"
            onClick={() => {}}
          >
            Edit Part
          </Button>
        </aside>

        {/* main project center column */}
        <section className="col-start-3">
          <Breadcrumb className="mb-8" userName={userPart.userName} partTitle={userPart?.Part?.title}/>
          { userPart?.Part?.mainImage && <ImageUploader
            className="rounded-lg shadow-md border-2 border-gray-200 border-solid"
            onImageUpload={() => {}}
            aspectRatio={16/9}
            imageUrl={userPart?.Part?.mainImage}
          />}
          <div name="description" className="markdown-overrides rounded-lg shadow-md bg-white p-12 my-8 min-h-md">
            <Editor
              defaultValue={userPart?.Part?.description || ''}
              readOnly
              // readOnly={!isEditable}
              // onChange={(bioFn) => setInput({
              //   ...input,
              //   bio: bioFn(),
              // })}
            />
          </div>
        </section>

      </div>
    </>
  )
}
