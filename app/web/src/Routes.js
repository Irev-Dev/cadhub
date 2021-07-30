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

%cCadHub is in active development - Want to lend a hand?          %chttps://github.com/Irev-Dev/cadhub

%cOr get a sneak peak of work under construction?          %chttps://cadhub.xyz/dev-ide

`

const Routes = () => {
  useEffect(
    () =>
      console.log(
        welcomeMessage,
        'font-family: Georgia, serif; font-weight:bold; line-height: 2rem; font-size: 32px; color: #3c366b',
        'font-size: 10px; color:#D3D3D3',
        'font-family: "Ropa Sans",Georgia, serif; font-size: 16px; line-height:3rem',
        'font-family: Helvetica Neue, sans-serif; font-size: 16px; line-height: 1.5rem; color:#gray',
        'font-family: "Ropa Sans",Georgia, serif; font-size: 16px; line-height:3rem',
        'font-family: Helvetica Neue, sans-serif; font-size: 16px; line-height: 1.5rem'
      ),
    []
  )
  return (
    <Router>
      <Route path="/dev-ide/{cadPackage}" page={DevIdePage} name="devIde" />
      <Route path="/policies/privacy-policy" page={PrivacyPolicyPage} name="privacyPolicy" />
      <Route path="/policies/code-of-conduct" page={CodeOfConductPage} name="codeOfConduct" />
      <Route path="/account-recovery/update-password" page={UpdatePasswordPage} name="updatePassword" />
      <Route path="/account-recovery" page={AccountRecoveryPage} name="accountRecovery" />
      <Route path="/" page={HomePage} name="home" prerender />
      <Route notfound page={NotFoundPage} />

      {/* Ownership enforced routes */}
      <Route path="/u/{userName}/new" page={NewProjectPage} name="newProject" />
      <Private unauthenticated="home" role="user">
        <Route path="/u/{userName}/edit" page={EditUserPage} name="editUser" />
        <Route path="/u/{userName}/{projectTitle}/edit" page={EditProjectPage} name="editProject" />
      </Private>
      {/* End ownership enforced routes */}

      <Route path="/draft/{cadPackage}" page={DraftProjectPage} name="draftProject" />
      <Route path="/u/{userName}" page={UserPage} name="user" />
      <Route path="/u/{userName}/{projectTitle}" page={ProjectPage} name="project" />
      <Route path="/u/{userName}/{projectTitle}/ide" page={IdeProjectPage} name="ide" />
      <Route path="/u/{userName}/{projectTitle}/social-card" page={SocialCardPage} name="socialCard" />

      <Private unauthenticated="home" role="admin">
        <Route path="/admin/users" page={UsersPage} name="users" />
        <Route path="/admin/projects" page={AdminProjectsPage} name="projects" />
        <Route path="/admin/subject-access-requests/{id}/edit" page={EditSubjectAccessRequestPage} name="editSubjectAccessRequest" />
        <Route path="/admin/subject-access-requests/{id}" page={SubjectAccessRequestPage} name="subjectAccessRequest" />
        <Route path="/admin/subject-access-requests" page={SubjectAccessRequestsPage} name="subjectAccessRequests" />

        {/* Retired for now but might want to bring it back, delete if older that I dunno late 2021 */}
        {/* <Route path="/admin/email" page={AdminEmailPage} name="adminEmail" />  */}
      </Private>
    </Router>
  )
}

export default Routes
