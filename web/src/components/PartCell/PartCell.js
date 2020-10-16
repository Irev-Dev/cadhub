
import {QUERY as reExportQuery} from 'src/components/EditPartCell'
import Editor from "rich-markdown-editor";

export const QUERY = reExportQuery

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => <div>Error: {error.message}</div>

export const Success = ({ part }) => {
  console.log(part)
  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center">
          <img src={part.mainImage} />
        </div>
        <div className="bg-white p-8 my-12 min-h-md">
          <h2 className="text-4xl py-4">{part.title}</h2>
          <Editor
            className="bg-indigo-700"
            defaultValue={part.description}
            readOnly
          />
        </div>
      </div>
    </>
  )
}
