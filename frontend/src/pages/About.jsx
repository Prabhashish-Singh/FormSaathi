import { Link } from 'react-router-dom'
import { Upload, Users, Leaf, ArrowRight, Shield, Globe, BookOpen } from 'lucide-react'

export default function About() {
  return (
    <div className="bg-canvas">
      {/* Hero */}
      <section className="pt-16 pb-20 hero-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="badge-green mb-4">About Us</span>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-primary-900 mt-3 leading-tight">
            Making Documents Accessible<br />to Every Indian
          </h1>
          <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            FormSaathi was built with one mission: to remove the language and literacy barriers that prevent millions of Indians from understanding their own rights, benefits, and obligations.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl font-extrabold text-primary-900 mb-5">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Every year, millions of Indians miss out on government schemes, benefits, and legal rights simply because official documents are written in complex English or formal Hindi that is difficult to understand.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                FormSaathi uses AI to bridge this gap — translating complex official language into simple, plain words in the user's preferred language.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We believe that every person — regardless of their literacy level, language background, or technical ability — deserves to understand documents that affect their lives.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: 'For Everyone', desc: 'Farmers, students, senior citizens, and anyone who needs help.' },
                { icon: Globe, label: '12 Languages', desc: 'Hindi, Punjabi, Bengali, Tamil, Telugu and more.' },
                { icon: Shield, label: 'Privacy First', desc: 'Documents processed securely, never permanently stored.' },
                { icon: BookOpen, label: 'AI Powered', desc: 'Google Gemini AI for intelligent, accurate explanations.' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="p-4 rounded-2xl bg-primary-50 border border-primary-100">
                  <Icon size={22} className="text-primary-600 mb-2" />
                  <h4 className="font-semibold text-primary-800 text-sm">{label}</h4>
                  <p className="text-xs text-gray-600 mt-1">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-canvas">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-extrabold text-primary-900">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { emoji: '🌱', title: 'Accessibility', desc: 'Technology should work for everyone, including the elderly, rural citizens, and people with disabilities.' },
              { emoji: '🤝', title: 'Trust', desc: 'We handle your documents with care, transparency, and respect for your privacy.' },
              { emoji: '🌍', title: 'Inclusion', desc: 'No Indian should be left behind due to language barriers. We serve all communities equally.' },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="card-green p-6 text-center">
                <span className="text-4xl">{emoji}</span>
                <h3 className="font-heading text-lg font-bold text-primary-800 mt-3 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-gradient">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Leaf size={36} className="text-white/60 mx-auto mb-5" />
          <h2 className="font-heading text-3xl font-extrabold text-white mb-4">Ready to Understand Your Document?</h2>
          <p className="text-primary-100 mb-8">Start for free — no sign up required for your first document.</p>
          <Link to="/app/upload" className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 px-7 py-3.5 rounded-xl text-sm font-bold transition shadow-lg">
            <Upload size={16} /> Upload Document <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
