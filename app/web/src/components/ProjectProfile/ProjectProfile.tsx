import { useState, useEffect, useRef } from 'react'
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
import TopNav from 'src/components/TopNav/TopNav'
import IdeHeader from 'src/components/IdeHeader/IdeHeader'
import CadPackage from 'src/components/CadPackage/CadPackage'
import Gravatar from 'src/components/Gravatar/Gravatar'
import { useIdeInit } from 'src/components/EncodedUrl/helpers'
import ProfileViewer from '../ProfileViewer/ProfileViewer'
import StaticImageMessage from 'src/components/StaticImageMessage/StaticImageMessage'
import KeyValue from 'src/components/KeyValue/KeyValue'

const ProjectProfile = ({
  userProject,
  onSave,
  onDelete,
  onReaction,
  onComment,
  onStlDownload,
}) => {
  const [comment, setComment] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const onCommentClear = () => {
    onComment(comment)
    setComment('')
  }
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isReactionsModalOpen, setIsReactionsModalOpen] = useState(false)
  const { currentUser } = useAuth()
  const editorRef = useRef(null)
  const hasPermissionToEdit =
    currentUser?.sub === userProject.id || currentUser?.roles.includes('admin')
  const project = userProject?.Project

  const emotes = countEmotes(project?.Reaction)
  const userEmotes = project?.userReactions.map(({ emote }) => emote)
  useEffect(() => {
    isEditing &&
      !hasPermissionToEdit &&
      navigate(
        routes.project({
          userName: userProject.userName,
          projectTitle: project?.title,
        })
      )
  }, [currentUser, project?.title, userProject.userName])
  useIdeInit(project?.cadPackage, project?.code, 'viewer')
  const [newDescription, setNewDescription] = useState(project?.description)
  const onDescriptionChange = (description) => setNewDescription(description())
  const onEditSaveClick = () => {
    if (isEditing) {
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
          <TopNav>
            <IdeHeader context="profile" />
          </TopNav>
        </div>
        <div className="relative flex-grow h-full">
          <div className="grid grid-cols-1 md:auto-cols-preview-layout grid-flow-row-dense absolute inset-0 h-full">
            {/* Viewer */}
            <div className="md:col-start-2 w-full min-h-md relative">
              <ProfileViewer />
              <div className="absolute right-0 top-0">
                <StaticImageMessage />
              </div>
            </div>

            {/* Side panel */}
            <div className="bg-ch-gray-760 font-fira-sans px-20 pt-12 overflow-y-auto ch-scrollbar">
              <div className="grid grid-flow-row-dense gap-6">
                <h3 className="text-5xl capitalize text-ch-gray-300">
                  {project?.title.replace(/-/g, ' ')}
                </h3>
                <div className="flex items-center text-gray-100 flex-wrap">
                  <div className="flex flex-grow items-center">
                    <span className="pr-4">Built with</span>
                    <CadPackage
                      cadPackage={project?.cadPackage}
                      className="px-3 py-2 rounded"
                    />
                  </div>
                  <Button
                    className={getActiveClasses(
                      'ml-3 hover:bg-opacity-100 bg-ch-pink-800 bg-opacity-30 mt-4 mb-3 text-ch-gray-300',
                      { 'bg-indigo-200': currentUser }
                    )}
                    shouldAnimateHover
                    iconName={'document-download'}
                    onClick={onStlDownload}
                  >
                    Download STL
                  </Button>
                </div>
                {(project?.description || hasPermissionToEdit) && (
                  <KeyValue
                    keyName="Description"
                    edit={{
                      hasPermissionToEdit,
                      isEditing,
                      onEdit: () => {
                        if (!isEditing) {
                          setIsEditing(true)
                        } else {
                          onEditSaveClick()
                          setIsEditing(false)
                        }
                      },
                    }}
                  >
                    <div
                      id="description-wrap"
                      name="description"
                      className={
                        'markdown-overrides rounded-sm pb-2 mt-2' +
                        (isEditing ? ' min-h-md' : '')
                      }
                      onClick={(e) =>
                        e?.target?.id === 'description-wrap' &&
                        editorRef?.current?.focusAtEnd()
                      }
                    >
                      <Editor
                        ref={editorRef}
                        defaultValue={project?.description || ''}
                        readOnly={!isEditing}
                        onChange={onDescriptionChange}
                      />
                    </div>
                  </KeyValue>
                )}
                <div className="grid grid-flow-col-dense gap-6">
                  <KeyValue keyName="Created on">
                    {new Date(project?.createdAt).toDateString()}
                  </KeyValue>
                  <KeyValue keyName="Updated on">
                    {new Date(project?.updatedAt).toDateString()}
                  </KeyValue>
                  {project?.forkedFrom && (
                    <KeyValue keyName="Forked from">
                      <Link
                        className="pink-link"
                        to={routes.project({
                          userName: project.forkedFrom.user.userName,
                          projectTitle: project.forkedFrom.title,
                        })}
                      >
                        {project.forkedFrom.title}
                      </Link>{' '}
                      by {project.forkedFrom.user.userName}
                    </KeyValue>
                  )}
                </div>
                <KeyValue keyName="Reactions">
                  <EmojiReaction
                    emotes={emotes}
                    userEmotes={userEmotes}
                    onEmote={onReaction}
                    onShowProjectReactions={() => setIsReactionsModalOpen(true)}
                    className=""
                  />
                </KeyValue>
                {currentUser && (
                  <KeyValue keyName="Comments">
                    {!isEditing && (
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
                                    to={routes.user({
                                      userName: user?.userName,
                                    })}
                                  >
                                    <Gravatar
                                      image={user?.image}
                                      className="w-10 h-10 mr-4"
                                    />
                                    {user?.userName}
                                  </Link>
                                  <div className="font-fira-code text-ch-blue-400 flex items-center">
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
                )}
                {hasPermissionToEdit && (
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
