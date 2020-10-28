function UserPart({ userName, partName }) {
  return (
    <h3 className="text-xl font-roboto">
    <span className="border-2 border-indigo-800 mr-1"></span>
      <span className="text-gray-500">
        {userName}
      </span>
      <span className="border-2 border-gray-400 mx-1 transform -skew-x-12">
      </span>
      <span className="text-indigo-800">
        {partName}
      </span>
    </h3>
  )
}

export default UserPart
