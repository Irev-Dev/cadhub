// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route } from '@redwoodjs/router'

const Routes = () => {
  return (
    <Router>
      <Route path="/contact" page={ContactPage} name="contact" />
      <Route path="/parts/new" page={NewPartPage} name="newPart" />
      <Route path="/parts/{id:Int}/edit" page={EditPartPage} name="editPart" />
      <Route path="/parts/{id:Int}" page={PartPage} name="part" />
      <Route path="/parts" page={PartsPage} name="parts" />
      <Route path="/blog-post/{id:Int}" page={BlogPostPage} name="blogPost" />
      <Route path="/admin/posts/new" page={NewPostPage} name="newPost" />
      <Route path="/admin/posts/{id:Int}/edit" page={EditPostPage} name="editPost" />
      <Route path="/admin/posts/{id:Int}" page={PostPage} name="post" />
      <Route path="/admin/posts" page={PostsPage} name="posts" />
      <Route path="/about" page={AboutPage} name="about" />
      <Route path="/" page={PartsPage} name="home" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
