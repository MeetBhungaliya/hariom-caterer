import { USER_FALLBACK_ICON } from '@/constants/image'
import { useState } from 'react'
import { Avatar as AvatarComponent, AvatarFallback, AvatarImage } from './ui/avatar'

function Img({ containerClassName, imgProps }) {

  const states = ['loading', 'loaded', 'error']

  const [loadindState, setLoadindState] = useState(states[0])

  const onImageError = (e) => {
    e.target.src = USER_FALLBACK_ICON
  }

  return (
    <AvatarComponent className={containerClassName}>
      <AvatarImage {...imgProps} asChild onLoadingStatusChange={(e) => setLoadindState(e)}>
        <img {...imgProps} onError={onImageError} />
      </AvatarImage>
      <AvatarFallback>
        {loadindState === states[0] ? <div className="w-full h-full animate-shimmer" /> : <img className='w-full h-full' src={USER_FALLBACK_ICON} alt="error" />}
      </AvatarFallback>
    </AvatarComponent>
  )
}

export default Img