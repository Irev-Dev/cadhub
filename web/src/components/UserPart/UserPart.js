function UserPart({ userName, partName }) {
  return (
    <h3 className="text-xl">
    <span className=" border-2 border-purple-900 mr-1"></span>
      <span className="text-gray-500">
        {userName}
      </span>
      <span className="text-2xl mx-1 text-gray-300">
        /
      </span>
      <span className="text-purple-900">
        {partName}
      </span>
    </h3>
  )
}

export default UserPart
