import React from 'react'

const Loader = () => {
  return (
    <div>Loaing...</div>
  )
}

export default Loader

export const Skeleton = () => {
  return (
    <div className="skeleton-loader">
      <div className="skeleton-loader">dd</div>
      <div className="skeleton-loader"></div>
      <div className="skeleton-loader"></div>
    </div>
  )
}