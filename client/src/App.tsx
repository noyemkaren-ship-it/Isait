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

const API = 'http://46.253.132.225:5000'

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
    } catch (err) {
      setError('Не удалось отправить заявку. Попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Navbar */}
      <nav className="fixed w-full bg-black/90 backdrop-blur-lg z-50 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-cyan-500 rounded-xl flex items-center justify-center font-bold">IS</div>
            <span className="text-2xl font-semibold">Isait</span>
          </div>
          <button 
            onClick={() => document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-2.5 bg-white text-black rounded-2xl font-semibold hover:bg-cyan-400 hover:text-white transition-all"
          >
            Оставить заявку
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-16 px-6 max-w-5xl mx-auto text-center">
        <div className="text-cyan-400 text-sm tracking-[3px] mb-4">IT-РЕШЕНИЯ ПРЕМИУМ УРОВНЯ</div>
        <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6">
          Профессиональные<br />IT-решения для вашего бизнеса
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-white/70 mb-8">
          Разрабатываем современные веб-сервисы и помогаем компаниям расти с помощью технологий.
        </p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-white text-black rounded-3xl font-semibold text-lg"
          >
            Оставить заявку
          </button>
          <button 
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 border border-white/30 rounded-3xl font-semibold text-lg hover:bg-white/5"
          >
            Посмотреть услуги
          </button>
        </div>
      </section>

      {/* Услуги */}
      <section id="services" className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-5xl font-bold mb-10">Наши услуги</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length > 0 ? services.map(s => (
            <div key={s.id} className="group bg-[#111] border border-white/10 rounded-3xl overflow-hidden">
              {s.imgLink && <img src={s.imgLink} alt="" className="w-full h-48 object-cover" />}
              <div className="p-8">
                <h3 className="text-2xl font-semibold mb-3">{s.name}</h3>
                <p className="text-white/70">{s.description}</p>
              </div>
            </div>
          )) : (
            <p className="text-white/60">Услуги загружаются...</p>
          )}
        </div>
      </section>

      {/* Форма заявки */}
      <section id="form" className="bg-[#0a0a0a] py-20 px-6 border-y border-white/10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-cyan-400 text-sm tracking-widest mb-3">БЫСТРЫЙ СТАРТ</div>
            <h2 className="text-6xl font-bold tracking-tighter">Оставить заявку</h2>
            <p className="text-xl text-white/70 mt-3">Расскажите о задаче — свяжемся в течение часа</p>
          </div>

          {success && (
            <div className="mb-8 p-6 bg-emerald-500/10 border border-emerald-500/40 rounded-3xl text-center">
              <div className="text-5xl mb-2">✓</div>
              <div className="text-2xl font-semibold text-emerald-400">Заявка отправлена!</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-[#111] border border-white/10 rounded-3xl p-10 space-y-6">
            <input 
              type="text" placeholder="Ваше имя" 
              value={form.name} onChange={e => setForm({...form, name: e.target.value})} required 
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              <input type="tel" placeholder="Телефон" value={form.number} onChange={e => setForm({...form, number: e.target.value})} required />
            </div>

            <div>
              <label className="block mb-2 text-sm text-white/70">Предпочтительный способ связи</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setForm({...form, emailOrNumber: 1})}
                  className={`flex-1 py-3 rounded-2xl border ${form.emailOrNumber === 1 ? 'bg-cyan-500 border-cyan-500' : 'border-white/20'}`}>
                  Email
                </button>
                <button type="button" onClick={() => setForm({...form, emailOrNumber: 0})}
                  className={`flex-1 py-3 rounded-2xl border ${form.emailOrNumber === 0 ? 'bg-cyan-500 border-cyan-500' : 'border-white/20'}`}>
                  Телефон
                </button>
              </div>
            </div>

            <textarea 
              placeholder="Расскажите о вашей задаче..." rows={6}
              value={form.comment} onChange={e => setForm({...form, comment: e.target.value})} required 
            />

            {error && <p className="text-red-400">{error}</p>}

            <button 
              type="submit" disabled={loading}
              className="w-full py-5 bg-white text-black rounded-3xl font-bold text-xl disabled:opacity-70"
            >
              {loading ? 'Отправляем...' : 'Отправить заявку'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default App