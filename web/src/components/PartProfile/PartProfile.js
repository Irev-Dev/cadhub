import {useState} from 'react'
import Editor from "rich-markdown-editor";

import ImageUploader from 'src/components/ImageUploader'
import Breadcrumb from 'src/components/Breadcrumb'
import EmojiReaction from 'src/components/EmojiReaction'
import Button from 'src/components/Button'

const PartProfile = ({userPart, isEditable}) => {
  const part = userPart?.Part
  const [input, setInput] = useState({
    title: part.title,
    mainImage: part.mainImage,
    description: part.description,
  })
  const hi = () => {}
  return (
    <>
      <div className="grid mt-20 gap-8" style={{gridTemplateColumns: 'auto 12rem minmax(12rem, 42rem) 10rem auto'}}>

        {/* Side column */}
        <aside className="col-start-2 relative">
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
            iconName="chevron-down"
            onClick={() => {}}
          >
            Comments 11
          </Button>
          <Button
            className="mt-4 ml-auto shadow-md hover:shadow-lg bg-indigo-200"
            shouldAnimateHover
            iconName="terminal"
            onClick={() => {}}
          >
            Open IDE
          </Button>
          {true && <Button
            className="mt-4 ml-auto shadow-md hover:shadow-lg bg-indigo-200 relative z-20"
            shouldAnimateHover
            iconName={isEditable ? 'save' : 'pencil'}
            onClick={() => {}}
          >
            {isEditable ? 'Save Details' : 'Edit Details'}
          </Button>}
          {isEditable && <div className="absolute inset-0 bg-gray-300 opacity-75 z-10 transform scale-x-110 -ml-1 -mt-2" />}
        </aside>

        {/* main project center column */}
        <section className="col-start-3">
          <Breadcrumb className="inline" onPartTitleChange={isEditable && hi} userName={userPart.userName} partTitle={input?.title}/>
          { input?.mainImage && <ImageUploader
            className="rounded-lg shadow-md border-2 border-gray-200 border-solid mt-8"
            onImageUpload={() => {}}
            aspectRatio={16/9}
            isEditable={isEditable}
            imageUrl={input?.mainImage}
          />}
          <div name="description" className="markdown-overrides rounded-lg shadow-md bg-white p-12 my-8 min-h-md">
            <Editor
              defaultValue={part?.description || ''}
              readOnly={!isEditable}
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

export default PartProfile
