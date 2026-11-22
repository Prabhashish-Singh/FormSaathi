import { Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Logo({ compact = false, light = false }) {
  const textColor = light ? 'text-white' : 'text-primary-800'
  const subColor = light ? 'text-green-200' : 'text-sage-500'

  return (
    <Link to="/" className="flex items-center gap-2.5 select-none group" aria-label="FormSaathi Home">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 shadow-green group-hover:bg-primary-700 transition">
        <Leaf size={18} className="text-white" />
      </div>
      {!compact && (
        <div>
          <span className={`font-heading text-xl font-bold ${textColor} leading-none`}>
            Form<span className="text-primary-600">Saathi</span>
          </span>
          {!compact && (
            <p className={`text-[10px] font-medium ${subColor} leading-none mt-0.5`}>
              Document Made Simple
            </p>
          )}
        </div>
      )}
    </Link>
  )
}
