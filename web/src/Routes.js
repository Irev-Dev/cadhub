// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage
import { useEffect } from 'react'
import { Router, Route, Private } from '@redwoodjs/router'

const welcomeMessage = `
%cHey, 👋.
%c______________________________________________________________________________

%cCadHub is in active development - Want to lend a hand?
%chttps://github.com/Irev-Dev/cadhub

`

const Routes = () => {
  useEffect(
    () =>
      console.log(
        welcomeMessage,
        'font-family: Georgia, serif; font-weight:bold; line-height: 2rem; font-size: 32px; color: #3c366b; padding-left: 5rem;',
        'font-size: 10px; color:#D3D3D3; padding-left: 5rem;',
        'font-family: "Ropa Sans",Georgia, serif; font-size: 16px;line-height:3rem; padding-left: 5rem;',
        'font-family: Helvetica Neue, sans-serif; font-size: 16px; line-height: 1.5rem; color:#gray;padding-left: 5rem'
      ),
    []
  )
  return (
    <Router>
      <Route path="/" page={PartsPage} name="home" />
      <Route notfound page={NotFoundPage} />

      {/* Ownership enforced routes */}
      <Route path="/u/{userName}/new" page={NewPart2Page} name="newPart2" />
      <Route path="/u/{userName}/edit" page={EditUser2Page} name="editUser2" />
      <Route path="/u/{userName}/{partTitle}/edit" page={EditPart2Page} name="editPart2" />
      {/* End ownership enforced routes */}

      <Route path="/u/{userName}" page={User2Page} name="user2" />
      <Route path="/u/{userName}/{partTitle}" page={Part2Page} name="part2" />
      <Route path="/u/{userName}/{partTitle}/ide" page={IdePartPage} name="ide" />

      {/* GENERATED ROUTES BELOW, probably going to clean these up and delete most of them, but the CRUD functionality is useful for now */}
      {/* All private by default for safety and because the routes that are left after clean up will probably be admin pages */}
      <Private unauthenticated="home" role="admin">
        <Route path="/part-reactions/new" page={NewPartReactionPage} name="newPartReaction" />
        <Route path="/part-reactions/{id}/edit" page={EditPartReactionPage} name="editPartReaction" />
        <Route path="/part-reactions/{id}" page={PartReactionPage} name="partReaction" />
        <Route path="/part-reactions" page={PartReactionsPage} name="partReactions" />
        <Route path="/parts/new" page={NewPartPage} name="newPart" />
        <Route path="/parts/{id}/edit" page={EditPartPage} name="editPart" />
        <Route path="/parts/{id}" page={PartPage} name="part" />
        <Route path="/comments/new" page={NewCommentPage} name="newComment" />
        <Route path="/comments/{id}/edit" page={EditCommentPage} name="editComment" />
        <Route path="/comments/{id}" page={CommentPage} name="comment" />
        <Route path="/comments" page={CommentsPage} name="comments" />
        <Route path="/users/new" page={NewUserPage} name="newUser" />
        <Route path="/users/{id}/edit" page={EditUserPage} name="editUser" />
        <Route path="/users/{id}" page={UserPage} name="user" />
        <Route path="/users" page={UsersPage} name="users" />
      </Private>
    </Router>
  )
}

export default Routes
