import React from 'react'

function LoadingBounce() {
  return (
    <div className='flex space-x-2 justify-center items-center dark:invert'>
 	<span className='sr-only'>Loading...</span>
  	<div className='h-2 w-2 bg-primary rounded-full animate-bounce duration-500 [animation-delay:-0.3s]'></div>
	<div className='h-2 w-2 bg-primary rounded-full animate-bounce duration-500 [animation-delay:-0.15s]'></div>
	<div className='h-2 w-2 bg-primary rounded-full animate-bounce duration-500'></div>
</div>
  )
}

export default LoadingBounce