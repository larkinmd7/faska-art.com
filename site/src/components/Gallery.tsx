import { useState, useRef, useEffect } from 'react'
import { optimizedImage, type WorkItem } from '../data'

interface GalleryProps {
  items: WorkItem[]
  onImageClick: (index: number) => void
}

function LazyImage({ src, alt, onClick }: { src: string; alt: string; onClick: () => void }) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true)
  }, [])

  return (
    <div
      className={`lazy-image cursor-pointer overflow-hidden ${loaded ? 'loaded' : ''}`}
      onClick={onClick}
    >
      <picture className="block w-full h-full">
        <source srcSet={optimizedImage(src, 'thumb')} type="image/avif" />
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className="w-full h-full object-cover block hover:scale-[1.03] transition-transform duration-500"
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
        />
      </picture>
    </div>
  )
}

export default function Gallery({ items, onImageClick }: GalleryProps) {
  const rows: WorkItem[][] = []
  let i = 0
  while (i < items.length) {
    const remaining = items.length - i
    if (remaining >= 3 && remaining !== 4) {
      rows.push(items.slice(i, i + 3))
      i += 3
    } else {
      rows.push(items.slice(i, i + 2))
      i += 2
    }
  }

  let globalIdx = 0

  return (
    <div className="flex flex-col gap-[5px]">
      {rows.map((row, rowIdx) => {
        const startIdx = globalIdx
        globalIdx += row.length
        return (
          <div
            key={rowIdx}
            className={`grid gap-[5px] ${
              row.length === 3
                ? 'grid-cols-1 sm:grid-cols-3'
                : 'grid-cols-1 sm:grid-cols-2'
            }`}
          >
            {row.map((item, colIdx) => (
              <div
                key={item.id}
                className="aspect-[4/5] overflow-hidden"
              >
                <LazyImage
                  src={item.src}
                  alt={item.alt}
                  onClick={() => onImageClick(startIdx + colIdx)}
                />
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
