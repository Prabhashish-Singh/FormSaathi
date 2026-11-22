import { Link } from 'react-router-dom'
import useAuth from '../context/useAuth'
import {
  Upload,
  Languages,
  FileText,
  MessageSquare,
  Volume2,
  ArrowRight,
  CheckCircle2,
  Shield,
  Users,
  Zap,
  Globe,
  Leaf,
  Star,
  CheckSquare,
} from 'lucide-react'

const FEATURES = [
  {
    icon: FileText,
    title: 'Upload Any Document',
    desc: 'PDF, JPG, JPEG, and PNG files supported. Government forms, notices, certificates — all accepted.',
    color: 'bg-primary-50 text-primary-600',
  },
  {
    icon: Languages,
    title: 'Multilingual Explanation',
    desc: 'Get plain-language explanations in English, Hindi, Punjabi, Bengali, and 12 Indian languages.',
    color: 'bg-gold-50 text-gold-700',
  },
  {
    icon: MessageSquare,
    title: 'Ask Questions',
    desc: 'Have an interactive conversation with FormSaathi AI about your document — in your language.',
    color: 'bg-sage-50 text-sage-700',
  },
  {
    icon: Volume2,
    title: 'Read Aloud',
    desc: 'Listen to the AI explanation read aloud in your mother tongue. Helpful for elderly and low-literacy users.',
    color: 'bg-primary-50 text-primary-700',
  },
  {
    icon: CheckSquare,
    title: 'Action Checklist',
    desc: 'Get an interactive step-by-step checklist of what you need to do, with progress tracking.',
    color: 'bg-gold-50 text-gold-700',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    desc: 'Your documents are processed securely with AI and never stored permanently or shared.',
    color: 'bg-sage-50 text-sage-700',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: '1. Upload your document',
    desc: 'Upload a PDF, JPG, or PNG of any official document — government circular, legal notice, scheme guideline, or certificate.',
  },
  {
    step: '02',
    title: '2. Choose your language',
    desc: 'Select your preferred language for OCR detection and output explanation from 12 supported Indian languages.',
  },
  {
    step: '03',
    title: '3. Understand your document',
    desc: 'Receive a plain-language summary, key deadlines, financial amounts, interactive action checklist, and read aloud.',
  },
]

const SUPPORTED_LANGUAGES = [
  { name: 'English', script: 'English' },
  { name: 'Hindi', script: 'हिंदी' },
  { name: 'Punjabi', script: 'ਪੰਜਾਬੀ' },
  { name: 'Bengali', script: 'বাংলা' },
  { name: 'Gujarati', script: 'ગુજરાતી' },
  { name: 'Marathi', script: 'मराठी' },
  { name: 'Tamil', script: 'தமிழ்' },
  { name: 'Telugu', script: 'తెలుగు' },
  { name: 'Kannada', script: 'ಕನ್ನಡ' },
  { name: 'Malayalam', script: 'മലയാളം' },
  { name: 'Odia', script: 'ଓଡ଼ିଆ' },
  { name: 'Urdu', script: 'اردو' },
]

export default function Home() {
  const { user } = useAuth()
  const uploadPath = user ? '/app/upload' : '/login'

  return (
    <div className="bg-canvas">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-28 hero-gradient">
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute top-0 left-1/4 h-80 w-80 rounded-full bg-primary-100/50 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-sage-100/50 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-primary-200 rounded-full px-4 py-1.5 text-xs font-bold text-primary-800 shadow-sm mb-6 animate-fade-in">
            <Leaf size={14} className="text-primary-600" />
            <span>FormSaathi • AI-Powered Multilingual Document Accessibility</span>
            <Star size={12} className="text-gold-500" fill="currentColor" />
          </div>

          {/* Heading */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-950 leading-tight animate-slide-up">
            Understand Every Document.
            <br />
            <span className="text-primary-600">In Every Language.</span>
          </h1>

          {/* Supporting Text */}
          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-gray-600 leading-relaxed animate-fade-in">
            FormSaathi helps you upload important official documents, understand their contents in
            simple language, identify important dates and amounts, generate action checklists, and
            ask questions — in 12 Indian languages.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 animate-fade-in">
            <Link
              to={uploadPath}
              className="flex items-center gap-2.5 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl text-base font-bold transition shadow-green hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto justify-center"
            >
              <Upload size={18} />
              <span>Upload Your Document</span>
              <ArrowRight size={18} />
            </Link>

            {!user && (
              <Link
                to="/signup"
                className="flex items-center gap-2 bg-white border border-primary-200 text-primary-800 hover:bg-primary-50 px-8 py-4 rounded-2xl text-base font-bold transition w-full sm:w-auto justify-center shadow-sm"
              >
                <span>Create Account</span>
              </Link>
            )}

            <a
              href="#features"
              className="flex items-center gap-2 bg-white border border-primary-200 text-primary-800 hover:bg-primary-50 px-8 py-4 rounded-2xl text-base font-bold transition w-full sm:w-auto justify-center shadow-sm"
            >
              <Zap size={18} className="text-primary-600" />
              <span>Explore Features</span>
            </a>
          </div>

          {/* Highlights */}
          <div className="mt-10 flex flex-wrap justify-center gap-5 sm:gap-8 text-xs sm:text-sm text-gray-500 animate-fade-in">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={16} className="text-primary-600" />
              Accessible to all literacy levels
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Volume2 size={16} className="text-primary-600" />
              Read Aloud audio playback
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Shield size={16} className="text-primary-600" />
              Private & secure
            </span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="badge-green mb-3">Simple 3-Step Process</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-primary-950 mt-2">
              How It Works
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
              Three simple steps to understand any complex document clearly and thoroughly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div
                key={step}
                className="relative rounded-3xl bg-canvas border border-primary-100 p-8 text-center hover:shadow-card-hover transition"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white font-extrabold text-lg mx-auto mb-5 shadow-green">
                  {step}
                </div>
                <h3 className="font-heading text-base font-bold text-primary-950 mb-3">{title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to={uploadPath}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-7 py-3.5 rounded-2xl text-sm font-bold shadow-green transition"
            >
              <Upload size={16} />
              <span>Get Started — Upload Document</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="badge-green mb-3">Capabilities</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-primary-950 mt-2">
              Features Built for Every Citizen
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
              Designed to make document comprehension natural, friendly, and accessible.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card-green p-6 sm:p-7">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color} mb-4`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-heading text-base font-bold text-primary-950 mb-2">{title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Indian Languages Section */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3.5 py-1 text-xs font-semibold mb-3">
              <Globe size={13} className="text-white" />
              <span>Multilingual Inclusion</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Supported Indian Languages
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-primary-100 max-w-md mx-auto">
              Understand notices and documents in the script and tongue you speak at home.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {SUPPORTED_LANGUAGES.map(({ name, script }) => (
              <div
                key={name}
                className="flex flex-col items-center gap-1 rounded-2xl bg-white/10 border border-white/15 p-3.5 text-center transition hover:bg-white/20"
              >
                <span className="text-base sm:text-lg font-bold text-white">{script}</span>
                <span className="text-xs text-primary-200">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accessibility Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <span className="badge-green mb-4">Universal Accessibility</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-primary-950 mt-2">
                Designed for True Accessibility
              </h2>
              <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                FormSaathi is not only for visually impaired users. It is thoughtfully engineered for:
              </p>

              <div className="mt-6 space-y-3">
                {[
                  'People who struggle with complex legal and official jargon',
                  'Citizens who cannot read or understand English documents',
                  'People with limited literacy who benefit from Read Aloud audio',
                  'Elderly citizens needing larger text, high contrast, and simple controls',
                  'Anyone needing quick clarity, checklists, and deadline reminders',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                    <CheckCircle2 size={16} className="text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-4">
                <Link
                  to={user ? '/app/accessibility' : '/login'}
                  className="inline-flex items-center gap-2 rounded-xl border border-primary-200 px-4 py-2.5 text-xs font-bold text-primary-800 hover:bg-primary-50 transition"
                >
                  <span>Explore Accessibility Options</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="mt-10 lg:mt-0 grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: 'Elderly Users', desc: 'Large touch buttons & clear labels' },
                { icon: Volume2, label: 'Limited Literacy', desc: 'Browser Read Aloud in mother tongue' },
                { icon: Globe, label: 'Multilingual Citizens', desc: '12 regional Indian languages' },
                { icon: Shield, label: 'Security & Privacy', desc: 'Encrypted and privacy-first AI' },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-primary-100 bg-canvas p-5 hover:border-primary-300 transition"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700 mb-3">
                    <Icon size={20} />
                  </div>
                  <h4 className="font-heading text-sm font-bold text-primary-950">{label}</h4>
                  <p className="mt-1 text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-16 bg-green-gradient text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Leaf size={36} className="text-white/60 mx-auto mb-4" />
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Understand Your Document Today
          </h2>
          <p className="text-primary-100 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Upload any government notice, certificate, or official circular and get an easy-to-read
            explanation in seconds.
          </p>
          <Link
            to={uploadPath}
            className="inline-flex items-center gap-2.5 rounded-2xl bg-white text-primary-800 hover:bg-primary-50 px-8 py-4 text-base font-bold shadow-lg transition hover:-translate-y-0.5"
          >
            <Upload size={18} />
            <span>Upload Your Document Now</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
