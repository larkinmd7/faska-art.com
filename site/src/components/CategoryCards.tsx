import { useState } from 'react'
import type { Category } from '../data'

interface CategoryCardsProps {
  categories: Category[]
  onSelect: (slug: string) => void
  large?: boolean
}

export default function CategoryCards({ categories, onSelect, large }: CategoryCardsProps) {
  return (
    <div className={`
      grid gap-6
      ${large
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        : 'grid-cols-2 sm:grid-cols-3'
      }
    `}>
      {categories.map(cat => (
        <CategoryCard key={cat.id} category={cat} onSelect={onSelect} large={large} />
      ))}
    </div>
  )
}

function CategoryCard({ category, onSelect, large }: { category: Category; onSelect: (slug: string) => void; large?: boolean }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <button
      onClick={() => onSelect(category.slug)}
      className="group bg-transparent border-none cursor-pointer p-0 text-left w-full"
    >
      <div className={`overflow-hidden ${large ? 'aspect-square' : 'aspect-[4/3]'}`}>
        <div className={`lazy-image w-full h-full ${loaded ? 'loaded' : ''}`}>
          <img
            src={category.cover}
            alt={category.title}
            className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        </div>
      </div>
      <p className="text-[14px] text-dark mt-3 text-center group-hover:underline transition-all">
        {category.title}
      </p>
    </button>
  )
}
