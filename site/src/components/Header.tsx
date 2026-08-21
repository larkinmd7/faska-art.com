interface HeaderProps {
  page: string
  onNavigate: (page: string) => void
}

const navItems = [
  { id: 'home', label: 'Главная' },
  { id: 'portfolio', label: 'Портфолио' },
  { id: 'contacts', label: 'Контакты' },
]

export default function Header({ page, onNavigate }: HeaderProps) {
  const isActive = (id: string) => {
    if (id === 'home') return page === 'home'
    if (id === 'portfolio') return page === 'portfolio' || !['home', 'contacts'].includes(page)
    return page === id
  }

  return (
    <header className="py-5 md:py-6">
      <nav className="max-w-[1200px] mx-auto px-[25px] flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-8">
        <button
          onClick={() => onNavigate('home')}
          aria-label="Faska Art — главная"
          className="group flex items-center gap-3 bg-transparent border-none cursor-pointer p-0 text-dark"
        >
          <img
            src="/brand/faska-art-mark.svg"
            alt=""
            width="48"
            height="48"
            className="w-12 h-12 block transition-transform duration-300 group-hover:scale-[1.04]"
          />
          <span className="font-[Forum] text-[28px] leading-none tracking-[0.02em]">
            Faska Art
          </span>
        </button>
        <ul className="flex items-center justify-center gap-4 sm:gap-8 list-none m-0 p-0">
          {navItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`
                  bg-transparent border-none cursor-pointer
                  text-xs uppercase tracking-[0.1em] leading-none
                  text-dark font-[Roboto] p-0
                  border-b border-b-transparent
                  hover:border-b-dark
                  transition-[border-color] duration-200
                  ${isActive(item.id) ? 'border-b-dark !border-b' : ''}
                `}
                style={{
                  borderBottom: isActive(item.id) ? '1px solid #1e1e1e' : '1px solid transparent',
                  paddingBottom: '2px',
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
