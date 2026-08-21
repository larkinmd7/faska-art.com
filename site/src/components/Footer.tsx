import { bio } from '../data'

export default function Footer() {
  return (
    <footer className="py-10 text-center">
      <p className="text-[14px] text-dark mb-1">
        Керамика ручной работы — Алина
      </p>
      <nav aria-label="Социальные сети" className="flex items-center justify-center gap-3 mb-2 text-[14px]">
        <a
          href={bio.contacts.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-dark underline decoration-dark/30 underline-offset-4 hover:decoration-dark transition-colors"
        >
          Instagram
        </a>
        <span aria-hidden="true" className="text-dark/30">·</span>
        <a
          href={bio.contacts.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-dark underline decoration-dark/30 underline-offset-4 hover:decoration-dark transition-colors"
        >
          Telegram
        </a>
      </nav>
      <p className="text-[14px] text-dark mb-1">
        {new Date().getFullYear()}
      </p>
      <p className="text-[14px] text-dark/50">
        Все права защищены
      </p>
    </footer>
  )
}
