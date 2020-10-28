function UserPart({ userName, partName }) {
  return (
    <h3 className="text-xl font-roboto">
    <span className=" border-2 border-indigo-800 mr-1"></span>
      <span className="text-gray-500">
        {userName}
      </span>
      <span className="text-2xl mx-1 text-gray-400">
        /
      </span>
      <span className="text-indigo-800">
        {partName}
      </span>
    </h3>
  )
}

export default UserPart
