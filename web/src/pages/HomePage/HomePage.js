import BlogLayout from 'src/layouts/BlogLayout'
import BlogPostsCell from 'src/components/BlogPostsCell'
import { initialize} from 'src/cascade/js/MainPage/CascadeMain'

const HomePage = () => {
  return (

    <BlogLayout>
      <BlogPostsCell/>
      <div>
        <button onClick={() => new initialize()}>init</button>
      </div>
    </BlogLayout>
  )
}

export default HomePage