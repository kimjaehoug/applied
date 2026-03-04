import { useState } from 'react'

export default function NewsCarousel({ items }) {
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
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col md:flex-row">
      {/* 이미지 영역 (좌측) */}
      <div className="relative w-full md:w-1/2 h-72 sm:h-80 md:h-[26rem] lg:h-[30rem] bg-gray-100 overflow-hidden">
        <div
          className="flex w-full h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {list.map((item, i) => (
            <div key={i} className="w-full h-full shrink-0">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
        {list.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center text-sm hover:bg-black/60"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center text-sm hover:bg-black/60"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* 텍스트 영역 (우측) */}
      <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
        <p className="text-sm text-jbnu-navy font-medium">
          {current.date} · {current.source}
        </p>
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-2">
          {current.title}
        </h3>
        <p className="text-gray-600 mt-3 leading-relaxed">
          {current.body}
        </p>
        {list.length > 1 && (
          <div className="mt-4 flex items-center justify-center md:justify-start gap-2">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === index ? 'bg-jbnu-navy' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`뉴스 ${i + 1}로 이동`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

