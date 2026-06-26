import { useState, useEffect } from 'react'
import Product from './products.tsx'

interface Service {
  id: number
  name: string
  description: string
  imgLink: string
}

interface Example {
  id: number
  description: string
  imgLink: string
}

interface FormData {
  name: string
  email: string
  number: string
  comment: string
  emailOrNumber: number
}

function App() {
  const [services, setServices] = useState<Service[]>([])
  const [examples, setExamples] = useState<Example[]>([])
  const [form, setForm] = useState<FormData>({
    name: '', email: '', number: '', comment: '', emailOrNumber: 1
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [nottap, istap] = useState(false)

  useEffect(() => {
    // 👇 Запросы идут через Nginx (прокси на порт 3000)
    fetch('/admin/services').then(res => res.json()).then(setServices).catch(console.error)
    fetch('/admin/examples').then(res => res.json()).then(setExamples).catch(console.error)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)
    try {
      // 👇 Запрос на отправку заявки через Nginx
      const res = await fetch('/admin/bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ошибка отправки')
      setSuccess(true)
      setForm({ name: '', email: '', number: '', comment: '', emailOrNumber: 1 })
      setTimeout(() => setSuccess(false), 4000)
    } catch (err: any) {
      setError(err.message || 'Не удалось отправить заявку')
    } finally {
      setLoading(false)
    }
  }

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "Isait",
        "url": typeof window !== 'undefined' ? window.location.origin : "https://isait.ru",
        "logo": "https://isait.ru/logo.png",
        "description": "Профессиональные IT-решения премиум уровня. Разрабатываем современные веб-сервисы и помогаем компаниям расти с помощью технологий и автоматизации бизнеса.",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "availableLanguage": ["ru", "Russian"]
        }
      },
      ...(services.length > 0 
        ? services.map((service) => ({
            "@type": "Service",
            "name": service.name,
            "description": service.description,
            "provider": {
              "@type": "Organization",
              "name": "Isait"
            },
            ...(service.imgLink && { "image": service.imgLink })
          }))
        : [])
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      <div>
        <header className="navbar">
          <nav className="navbar-content" aria-label="Основная навигация сайта">
            <div className="logo">
              <div className="logo-icon">IS</div>
              <span className="logo-text">Isait</span>
            </div>
            <button 
              onClick={() => document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })} 
              className="nav-btn"
              aria-label="Перейти к форме заявки"
            >
              Оставить заявку
            </button>
          </nav>
        </header>

        <main>
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-badge">IT-РЕШЕНИЯ ПРЕМИУМ УРОВНЯ</div>
            <h1 id="hero-title" className="hero-title">
              Профессиональные<br />IT-решения для вашего бизнеса
            </h1>
            <p className="hero-subtitle">
              Разрабатываем современные веб-сервисы и помогаем компаниям расти с помощью технологий.
            </p>
            <div className="hero-buttons">
              <button 
                onClick={() => document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })} 
                className="btn btn-primary"
                aria-label="Оставить заявку на IT-решение"
              >
                Оставить заявку
              </button>
              <button 
                onClick={() => document.getElementById('examples')?.scrollIntoView({ behavior: 'smooth' })} 
                className="btn btn-secondary"
                aria-label="Посмотреть примеры выполненных работ"
              >
                Посмотреть примеры
              </button>
            </div>
          </section>

          <section id="services" className="services" aria-labelledby="services-title">
            <h2 id="services-title" className="section-title">Наши услуги</h2>
            <div className="services-grid">
              {services.length > 0 ? (
                services.map(s => (
                  <div key={s.id} className="service-card">
                    {s.imgLink && (
                      <img 
                        src={s.imgLink}
                        alt={`${s.name} — профессиональная IT-услуга для бизнеса`} 
                        className="service-img" 
                        loading="lazy"
                      />
                    )}
                    <div className="service-content">
                      <h3 className="service-title">{s.name}</h3>
                      <p className="service-desc">{s.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: 'rgba(255,255,255,0.6)' }}>Услуги загружаются...</p>
              )}
            </div>
          </section>

          <section 
            id="examples" 
            className="services bg-[#0a0a0a] py-16 border-y border-white/10" 
            aria-labelledby="examples-title"
          >
            <div className="max-w-6xl mx-auto px-6">
              <h2 id="examples-title" className="section-title">Примеры работ</h2>
              <div className="services-grid">
                {examples.length > 0 ? (
                  examples.map(ex => (
                    <div key={ex.id} className="service-card">
                      {ex.imgLink && (
                        <img 
                          src={ex.imgLink}
                          alt={`Пример реализованного проекта: ${ex.description ? ex.description.substring(0, 80) : 'IT-решение для бизнеса'}`} 
                          className="service-img" 
                          loading="lazy"
                        />
                      )}
                      <div className="service-content">
                        <p className="service-desc">{ex.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'rgba(255,255,255,0.6)' }}>Примеры работ скоро появятся...</p>
                )}
              </div>
            </div>
          </section>

          <section id="form" className="form-section" aria-labelledby="form-title">
            <div className="form-container">
              <div className="form-header">
                <div className="form-badge">БЫСТРЫЙ СТАРТ</div>
                <h2 id="form-title" className="form-title">Оставить заявку</h2>
                <p className="form-subtitle">Расскажите о задаче — свяжемся в течение часа</p>
              </div>

              {success && (
                <div className="success-message" role="alert" aria-live="polite">
                  <div className="success-icon">✓</div>
                  <div className="success-text">Заявка отправлена! Мы свяжемся с вами в ближайшее время.</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="form" noValidate>
                <div>
                  <label htmlFor="name" className="sr-only">Ваше имя</label>
                  <input 
                    id="name"
                    type="text" 
                    placeholder="Ваше имя" 
                    value={form.name} 
                    onChange={e => setForm({ ...form, name: e.target.value })} 
                    className="input" 
                    required 
                    aria-label="Ваше имя"
                    autoComplete="name"
                  />
                </div>

                <div className="input-row">
                  <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input 
                      id="email"
                      type="email" 
                      placeholder="Email" 
                      value={form.email} 
                      onChange={e => setForm({ ...form, email: e.target.value })} 
                      className="input" 
                      required 
                      aria-label="Email для связи"
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label htmlFor="number" className="sr-only">Телефон</label>
                    <input 
                      id="number"
                      type="tel" 
                      placeholder="Телефон" 
                      value={form.number} 
                      onChange={e => setForm({ ...form, number: e.target.value })} 
                      className="input" 
                      required 
                      aria-label="Номер телефона для связи"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div 
                  className="contact-method" 
                  role="radiogroup" 
                  aria-labelledby="contact-method-label"
                >
                  <label id="contact-method-label" className="contact-method-label">
                    Предпочтительный способ связи
                  </label>
                  <div className="contact-buttons">
                    <button 
                      type="button" 
                      role="radio"
                      aria-checked={form.emailOrNumber === 1}
                      onClick={() => setForm({ ...form, emailOrNumber: 1 })} 
                      className={`contact-btn ${form.emailOrNumber === 1 ? 'active' : ''}`}
                      aria-label="Связаться по электронной почте"
                    >
                      Email
                    </button>
                    <button 
                      type="button" 
                      role="radio"
                      aria-checked={form.emailOrNumber === 0}
                      onClick={() => setForm({ ...form, emailOrNumber: 0 })} 
                      className={`contact-btn ${form.emailOrNumber === 0 ? 'active' : ''}`}
                      aria-label="Связаться по телефону"
                    >
                      Телефон
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="comment" className="sr-only">Расскажите о вашей задаче</label>
                  <textarea 
                    id="comment"
                    placeholder="Расскажите о вашей задаче..." 
                    value={form.comment} 
                    onChange={e => setForm({ ...form, comment: e.target.value })} 
                    className="textarea" 
                    required 
                    aria-label="Подробное описание вашей задачи или проекта"
                  />
                </div>

                {error && <p className="error-text" role="alert">{error}</p>}

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="submit-btn"
                  aria-label={loading ? "Отправка заявки..." : "Отправить заявку на IT-решение"}
                >
                  {loading ? 'Отправляем...' : 'Отправить заявку'}
                </button>
              </form>
            </div>
            <div>
              <button
                onClick={() => {
                  istap(true)
                }}
                className="submit-btn"
                aria-label="Узнать о продуктах"
              >
                Узнать о продуктах
              </button>
              {nottap && <div className="submit-btn"><button onClick={() => istap(false)} className="btn btn-secondary" aria-label="Закрыть информацию о продуктах">Закрыть</button><Product /></div>}
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="max-w-6xl mx-auto px-6 py-12 text-center text-sm text-white/60">
            <p>© {new Date().getFullYear()} Isait. Все права защищены.</p>
            <p className="mt-2">
              Профессиональные IT-решения премиум уровня для бизнеса • 
              Разработка веб-сервисов • Автоматизация бизнес-процессов • IT-консалтинг
            </p>
            <p className="mt-1">
              Помогаем компаниям расти с помощью современных технологий. 
              Свяжитесь с нами — ответим в течение часа.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
export default App