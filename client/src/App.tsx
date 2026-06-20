import { useState, useEffect } from 'react'

// Types
interface Service {
  id: number
  name: string
  description: string
  imgLink: string
}

interface BidForm {
  name: string
  email: string
  number: string
  comment: string
  emailOrNumber: number // 1 = email, 0 = phone
}

const API_URL = 'http://46.253.132.225:5000'

function App() {
  // Services
  const [services, setServices] = useState<Service[]>([])
  const [loadingServices, setLoadingServices] = useState(true)

  // Bid Form
  const [form, setForm] = useState<BidForm>({
    name: '',
    email: '',
    number: '',
    comment: '',
    emailOrNumber: 1,
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_URL}/services`)
        if (!res.ok) throw new Error('Ошибка загрузки услуг')
        const data: Service[] = await res.json()
        setServices(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingServices(false)
      }
    }
    fetchServices()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleContactMethod = (method: number) => {
    setForm(prev => ({ ...prev, emailOrNumber: method }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitSuccess(false)

    if (!form.name || !form.email || !form.number || !form.comment) {
      setSubmitError('Пожалуйста, заполните все обязательные поля')
      return
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setSubmitError('Введите корректный email')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch(`${API_URL}/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Ошибка отправки заявки')
      }

      setSubmitSuccess(true)
      setForm({
        name: '',
        email: '',
        number: '',
        comment: '',
        emailOrNumber: 1,
      })
      setTimeout(() => setSubmitSuccess(false), 5000)

    } catch (err: any) {
      setSubmitError(err.message || 'Произошла ошибка. Попробуйте позже.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-cyan-500 rounded-xl flex items-center justify-center">
              <span className="font-bold text-xl">IS</span>
            </div>
            <span className="font-semibold text-2xl tracking-tight">Isait</span>
          </div>
          <div className="flex items-center gap-8 text-sm">
            <a href="#services" className="hover:text-cyan-400 transition-colors">Услуги</a>
            <a href="#form" className="hover:text-cyan-400 transition-colors">Оставить заявку</a>
          </div>
          <button 
            onClick={() => document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-2.5 bg-white text-zinc-950 rounded-2xl font-medium hover:bg-cyan-400 hover:text-white transition-all active:scale-[0.985]"
          >
            Оставить заявку
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-20 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 text-cyan-400 text-sm font-medium mb-6 tracking-wider">
          IT-РЕШЕНИЯ ПРЕМИУМ УРОВНЯ
        </div>
        <h1 className="text-7xl font-semibold tracking-tighter leading-none mb-6">
          Профессиональные<br />IT-решения для вашего бизнеса
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-white/70 mb-10">
          Разрабатываем современные веб-сервисы, автоматизируем процессы и помогаем компаниям расти с помощью технологий.
        </p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 rounded-3xl font-semibold text-lg transition-all active:scale-[0.985]"
          >
            Оставить заявку
          </button>
          <button 
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 border border-white/20 hover:bg-white/5 rounded-3xl font-semibold text-lg transition-all"
          >
            Посмотреть услуги
          </button>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-cyan-400 text-sm font-medium tracking-[3px] mb-2">ЧТО МЫ ДЕЛАЕМ</div>
            <h2 className="text-5xl font-semibold tracking-tight">Наши услуги</h2>
          </div>
        </div>

        {loadingServices ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse" />)}
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1">
                {service.imgLink && (
                  <div className="h-48 bg-zinc-900 overflow-hidden">
                    <img 
                      src={service.imgLink.startsWith('http') ? service.imgLink : `${API_URL}${service.imgLink}`} 
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-semibold mb-3 tracking-tight">{service.name}</h3>
                  <p className="text-white/70 leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-white/60">Услуги пока не добавлены.</div>
        )}
      </section>

      {/* === КРАСИВАЯ ФОРМА ЗАЯВКИ (BID) === */}
      <section id="form" className="bg-zinc-900 py-20 px-6 border-y border-white/10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-4">
              БЫСТРЫЙ СТАРТ
            </div>
            <h2 className="text-6xl font-semibold tracking-tighter mb-4">Оставить заявку</h2>
            <p className="text-xl text-white/70">Расскажите о задаче — мы свяжемся с вами в течение 1 часа</p>
          </div>

          {submitSuccess && (
            <div className="mb-8 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl text-center">
              <div className="text-emerald-400 text-5xl mb-3">✓</div>
              <div className="text-2xl font-semibold text-emerald-400 mb-1">Заявка успешно отправлена!</div>
              <p className="text-white/70">Наш менеджер свяжется с вами в ближайшее время.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-zinc-950 border border-white/10 rounded-3xl p-10 space-y-8">
            {/* Имя */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Ваше имя</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Иван Иванов"
                className="w-full bg-zinc-900 border border-white/10 focus:border-cyan-500 rounded-2xl px-6 py-4 text-lg placeholder:text-white/40 outline-none transition-all" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@company.com"
                  className="w-full bg-zinc-900 border border-white/10 focus:border-cyan-500 rounded-2xl px-6 py-4 text-lg placeholder:text-white/40 outline-none transition-all" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Телефон</label>
                <input type="tel" name="number" value={form.number} onChange={handleChange} placeholder="+7 (999) 123-45-67"
                  className="w-full bg-zinc-900 border border-white/10 focus:border-cyan-500 rounded-2xl px-6 py-4 text-lg placeholder:text-white/40 outline-none transition-all" required />
              </div>
            </div>

            {/* Способ связи */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-3">Предпочтительный способ связи</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => handleContactMethod(1)}
                  className={`flex-1 py-4 rounded-2xl border transition-all font-medium ${form.emailOrNumber === 1 ? 'bg-cyan-500 border-cyan-500' : 'border-white/20 hover:bg-white/5'}`}>
                  Email
                </button>
                <button type="button" onClick={() => handleContactMethod(0)}
                  className={`flex-1 py-4 rounded-2xl border transition-all font-medium ${form.emailOrNumber === 0 ? 'bg-cyan-500 border-cyan-500' : 'border-white/20 hover:bg-white/5'}`}>
                  Телефон
                </button>
              </div>
            </div>

            {/* Комментарий */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Расскажите о вашей задаче</label>
              <textarea name="comment" value={form.comment} onChange={handleChange} rows={6}
                placeholder="Нужен современный сайт для интернет-магазина, интеграция с 1С..."
                className="w-full bg-zinc-900 border border-white/10 focus:border-cyan-500 rounded-3xl px-6 py-5 text-lg placeholder:text-white/40 outline-none resize-y min-h-[140px] transition-all" required />
            </div>

            {submitError && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 px-5 py-3 rounded-2xl">{submitError}</div>}

            <button type="submit" disabled={submitting}
              className="w-full py-5 bg-white hover:bg-cyan-400 active:bg-cyan-500 disabled:bg-white/70 text-zinc-950 font-semibold text-xl rounded-3xl transition-all flex items-center justify-center gap-3 active:scale-[0.985]">
              {submitting ? (
                <> <div className="w-5 h-5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" /> Отправляем заявку... </>
              ) : 'Отправить заявку'}
            </button>

            <p className="text-center text-xs text-white/50">Мы отвечаем в течение 1 часа в рабочее время.</p>
          </form>
        </div>
      </section>

      <footer className="max-w-7xl mx-auto px-6 py-16 text-center text-white/60 text-sm">
        Isait • Профессиональные IT-решения © {new Date().getFullYear()}
      </footer>
    </div>
  )
}

export default App