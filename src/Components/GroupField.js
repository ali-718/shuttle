import React from 'react'

export default function GroupField (props) {
  const { label, error, submitFailed, className } = props

  return (
    <>
      <div className='mt-4'>
        {label && (
          <label className="block text-gray-700 text-sm font-bold mb-2" for="username">
          {label}
        </label>
        )}

      <input className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${className}`} type={props.type || 'text'} placeholder={props.placeholder} {...props} />
      </div>
      {submitFailed && error && <p className='text-[#ff000099]'>{error}</p>}
    </>
  )
}
