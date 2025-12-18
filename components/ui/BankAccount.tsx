import Image, { StaticImageData } from 'next/image'
import React from 'react'

interface BankAccountProps{
    conta: string;
    titular: string;
    nib:string;
    banco?:string;
    imageSrc: StaticImageData | string;  // path to image file
}
function BankAccount({titular,conta,imageSrc, nib,banco} : BankAccountProps) {
  return (
    <div className='flex gap-2 lg:gap-3.5 items-center'>
         <div className='w-16 h-16 relative'>
            <Image
                src={imageSrc}
                alt='Conta bancaria'
                placeholder='blur'
                blurDataURL={"blurDataURL"}
                fill
                className=''
            />
        </div>

        <div className='leading-normal'>
            <p>Conta: <span className='font-bold'>{conta}</span></p>
            <p>NIB: <span className='font-bold'>{nib}</span></p>
            <p>Titular: <span className='font-bold text-[0.75rem] sm:text-sm'>{titular}</span></p>
            <p>{banco}</p>
        </div>
    </div>
  )
}

export default BankAccount