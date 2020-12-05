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
      <Private unauthenticated="home" role="user">
        <Route path="/u/{userName}/edit" page={EditUser2Page} name="editUser2" />
        <Route path="/u/{userName}/{partTitle}/edit" page={EditPart2Page} name="editPart2" />
      </Private>
      {/* End ownership enforced routes */}

      <Route path="/u/{userName}" page={User2Page} name="user2" />
      <Route path="/u/{userName}/{partTitle}" page={Part2Page} name="part2" />
      <Route path="/u/{userName}/{partTitle}/ide" page={IdePartPage} name="ide" />

      <Private unauthenticated="home" role="admin">
        <Route path="/users" page={UsersPage} name="users" />
      </Private>
    </Router>
  )
}

export default Routes
