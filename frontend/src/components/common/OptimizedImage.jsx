import React, { useState, useEffect, useRef } from 'react'

const DEFAULT_FALLBACK =
  'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22500%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20500%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%2311141e%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%231e2536%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%23g)%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20fill%3D%22%23ff5c00%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20font-weight%3D%22bold%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EACARA%20TECH%3C%2Ftext%3E%3C%2Fsvg%3E'

function optimizeImageUrl(url, targetWidth = 480, quality = 70) {
  if (!url) return DEFAULT_FALLBACK

  // If already a data URI or local asset, return as-is
  if (url.startsWith('data:') || url.startsWith('/')) return url

  // Optimize Unsplash images by resizing and converting to WebP for fast downloads
  if (url.includes('images.unsplash.com')) {
    try {
      const urlObj = new URL(url)
      urlObj.searchParams.set('auto', 'format')
      urlObj.searchParams.set('fit', 'crop')
      urlObj.searchParams.set('w', targetWidth.toString())
      urlObj.searchParams.set('q', quality.toString())
      urlObj.searchParams.set('fm', 'webp')
      return urlObj.toString()
    } catch {
      return url
    }
  }

  return url
}

export function OptimizedImage({
  src,
  alt = 'Event Image',
  className = '',
  containerClassName = '',
  targetWidth = 480,
  quality = 70,
  priority = false,
  aspectRatio = 'aspect-[16/9]',
  ...props
}) {
  const imgRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const optimizedSrc = error ? DEFAULT_FALLBACK : optimizeImageUrl(src, targetWidth, quality)

  // Instant display if browser has already cached the image
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true)
    }
  }, [optimizedSrc])

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-[#11141e] ${aspectRatio} ${containerClassName}`}
    >
      {/* Background ambient pattern while image is loading */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse transform-gpu" />
          <span className="text-[10px] font-mono font-bold tracking-wider text-white/20 uppercase">
            Acara Tech
          </span>
        </div>
      )}

      <img
        ref={imgRef}
        src={optimizedSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...props}
      />
    </div>
  )
}
