import React from 'react'
import DadosSkeleton from './DadosSketelton'
import HeaderSkeleton from './UsreHeader'

export default function MainProfile() {
  return (
    <div className='space-y-6 gap-8'>
      <HeaderSkeleton/>
      <DadosSkeleton/>
    </div>
  )
}
