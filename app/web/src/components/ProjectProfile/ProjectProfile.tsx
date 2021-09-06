import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { useAuth } from '@redwoodjs/auth'
import { Link, navigate, routes } from '@redwoodjs/router'
import Editor from 'rich-markdown-editor'
import Dialog from '@material-ui/core/Dialog'

import ConfirmDialog from 'src/components/ConfirmDialog/ConfirmDialog'
import EmojiReaction from 'src/components/EmojiReaction/EmojiReaction'
import Button from 'src/components/Button/Button'
import ProjectReactionsCell from '../ProjectReactionsCell'
import { countEmotes } from 'src/helpers/emote'
import { getActiveClasses } from 'get-active-classes'
import IdeHeader from 'src/components/IdeHeader/IdeHeader'
import CadPackage from 'src/components/CadPackage/CadPackage'
import Gravatar from 'src/components/Gravatar/Gravatar'
import { useIdeInit } from 'src/components/EncodedUrl/helpers'
import ProfileViewer from '../ProfileViewer/ProfileViewer'
import Svg from 'src/components/Svg/Svg'
import OpenscadStaticImageMessage from 'src/components/OpenscadStaticImageMessage/OpenscadStaticImageMessage'

const KeyValue = ({
  keyName,
  children,
  hide = false,
  canEdit = false,
  onEdit,
  isEditable = false,
}: {
  keyName: string
  children: React.ReactNode
  hide?: boolean
  canEdit?: boolean
  onEdit?: () => void
  isEditable?: boolean
}) => {
  if (!children || hide) return null
  return (
    <div>
      <div className="text-ch-blue-600 font-fira-code flex text-sm whitespace-nowrap">
        {keyName}
        {canEdit &&
          (isEditable ? (
            <button
              className="font-fira-sans items-center ml-4 grid grid-flow-col-dense p-px px-2 gap-2 bg-ch-purple-400 bg-opacity-30 hover:bg-opacity-80 rounded-sm border border-ch-purple-400"
              id="rename-button"
              onClick={onEdit}
            >
              <Svg
                name="check"
                className="w-6 h-6 text-ch-purple-500"
                strokeWidth={3}
              />
              <span>Update</span>
            </button>
          ) : (
            <button onClick={onEdit}>
              <Svg name="pencil-solid" className="h-4 w-4 ml-4 mb-2" />
            </button>
          ))}
      </div>
      <div className="text-ch-gray-300">{children}</div>
    </div>
  )
}

const ProjectProfile = ({
  userProject,
  onSave,
  onDelete,
  onReaction,
  onComment,
}) => {
  const [comment, setComment] = useState('')
  const [isEditable, setIsEditable] = useState(false)
  const onCommentClear = () => {
    onComment(comment)
    setComment('')
  }
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isReactionsModalOpen, setIsReactionsModalOpen] = useState(false)
  const { currentUser } = useAuth()
  const editorRef = useRef(null)
  const canEdit =
    currentUser?.sub === userProject.id || currentUser?.roles.includes('admin')
  const project = userProject?.Project
  const emotes = countEmotes(project?.Reaction)
  const userEmotes = project?.userReactions.map(({ emote }) => emote)
  useEffect(() => {
    isEditable &&
      !canEdit &&
      navigate(
        routes.project({
          userName: userProject.userName,
          projectTitle: project?.title,
        })
      )
  }, [currentUser])
  useIdeInit(project?.cadPackage, project?.code)
  const [newDescription, setNewDescription] = useState(project?.description)
  const onDescriptionChange = (description) => setNewDescription(description())
  const onEditSaveClick = () => {
    if (isEditable) {
      onSave(project?.id, { description: newDescription })
      return
    }
    navigate(
      routes.editProject({
        userName: userProject?.userName,
        projectTitle: project?.title,
      })
    )
  }
  return (
    <>
      <div className="h-screen flex flex-col text-lg font-fira-sans">
        <div className="flex">
          <Link
            to={routes.home()}
            className="w-16 h-16 flex items-center justify-center bg-ch-gray-900"
          >
            <Svg className="w-12" name="favicon" />
          </Link>
          <IdeHeader
            handleRender={() => {}}
            projectTitle={project?.title}
            projectOwner={userProject?.userName}
            projectOwnerImage={userProject?.image}
            projectOwnerId={userProject?.id}
            projectId={project?.id}
          />
        </div>
        <div className="relative flex-grow h-full">
          <div className="grid grid-cols-1 md:auto-cols-preview-layout grid-flow-row-dense absolute inset-0 h-full">
            {/* Viewer */}
            <div className="md:col-start-2 w-full min-h-md relative">
              <ProfileViewer />
              <div className="absolute right-0 top-0">
                <OpenscadStaticImageMessage />
              </div>
            </div>

            {/* Side panel */}
            <div className="bg-ch-gray-760 font-fira-sans px-20 pt-12 overflow-y-auto">
              <div className="grid grid-flow-row-dense gap-6">
                <h3 className="text-5xl capitalize text-ch-gray-300">
                  {project?.title.replace(/-/g, ' ')}
                </h3>
                <div className="flex items-center text-gray-100">
                  <span className="pr-4">Built with</span>
                  <CadPackage
                    cadPackage={project?.cadPackage}
                    className="px-3 py-2 rounded"
                  />
                </div>
                <KeyValue
                  keyName="Description"
                  hide={!project?.description && !canEdit}
                  canEdit={canEdit}
                  onEdit={() => {
                    if (!isEditable) {
                      setIsEditable(true)
                    } else {
                      onEditSaveClick()
                      setIsEditable(false)
                    }
                  }}
                  isEditable={isEditable}
                >
                  <div
                    id="description-wrap"
                    name="description"
                    className={
                      'markdown-overrides rounded-sm pb-2 mt-2' +
                      (isEditable ? ' min-h-md' : '')
                    }
                    onClick={(e) =>
                      e?.target?.id === 'description-wrap' &&
                      editorRef?.current?.focusAtEnd()
                    }
                  >
                    <Editor
                      ref={editorRef}
                      defaultValue={project?.description || ''}
                      readOnly={!isEditable}
                      onChange={onDescriptionChange}
                    />
                  </div>
                </KeyValue>
                <div className="grid grid-flow-col-dense gap-6">
                  <KeyValue keyName="Created on">
                    {new Date(project?.createdAt).toDateString()}
                  </KeyValue>
                  <KeyValue keyName="Updated on">
                    {new Date(project?.updatedAt).toDateString()}
                  </KeyValue>
                </div>
                <KeyValue keyName="Reactions">
                  <EmojiReaction
                    emotes={emotes}
                    userEmotes={userEmotes}
                    onEmote={onReaction}
                    onShowProjectReactions={() => setIsReactionsModalOpen(true)}
                  />
                </KeyValue>
                <KeyValue keyName="Comments" hide={!currentUser}>
                  {!isEditable && (
                    <>
                      {currentUser && (
                        <>
                          <div className="pt-1">
                            <textarea
                              className="w-full h-32 rounded shadow-inner outline-none resize-none p-3 bg-ch-gray-600 placeholder-ch-gray-500 font-fira-sans"
                              placeholder="Have a question about this model, or a helpful tip about how to improve it? Remember, be nice!"
                              value={comment}
                              onChange={({ target }) =>
                                setComment(target.value)
                              }
                            />
                          </div>
                          <Button
                            className={getActiveClasses(
                              'ml-auto hover:bg-opacity-100 bg-ch-pink-800 bg-opacity-30 mt-4 mb-6 text-ch-gray-300',
                              { 'bg-indigo-200': currentUser }
                            )}
                            shouldAnimateHover
                            disabled={!currentUser}
                            iconName={''}
                            onClick={onCommentClear}
                          >
                            Comment
                          </Button>
                        </>
                      )}
                      <ul>
                        {project?.Comment.map(
                          ({ text, user, id, createdAt }) => (
                            <li key={id} className="mb-5">
                              <div className="flex justify-between">
                                <Link
                                  className="flex items-center"
                                  to={routes.user({ userName: user?.userName })}
                                >
                                  <Gravatar
                                    image={user?.image}
                                    className="w-10 h-10 mr-4"
                                  />
                                  {user?.userName}
                                </Link>
                                <div className="font-fira-code text-ch-blue-600 flex items-center">
                                  {new Date(createdAt).toDateString()}
                                </div>
                              </div>
                              <div className="ml-5 border-l-2 pl-5 my-3 border-ch-gray-300 text-ch-gray-300">
                                {text}
                              </div>
                            </li>
                          )
                        )}
                      </ul>
                    </>
                  )}
                </KeyValue>
                {canEdit && (
                  <>
                    <h4 className="mt-10 text-red-600">Danger Zone</h4>
                    <Button
                      className={getActiveClasses(
                        'mr-auto bg-red-500 mb-6 text-ch-gray-300',
                        { 'bg-indigo-200': currentUser }
                      )}
                      shouldAnimateHover
                      disabled={!currentUser}
                      iconName={'trash'}
                      onClick={() => setIsConfirmDialogOpen(true)}
                    >
                      Delete Project
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
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
        <ProjectReactionsCell projectId={userProject?.Project?.id} />
      </Dialog>
    </>
  )
}

export default ProjectProfile
