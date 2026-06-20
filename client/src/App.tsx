import { useState, useEffect } from 'react'

interface Service {
  id: number
  name: string
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

const API = 'http://46.253.132.225:3000'

function App() {
  const [services, setServices] = useState<Service[]>([])
  const [form, setForm] = useState<FormData>({
    name: '', email: '', number: '', comment: '', emailOrNumber: 1
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API}/services`)
      .then(res => res.json())
      .then(setServices)
      .catch(console.error)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const res = await fetch(`${API}/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Ошибка отправки')

      setSuccess(true)
      setForm({ name: '', email: '', number: '', comment: '', emailOrNumber: 1 })
      setTimeout(() => setSuccess(false), 4000)
    } catch {
      setError('Не удалось отправить заявку. Попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">
            <div className="logo-icon">IS</div>
            <span className="logo-text">Isait</span>
          </div>
          <button onClick={() => document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })} className="nav-btn">
            Оставить заявку
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">IT-РЕШЕНИЯ ПРЕМИУМ УРОВНЯ</div>
        <h1 className="hero-title">Профессиональные<br />IT-решения для вашего бизнеса</h1>
        <p className="hero-subtitle">Разрабатываем современные веб-сервисы и помогаем компаниям расти с помощью технологий.</p>

        <div className="hero-buttons">
          <button onClick={() => document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-primary">Оставить заявку</button>
          <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-secondary">Посмотреть услуги</button>
        </div>
      </section>

      {/* Услуги */}
      <section id="services" className="services">
        <h2 className="section-title">Наши услуги</h2>
        <div className="services-grid">
          {services.length > 0 ? services.map(s => (
            <div key={s.id} className="service-card">
              {s.imgLink && <img src={s.imgLink} alt={s.name} className="service-img" />}
              <div className="service-content">
                <h3 className="service-title">{s.name}</h3>
                <p className="service-desc">{s.description}</p>
              </div>
            </div>
          )) : <p style={{color: 'rgba(255,255,255,0.6)'}}>Услуги загружаются...</p>}
        </div>
      </section>

      {/* Форма */}
      <section id="form" className="form-section">
        <div className="form-container">
          <div className="form-header">
            <div className="form-badge">БЫСТРЫЙ СТАРТ</div>
            <h2 className="form-title">Оставить заявку</h2>
            <p className="form-subtitle">Расскажите о задаче — свяжемся в течение часа</p>
          </div>

          {success && (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <div className="success-text">Заявка отправлена!</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="form">
            <input type="text" placeholder="Ваше имя" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input" required />

            <div className="input-row">
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input" required />
              <input type="tel" placeholder="Телефон" value={form.number} onChange={e => setForm({...form, number: e.target.value})} className="input" required />
            </div>

            <div className="contact-method">
              <label className="contact-method-label">Предпочтительный способ связи</label>
              <div className="contact-buttons">
                <button type="button" onClick={() => setForm({...form, emailOrNumber: 1})} className={`contact-btn ${form.emailOrNumber === 1 ? 'active' : ''}`}>Email</button>
                <button type="button" onClick={() => setForm({...form, emailOrNumber: 0})} className={`contact-btn ${form.emailOrNumber === 0 ? 'active' : ''}`}>Телефон</button>
              </div>
            </div>

            <textarea placeholder="Расскажите о вашей задаче..." value={form.comment} onChange={e => setForm({...form, comment: e.target.value})} className="textarea" required />

            {error && <p className="error-text">{error}</p>}

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Отправляем...' : 'Отправить заявку'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default App