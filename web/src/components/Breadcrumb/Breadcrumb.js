import { getActiveClasses } from "get-active-classes"

const Breadcrumb = ({ userName, partTitle, className }) => {
  return (
    <h3 className={getActiveClasses("text-2xl font-roboto", className)}>
      <div className="w-1 inline-block text-indigo-800 bg-indigo-800 mr-2">.</div>
      <span className="text-gray-500">
        {userName}
      </span>
      <div className="w-1 inline-block bg-gray-400 text-gray-400 mx-3 transform -skew-x-20" >.</div>
      <span className="text-indigo-800">
        {partTitle}
      </span>
    </h3>
  )
}

export default Breadcrumb
