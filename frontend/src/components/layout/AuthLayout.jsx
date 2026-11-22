import { Outlet } from 'react-router-dom'
import { FileText, Languages, ShieldCheck, Sparkles, Leaf, CheckCircle2 } from 'lucide-react'
import Logo from '../common/Logo'

const FEATURES = [
  { icon: FileText, text: 'Upload PDF, JPG, PNG documents' },
  { icon: Languages, text: '12 Indian languages supported' },
  { icon: ShieldCheck, text: 'Private & secure processing' },
  { icon: CheckCircle2, text: 'AI-powered simple explanations' },
]

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-canvas lg:grid lg:grid-cols-2">
      {/* Left hero branding */}
      <aside className="relative hidden min-h-screen overflow-hidden bg-green-gradient px-10 py-12 lg:flex lg:flex-col lg:justify-between xl:px-16">
        {/* Decorative circles */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-48 -left-32 h-[30rem] w-[30rem] rounded-full bg-white/5 blur-3xl" aria-hidden="true" />

        <div className="relative z-10">
          <Logo light />
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
            <Sparkles size={28} className="text-yellow-300" />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-green-100 mb-5">
            <Leaf size={12} className="text-green-300" />
            <span>AI Document Accessibility for All Indians</span>
          </div>

          <h1 className="font-heading text-4xl font-extrabold leading-tight xl:text-5xl text-white">
            Every Document,
            <br />
            <span className="text-yellow-300">Every Language.</span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-green-100">
            Upload any official document — government notices, forms, certificates — and understand them instantly in simple language, any Indian language.
          </p>

          <div className="mt-8 space-y-3">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-green-100">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15">
                  <Icon size={14} className="text-white" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-green-300">
          © 2026 FormSaathi · Democratizing document access for every Indian citizen.
        </p>
      </aside>

      {/* Main form area */}
      <main className="flex min-h-screen flex-col px-5 py-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between lg:justify-end">
          <div className="lg:hidden">
            <Logo />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>

        <p className="pb-2 text-center text-xs leading-5 text-gray-400">
          🔒 Your documents and data are secure and never shared.
        </p>
      </main>
    </div>
  )
}
