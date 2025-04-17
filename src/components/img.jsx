import { USER_FALLBACK_ICON } from '@/constants/image'

function Img(props) {
  const onImageError = (e) => {
    e.target.src = USER_FALLBACK_ICON
  }

  return <img {...props} onError={onImageError} />
}

export default Img
