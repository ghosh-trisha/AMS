import React from "react";
import HashLoader from "react-spinners/HashLoader";


export default function Loader({ loading, color = "#1E2939", size = 50, hash=false }) {
  return (
    hash ?
        <div className="my-auto mx-auto h-full">
          <HashLoader color={color} loading={loading} size={size} />
        </div>
        :
  <div className="p-6 grid gap-4 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-2/3"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        <div className="h-32 bg-gray-200 rounded w-full"></div>
      </div>
  )
}
