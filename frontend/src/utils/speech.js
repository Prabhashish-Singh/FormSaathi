/**
 * FormSaathi Speech Utility
 * Uses Browser SpeechSynthesis API for Read Aloud functionality
 */

const LANGUAGE_BCP47 = {
  English: 'en-IN',
  Hindi: 'hi-IN',
  Punjabi: 'pa-IN',
  Bengali: 'bn-IN',
  Gujarati: 'gu-IN',
  Marathi: 'mr-IN',
  Tamil: 'ta-IN',
  Telugu: 'te-IN',
  Kannada: 'kn-IN',
  Malayalam: 'ml-IN',
  Odia: 'or-IN',
  Urdu: 'ur-PK',
}

export function isSpeechRecognitionSupported() {
  return typeof window !== 'undefined'
    && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
}

export function detectTextLanguage(text) {
  if (!text) return 'English'
  if (/[\u0A66-\u0A6F\u0A00-\u0A7F]/.test(text)) return 'Punjabi'
  if (/[\u0900-\u097F]/.test(text)) return 'Hindi'
  if (/[\u0980-\u09FF]/.test(text)) return 'Bengali'
  if (/[\u0A80-\u0AFF]/.test(text)) return 'Gujarati'
  if (/[\u0C80-\u0CFF]/.test(text)) return 'Kannada'
  if (/[\u0D00-\u0D7F]/.test(text)) return 'Malayalam'
  if (/[\u0B80-\u0BFF]/.test(text)) return 'Tamil'
  if (/[\u0C00-\u0C7F]/.test(text)) return 'Telugu'
  if (/[\u0B00-\u0B7F]/.test(text)) return 'Odia'
  if (/[\u0600-\u06FF]/.test(text)) return 'Urdu'
  return 'English'
}

export function createSpeechRecognition({ preferredLanguage = '', onStart, onResult, onError, onEnd } = {}) {
  if (!isSpeechRecognitionSupported()) return null

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const recognition = new SpeechRecognition()
  recognition.continuous = false
  recognition.interimResults = true
  recognition.maxAlternatives = 1

  if (preferredLanguage) {
    recognition.lang = LANGUAGE_BCP47[preferredLanguage] || preferredLanguage
  }

  recognition.onstart = onStart || null
  recognition.onresult = (event) => {
    let transcript = ''
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      transcript += event.results[index][0].transcript
    }
    onResult?.({
      transcript: transcript.trim(),
      isFinal: event.results[event.results.length - 1]?.isFinal || false,
    })
  }
  recognition.onerror = (event) => onError?.(event.error)
  recognition.onend = onEnd || null
  return recognition
}

export function isSpeechSupported() {
  return 'speechSynthesis' in window
}

export function getVoicesForLanguage(languageName) {
  if (!isSpeechSupported()) return []
  const bcp47 = LANGUAGE_BCP47[languageName] || 'en-IN'
  const primary = bcp47.split('-')[0]
  const all = window.speechSynthesis.getVoices()
  const exact = all.filter((v) => v.lang === bcp47)
  if (exact.length) return exact
  const partial = all.filter((v) => v.lang.startsWith(primary))
  if (partial.length) return partial
  // Fallback: English voices
  return all.filter((v) => v.lang.startsWith('en'))
}

export function cleanTextForSpeech(text) {
  if (!text) return ''
  return text
    .replace(/#{1,6}\s+/g, '') // Remove markdown headings
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
    .replace(/\*(.*?)\*/g, '$1') // Remove italic markers
    .replace(/`(.*?)`/g, '$1') // Remove code markers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .replace(/^[-*+]\s+/gm, '') // Remove list bullets
    .replace(/^\d+\.\s+/gm, '') // Remove numbered list markers
    .replace(/\n{3,}/g, '\n\n') // Normalize whitespace
    .trim()
}


export function speak({ text, language = 'English', rate = 1, pitch = 1, onStart, onEnd, onError, onBoundary }) {
  if (!isSpeechSupported()) {
    onError?.('Your browser does not support Read Aloud. Please try Chrome or Edge.')
    return null
  }

  window.speechSynthesis.cancel()


  const clean = cleanTextForSpeech(text)
  if (!clean) {
    onError?.('No text available to read aloud.')
    return null
  }

  const utterance = new SpeechSynthesisUtterance(clean)
  utterance.rate = Math.max(0.5, Math.min(2, rate))
  utterance.pitch = Math.max(0.5, Math.min(2, pitch))
  utterance.volume = 1

  // Set voice/language
  const voices = getVoicesForLanguage(language)
  if (voices.length) {
    utterance.voice = voices[0]
    utterance.lang = voices[0].lang
  } else {
    utterance.lang = LANGUAGE_BCP47[language] || 'en-IN'
  }

  utterance.onstart = onStart || null
  utterance.onend = onEnd || null
  utterance.onerror = (e) => {
    if (e.error !== 'interrupted') {
      onError?.(`Read Aloud error: ${e.error}`)
    }
  }
  utterance.onboundary = onBoundary || null

  window.speechSynthesis.speak(utterance)
  return utterance
}

export function pauseSpeech() {
  if (isSpeechSupported()) window.speechSynthesis.pause()
}

export function resumeSpeech() {
  if (isSpeechSupported()) window.speechSynthesis.resume()
}

export function stopSpeech() {
  if (isSpeechSupported()) window.speechSynthesis.cancel()
}

export function isSpeaking() {
  return isSpeechSupported() && window.speechSynthesis.speaking
}

export function isPaused() {
  return isSpeechSupported() && window.speechSynthesis.paused
}

// Wait for voices to load (they load asynchronously in some browsers)
export function waitForVoices() {
  return new Promise((resolve) => {
    if (!isSpeechSupported()) { resolve([]); return }
    const voices = window.speechSynthesis.getVoices()
    if (voices.length) { resolve(voices); return }
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      resolve(window.speechSynthesis.getVoices())
    }, { once: true })
  })
}
