import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AccessibilityContext = createContext(null)
const defaults = {
  textSize: 'normal', // 'normal' | 'large' | 'xl-access'
  highContrast: false,
  darkMode: false,
  reduceMotion: false,
  readAloud: true,
  speechRate: 1,
  language: 'English',
}

export function AccessibilityProvider({ children }) {
  const [preferences, setPreferences] = useState(() => {
    try {
      return { ...defaults, ...JSON.parse(localStorage.getItem('formsaathi-a11y') || '{}') }
    } catch {
      return defaults
    }
  })

  useEffect(() => {
    localStorage.setItem('formsaathi-a11y', JSON.stringify(preferences))
  }, [preferences])

  const updatePreference = (key, value) => {
    setPreferences((current) => ({ ...current, [key]: value }))
  }

  const isRTL = preferences.language === 'Urdu'

  const value = useMemo(
    () => ({ preferences, updatePreference, isRTL }),
    [preferences, isRTL]
  )

  return (
    <AccessibilityContext.Provider value={value}>
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`min-h-screen ${preferences.darkMode ? 'dark-app' : ''} ${
          preferences.highContrast ? 'high-contrast' : ''
        } ${preferences.reduceMotion ? 'reduce-motion' : ''} ${
          preferences.textSize === 'large'
            ? 'text-large'
            : preferences.textSize === 'xl-access'
            ? 'text-xl-access'
            : ''
        }`}
      >
        {children}
      </div>
    </AccessibilityContext.Provider>
  )
}

export const useAccessibility = () => useContext(AccessibilityContext)
