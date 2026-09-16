import { useState } from 'react'
import { useLocale } from '../i18n/LocaleContext'

export default function NewsCarousel({ items, isAdmin, onDelete }) {
  const { t } = useLocale()
  const list = Array.isArray(items) ? items : []
  const [index, setIndex] = useState(0)

  if (!list.length) return null

  const goTo = (i) => {
    if (!list.length) return
    const safe = ((i % list.length) + list.length) % list.length
    setIndex(safe)
  }

  const handlePrev = () => goTo(index - 1)
  const handleNext = () => goTo(index + 1)

  const current = list[index]

  return (
    <div className="news-carousel">
      <div className="news-carousel-media">
        <div
          className="news-carousel-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {list.map((item, i) => (
            <div key={i} className="news-carousel-slide">
              {item.image && (
                <img src={item.image} alt={item.title} />
              )}
            </div>
          ))}
        </div>
        {list.length > 1 && (
          <>
            <button type="button" className="news-nav news-nav-prev" onClick={handlePrev} aria-label="Previous">
              ‹
            </button>
            <button type="button" className="news-nav news-nav-next" onClick={handleNext} aria-label="Next">
              ›
            </button>
          </>
        )}
      </div>
      <div className="news-carousel-body">
        <p className="news-date">{current.date}</p>
        <h3>{current.title}</h3>
        {current.source && <p className="news-source">{current.source}</p>}
        {current.body && <p className="news-body">{current.body}</p>}
        {list.length > 1 && (
          <div className="news-dots">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={i === index ? 'is-active' : ''}
                aria-label={`Go to news ${i + 1}`}
              />
            ))}
          </div>
        )}
        {isAdmin && current.id && (
          <button
            type="button"
            onClick={() => onDelete?.(current.id)}
            className="news-delete"
          >
            {t('news_delete')}
          </button>
        )}
      </div>
    </div>
  )
}
