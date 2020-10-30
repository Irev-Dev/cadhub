function UserPart({ userName, partName }) {
  return (
    <h3 className="text-xl font-roboto">
      <div className="w-1 inline-block text-indigo-800 bg-indigo-800 mr-2">.</div>
      <span className="text-gray-500">
        {userName}
      </span>
      <div className="w-1 inline-block bg-gray-400 text-gray-400 mx-3 transform -skew-x-20" >.</div>
      <span className="text-indigo-800">
        {partName}
      </span>
    </h3>
  )
}

export default UserPart
