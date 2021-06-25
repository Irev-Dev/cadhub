import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@redwoodjs/auth'
import { Link, navigate, routes } from '@redwoodjs/router'
import Editor from 'rich-markdown-editor'
import Dialog from '@material-ui/core/Dialog'

import ImageUploader from 'src/components/ImageUploader'
import ConfirmDialog from 'src/components/ConfirmDialog'
import Breadcrumb from 'src/components/Breadcrumb'
import EmojiReaction from 'src/components/EmojiReaction'
import Button from 'src/components/Button'
import PartReactionsCell from '../PartReactionsCell'
import { countEmotes } from 'src/helpers/emote'
import { getActiveClasses } from 'get-active-classes'

const PartProfile = ({
  userPart,
  isEditable,
  onSave,
  onDelete,
  onReaction,
  onComment,
}) => {
  const [comment, setComment] = useState('')
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isReactionsModalOpen, setIsReactionsModalOpen] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)
  const { currentUser } = useAuth()
  const editorRef = useRef(null)
  const canEdit = currentUser?.sub === userPart.id || currentUser?.roles.includes('admin')
  const isImageEditable = !isEditable && canEdit // image is editable when not in profile edit mode in order to separate them as it's too hard too to upload an image to cloudinary temporarily until the use saves (and maybe have to clean up) for the time being
  const part = userPart?.Part
  const emotes = countEmotes(part?.Reaction)
  const userEmotes = part?.userReactions.map(({ emote }) => emote)
  useEffect(() => {
    isEditable &&
      !canEdit &&
      navigate(
        routes.part({ userName: userPart.userName, partTitle: part?.title })
      )
  }, [currentUser])
  const [input, setInput] = useState({
    title: part?.title,
    mainImage: part?.mainImage,
    description: part?.description,
    userId: userPart?.id,
  })
  const setProperty = (property, value) =>
    setInput({
      ...input,
      [property]: value,
    })
  const onTitleChange = ({ target }) =>
    setProperty('title', target.value.replace(/([^a-zA-Z\d_:])/g, '-'))
  const onDescriptionChange = (description) =>
    setProperty('description', description())
  const onImageUpload = ({ cloudinaryPublicId }) => {
    onSave(part?.id, { ...input, mainImage: cloudinaryPublicId })
  }
  // setProperty('mainImage', cloudinaryPublicId)
  const onEditSaveClick = (hi) => {
    // do a thing
    if (isEditable) {
      if (!input.title) {
        setIsInvalid(true)
        return
      }
      setIsInvalid(false)
      onSave(part?.id, input)
      return
    }
    navigate(
      routes.editPart({ userName: userPart?.userName, partTitle: part?.title })
    )
  }
  return (
    <>
      <div
        className="grid mt-20 gap-8"
        style={{ gridTemplateColumns: 'auto 12rem minmax(12rem, 42rem) auto' }}
      >
        {/* Side column */}
        <aside className="col-start-2 relative">
          <ImageUploader
            className="rounded-half rounded-br-lg shadow-md border-2 border-gray-200 border-solid"
            aspectRatio={1}
            imageUrl={userPart?.image}
            width={300}
          />
          <h4 className="text-indigo-800 text-xl underline text-right py-4">
            <Link to={routes.user({ userName: userPart?.userName })}>
              {userPart?.name}
            </Link>
          </h4>
          <div className="h-px bg-indigo-200 mb-4" />
          <EmojiReaction
            emotes={emotes}
            userEmotes={userEmotes}
            onEmote={onReaction}
            onShowPartReactions={() => setIsReactionsModalOpen(true)}
          />
          <Button
            className="mt-6 ml-auto hover:shadow-lg bg-gradient-to-r from-transparent to-indigo-100"
            shouldAnimateHover
            iconName="chevron-down"
            onClick={() => {
              document.getElementById('comment-section').scrollIntoView()
            }}
          >
            {userPart?.Part?.Comment.length} Comments
          </Button>
          <Link
            to={routes.ide({
              userName: userPart?.userName,
              partTitle: part?.title,
            })}
          >
            <Button
              className="mt-4 ml-auto shadow-md hover:shadow-lg bg-indigo-200 w-full justify-end"
              shouldAnimateHover
              iconName="terminal"
              onClick={() => {}}
            >
              Open IDE
            </Button>
          </Link>
          {canEdit && (
            <>
              <Button
                className="mt-4 ml-auto shadow-md hover:shadow-lg bg-indigo-200 relative z-20 w-full justify-end"
                shouldAnimateHover
                iconName={isEditable ? 'save' : 'pencil'}
                onClick={onEditSaveClick}
              >
                {isEditable ? 'Save Details' : 'Edit Details'}
              </Button>
              {isEditable && (
                <Button
                  className="mt-4 ml-auto shadow-md hover:shadow-lg bg-indigo-200 relative z-20 w-full justify-end"
                  shouldAnimateHover
                  iconName="x"
                  onClick={() =>
                    navigate(
                      routes.part({
                        userName: userPart.userName,
                        partTitle: part?.title,
                      })
                    )
                  }
                >
                  Cancel
                </Button>
              )}
              <Button
                className="mt-4 ml-auto shadow-md hover:shadow-lg bg-red-200 relative z-20 w-full justify-end"
                shouldAnimateHover
                iconName={'trash'}
                onClick={() => setIsConfirmDialogOpen(true)}
                type="danger"
              >
                Delete
              </Button>
            </>
          )}
          {/* gray overlay */}
          {isEditable && (
            <div className="absolute inset-0 bg-gray-300 opacity-75 z-10 transform scale-x-110 -ml-1 -mt-2" />
          )}
        </aside>

        {/* main project center column */}
        <section className="col-start-3">
          <Breadcrumb
            className="inline"
            onPartTitleChange={isEditable && onTitleChange}
            userName={userPart?.userName}
            partTitle={input?.title}
            isInvalid={isInvalid}
          />
          {!isEditable && part?.id && (
            <ImageUploader
              className="rounded-lg shadow-md border-2 border-gray-200 border-solid mt-8"
              onImageUpload={onImageUpload}
              aspectRatio={16 / 9}
              isEditable={isImageEditable}
              imageUrl={input?.mainImage}
              width={1010}
            />
          )}
          <div className="text-gray-500 text-sm font-ropa-sans pt-8">
            {isEditable ? 'Markdown supported' : ''}
          </div>
          <div
            id="description-wrap"
            name="description"
            className="markdown-overrides rounded-lg shadow-md bg-white px-12 py-6 min-h-md"
            onClick={(e) =>
              e?.target?.id === 'description-wrap' &&
              editorRef?.current?.focusAtEnd()
            }
          >
            <Editor
              ref={editorRef}
              defaultValue={part?.description || ''}
              readOnly={!isEditable}
              onChange={onDescriptionChange}
            />
          </div>

          {/* comments */}
          {!isEditable && (
            <>
              <div className="h-px bg-indigo-200 mt-8" />
              <h3
                className="text-indigo-800 text-lg font-roboto tracking-wider mb-4"
                id="comment-section"
              >
                Comments
              </h3>

              <ul>
                {part?.Comment.map(({ text, user, id }) => (
                  <li key={id} className="flex mb-6">
                    <div className="w-8 h-8 overflow-hidden rounded-full border border-indigo-300 shadow flex-shrink-0">
                      <ImageUploader
                        className=""
                        aspectRatio={1}
                        imageUrl={user?.image}
                        width={50}
                      />
                    </div>
                    <div className="ml-4 font-roboto">
                      <div className="text-gray-800 font-bold text-lg mb-1">
                        <Link to={routes.user({ userName: user?.userName })}>
                          {user?.userName}
                        </Link>
                      </div>
                      <div className="text-gray-700 p-3 rounded bg-gray-200 shadow">
                        {text}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {currentUser && (
                <>
                  <div className="mt-12 ml-12">
                    <textarea
                      className="w-full h-32 rounded-lg shadow-inner outline-none resize-none p-3"
                      placeholder="Leave a comment"
                      value={comment}
                      onChange={({ target }) => setComment(target.value)}
                    />
                  </div>
                  <Button
                    className={getActiveClasses(
                      'ml-auto hover:shadow-lg bg-gray-300 mt-4 mb-20',
                      { 'bg-indigo-200': currentUser }
                    )}
                    shouldAnimateHover
                    disabled={!currentUser}
                    iconName={'save'}
                    onClick={() => onComment(comment)}
                  >
                    Comment
                  </Button>
                </>
              )}
            </>
          )}
        </section>
      </div>
      <ConfirmDialog
        open={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={onDelete}
        message="Are you sure you want to delete? This action cannot be undone."
      />
      <Dialog
        open={isReactionsModalOpen}
        onClose={() => setIsReactionsModalOpen(false)}
        fullWidth={true}
        maxWidth={'sm'}
      >
        <PartReactionsCell partId={userPart?.Part?.id} />
      </Dialog>
    </>
  )
}

export default PartProfile
