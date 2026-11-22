import { Link } from 'react-router-dom'
import { Upload, Languages, Sparkles, Volume2, CheckSquare, ArrowRight } from 'lucide-react'

const STEPS = [
  {
    num: '01',
    icon: Upload,
    title: 'Upload Your Document',
    desc: 'Start by uploading any official document. We support PDF, JPG, JPEG and PNG files up to 10 MB. You can drag & drop or browse from your device.',
    details: ['Government notices and circulars', 'Official letters and certificates', 'Financial statements and bills', 'Medical forms and reports', 'Educational documents'],
  },
  {
    num: '02',
    icon: Languages,
    title: 'Choose Your Language',
    desc: 'Select the language you want the explanation in and the level of detail you need. We support English, Hindi, Punjabi and more.',
    details: ['12 Indian languages supported', 'Very Simple, Simple or Detailed explanation', 'Auto-detect document category', 'Multilingual AI processing'],
  },
  {
    num: '03',
    icon: Sparkles,
    title: 'AI Processes the Document',
    desc: 'Our AI reads the document using OCR technology, extracts the text, and uses Google Gemini to analyze and understand the content.',
    details: ['OCR text extraction from images and PDFs', 'AI-powered language analysis', 'Key information identification', 'Action item generation'],
  },
  {
    num: '04',
    icon: CheckSquare,
    title: 'Get Clear Results',
    desc: 'View a comprehensive results page with the document explained in simple language, key information highlighted, and an interactive checklist.',
    details: ['Simple explanation in your language', 'Important dates and deadlines', 'Required documents list', 'Interactive action checklist'],
  },
  {
    num: '05',
    icon: Volume2,
    title: 'Read Aloud & Ask Questions',
    desc: 'Have the explanation read aloud in your selected language, or ask the AI specific questions about the document using our chat interface.',
    details: ['Browser-based speech synthesis', 'Adjustable playback speed', 'Conversational AI Q&A', 'Multi-turn conversation history'],
  },
]

export default function HowItWorks() {
  return (
    <div className="bg-canvas">
      {/* Hero */}
      <section className="pt-16 pb-20 hero-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="badge-green mb-4">How It Works</span>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-primary-900 mt-3">
            From Upload to Understanding
          </h1>
          <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            FormSaathi walks you through five simple steps to turn any confusing document into something you can easily understand and act on.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="space-y-12">
            {STEPS.map(({ num, icon: Icon, title, desc, details }, i) => (
              <div key={num} className={`flex gap-6 sm:gap-10 ${i % 2 === 1 ? 'sm:flex-row-reverse' : ''}`}>
                {/* Number */}
                <div className="flex-shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-white font-extrabold text-xl shadow-green">
                    {num}
                  </div>
                </div>
                {/* Content */}
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
                      <Icon size={20} className="text-primary-600" />
                    </div>
                    <h2 className="font-heading text-xl font-bold text-primary-900">{title}</h2>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">{desc}</p>
                  <ul className="space-y-1.5">
                    {details.map((d) => (
                      <li key={d} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-gradient">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-extrabold text-white mb-4">Ready to Try It?</h2>
          <p className="text-primary-100 mb-8">Upload any document and get a clear explanation in seconds.</p>
          <Link to="/app/upload" className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 px-7 py-3.5 rounded-xl text-sm font-bold transition shadow-lg">
            <Upload size={16} /> Upload Your Document <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
