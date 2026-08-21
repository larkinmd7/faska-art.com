import { useEffect, useCallback } from 'react'
import { optimizedImage, type WorkItem } from '../data'

interface LightboxProps {
  items: WorkItem[]
  index: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export default function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const goPrev = useCallback(() => {
    onNavigate(index > 0 ? index - 1 : items.length - 1)
  }, [index, items.length, onNavigate])

  const goNext = useCallback(() => {
    onNavigate(index < items.length - 1 ? index + 1 : 0)
  }, [index, items.length, onNavigate])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose, goPrev, goNext])

  const item = items[index]
  if (!item) return null

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div
        className="flex flex-col md:flex-row bg-white max-w-[1100px] w-[95vw] max-h-[90vh] rounded-lg overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Фото слева */}
        <div className="md:w-[60%] w-full bg-[#f5f5f5] flex items-center justify-center relative shrink-0 max-h-[55vh] md:max-h-none md:min-h-0">
          <picture className="w-full h-full flex items-center justify-center">
            <source srcSet={optimizedImage(item.src, 'full')} type="image/avif" />
            <img
              src={item.src}
              alt={item.alt}
              className="w-full h-full object-contain max-h-[55vh] md:max-h-[85vh]"
              decoding="async"
            />
          </picture>
          {/* Навигация */}
          <button
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-dark flex items-center justify-center text-xl shadow-md border-none cursor-pointer transition-colors"
          >
            ‹
          </button>
          <button
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-dark flex items-center justify-center text-xl shadow-md border-none cursor-pointer transition-colors"
          >
            ›
          </button>
          {/* Счётчик */}
          <span className="absolute bottom-3 left-3 text-xs text-dark/50 bg-white/80 px-2 py-1 rounded">
            {index + 1} / {items.length}
          </span>
        </div>

        {/* Описание справа */}
        <div className="md:w-[40%] w-full p-6 md:p-10 flex flex-col justify-center relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 flex items-center justify-center text-dark/40 hover:text-dark text-lg bg-transparent border-none cursor-pointer transition-colors z-10"
          >
            ✕
          </button>
          <h2 className="font-[Forum] text-[22px] md:text-[28px] leading-[1.2] tracking-[0.01em] text-dark m-0 mb-3 md:mb-4 pr-8">
            {item.title}
          </h2>
          <p className="text-[14px] leading-[1.7] text-dark/80 m-0">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  )
}
