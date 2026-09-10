import Image from 'next/image'
import { Image as ImageIcon, ExternalLink } from 'lucide-react'
import { clsx } from 'clsx'

interface SafeImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
  className?: string
  priority?: boolean
}

export default function SafeImage({ src, alt, fill, width, height, sizes, className, priority }: SafeImageProps) {
  if (!src) return <div className={clsx("bg-gray-100 flex items-center justify-center text-canvas-muted", className)}><ImageIcon className="w-1/3 h-1/3 opacity-50" /></div>

  const isGooglePhotos = src.includes('photos.app.goo.gl') || src.includes('photos.google.com')
  const isGoogleDrive = src.includes('drive.google.com')

  if (isGooglePhotos) {
    return (
      <a href={src} target="_blank" rel="noopener noreferrer" className={clsx("bg-gray-100 flex flex-col items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer text-canvas-muted relative group", className)}>
        <span className="text-3xl mb-1">📸</span>
        <span className="text-[10px] font-medium px-2 text-center leading-tight">View in<br/>Google Photos</span>
        <ExternalLink className="w-4 h-4 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>
    )
  }

  let finalSrc = src
  if (isGoogleDrive && src.includes('/view')) {
    finalSrc = src.replace(/\/file\/d\/(.+?)\/view.*/, '/thumbnail?id=$1&sz=w1000')
  }

  return (
    <Image 
      src={finalSrc} 
      alt={alt} 
      fill={fill}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      unoptimized={isGoogleDrive}
      priority={priority}
    />
  )
}
