import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { i18n } = useTranslation()
  const isRu = i18n.language === 'ru'

  return (
    <footer className="border-t border-zinc-900 py-8 px-6">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <span className="text-sm text-zinc-700">
          sqrilizz · {new Date().getFullYear()}
        </span>
        <button
          onClick={() => i18n.changeLanguage(isRu ? 'en' : 'ru')}
          className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors font-mono px-2 py-1 rounded-md hover:bg-zinc-900"
        >
          {isRu ? 'EN' : 'RU'}
        </button>
      </div>
    </footer>
  )
}
