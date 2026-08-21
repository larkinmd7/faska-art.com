import { useState, useCallback } from 'react'
import { categories, works, bio, img } from './data'
import Header from './components/Header'
import Gallery from './components/Gallery'
import CategoryCards from './components/CategoryCards'
import Lightbox from './components/Lightbox'
import Footer from './components/Footer'

type Page = 'home' | 'portfolio' | 'contacts' | string

function App() {
  const [page, setPage] = useState<Page>('home')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const currentCategory = categories.find(c => c.slug === page)
  const galleryItems = currentCategory
    ? works.filter(w => w.category === currentCategory.id)
    : works

  const navigate = useCallback((p: Page) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header page={page} onNavigate={navigate} />

      <main className="flex-1">
        {page === 'home' && <HomePage onNavigate={navigate} />}
        {page === 'portfolio' && <PortfolioPage onNavigate={navigate} />}
        {page === 'contacts' && <ContactsPage />}
        {currentCategory && (
          <div className="max-w-[1200px] mx-auto px-[25px] pb-[25px]">
            <Gallery
              items={galleryItems}
              onImageClick={(idx) => setLightboxIndex(idx)}
            />
            <div className="mt-16">
              <p className="text-xs uppercase tracking-[0.1em] text-dark/75 font-[Forum] mb-6 text-center">
                Портфолио
              </p>
              <CategoryCards
                categories={categories.filter(c => c.id !== currentCategory.id)}
                onSelect={(slug) => navigate(slug)}
              />
            </div>
          </div>
        )}
      </main>

      <Footer />

      {lightboxIndex !== null && (
        <Lightbox
          items={galleryItems}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  )
}

function HomePage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <section className="max-w-[1200px] mx-auto px-[25px] py-12 md:py-20">
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
        <div className="w-full md:w-[45%] shrink-0">
          <img
            src={img('images/IMG_9127.JPG')}
            alt="Алина в мастерской"
            className="w-full rounded-none"
            loading="lazy"
          />
        </div>
        <div className="w-full md:w-[55%]">
          <h1 className="font-[Forum] text-[36px] leading-[1.1] tracking-[0.02em] text-dark m-0 mb-2">
            {bio.name}
          </h1>
          <h3 className="font-[Forum] text-[24px] leading-[1.1] tracking-[0.02em] text-gray m-0 mb-8">
            {bio.subtitle}
          </h3>
          {bio.paragraphs.map((p, i) => (
            <p key={i} className="text-[14px] leading-[1.5] text-dark mb-4 last:mb-0">
              {p}
            </p>
          ))}
          <div className="mt-8">
            <button
              onClick={() => onNavigate('portfolio')}
              className="inline-flex items-center justify-center min-w-[140px] px-10 py-[18px] border border-dark rounded-full bg-dark text-white text-xs uppercase tracking-[0.1em] leading-[1.5] cursor-pointer hover:bg-gray hover:border-transparent transition-colors"
            >
              Портфолио
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function PortfolioPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <section className="max-w-[1200px] mx-auto px-[25px] py-12 md:py-20">
      <CategoryCards
        categories={categories}
        onSelect={(slug) => onNavigate(slug)}
        large
      />
    </section>
  )
}

function ContactsPage() {
  return (
    <section className="max-w-[600px] mx-auto px-[25px] py-12 md:py-20 text-center">
      <img
        src={img('images/IMG_9127.JPG')}
        alt="Алина"
        className="w-[280px] h-[280px] object-cover rounded-full mx-auto mb-8"
        loading="lazy"
      />
      <p className="text-[14px] text-dark mb-6">
        Для связи напишите мне в Telegram, а новые работы смотрите в Instagram
      </p>
      <div className="flex flex-col gap-3">
        <a
          href={bio.contacts.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full max-w-[300px] mx-auto px-8 py-3 border border-dark rounded-lg bg-transparent text-dark text-[14px] hover:bg-dark hover:text-white transition-colors gap-3"
        >
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          {bio.contacts.telegramLabel}
        </a>
        <a
          href={bio.contacts.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full max-w-[300px] mx-auto px-8 py-3 border border-dark rounded-lg bg-transparent text-dark text-[14px] hover:bg-dark hover:text-white transition-colors gap-3"
        >
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4.25" />
            <circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none" />
          </svg>
          {bio.contacts.instagramLabel}
        </a>
      </div>
    </section>
  )
}

export default App
