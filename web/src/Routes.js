// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Private } from '@redwoodjs/router'

const Routes = () => {
  return (
    <Router>
      <Route path="/part-reactions/new" page={NewPartReactionPage} name="newPartReaction" />
      <Route path="/part-reactions/{id}/edit" page={EditPartReactionPage} name="editPartReaction" />
      <Route path="/part-reactions/{id}" page={PartReactionPage} name="partReaction" />
      <Route path="/part-reactions" page={PartReactionsPage} name="partReactions" />
      <Route path="/parts/new" page={NewPartPage} name="newPart" />
      <Route path="/parts/{id}/edit" page={EditPartPage} name="editPart" />
      <Route path="/parts/{id}" page={PartPage} name="part" />
      <Route path="/parts" page={PartsPage} name="parts" />
      <Route path="/comments/new" page={NewCommentPage} name="newComment" />
      <Route path="/comments/{id}/edit" page={EditCommentPage} name="editComment" />
      <Route path="/comments/{id}" page={CommentPage} name="comment" />
      <Route path="/comments" page={CommentsPage} name="comments" />
      <Route path="/users/new" page={NewUserPage} name="newUser" />
      <Route path="/users/{id}/edit" page={EditUserPage} name="editUser" />
      <Route path="/users/{id}" page={UserPage} name="user" />
      <Route path="/users" page={UsersPage} name="users" />
      <Route path="/" page={HomePage} name="home" />
      {/* <Route path="/blah/*" page={PartsPage} name="home" /> */}
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
