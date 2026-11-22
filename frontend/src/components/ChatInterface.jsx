import { useState, useRef, useEffect } from 'react'
import {
  Send,
  Trash2,
  Bot,
  User,
  Loader2,
  HelpCircle,
  Mic,
  MicOff,
  Volume2,
  Pause,
  Square,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { api, askQuestion } from '../services/api'
import {
  createSpeechRecognition,
  detectTextLanguage,
  isSpeechRecognitionSupported,
  isSpeechSupported,
  pauseSpeech,
  resumeSpeech,
  speak,
  stopSpeech,
} from '../utils/speech'

const DEFAULT_SUGGESTIONS = [
  'What is the main objective of this document?',
  'Am I eligible according to this notice?',
  'What is the last date to apply or submit?',
  'Which documents do I need to prepare?',
  'Are there any penalties or missing requirements?',
  'What financial benefits are mentioned?',
]

export default function ChatInterface({
  documentText = '',
  outputLanguage = 'English',
  documentTitle = 'Current Document',
  documentId = null,
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Namaste! 🙏 I am your FormSaathi AI Document Assistant. You can ask me any question about "${documentTitle}" in ${outputLanguage} or any language you prefer.`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceStatus, setVoiceStatus] = useState('')
  const [playingMessageId, setPlayingMessageId] = useState(null)
  const [playbackPaused, setPlaybackPaused] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)
  const voiceBaseTextRef = useRef('')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort()
      stopSpeech()
    }
  }, [])

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    } else {
      setIsListening(false)
      setVoiceStatus('')
    }
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
      return
    }

    if (!isSpeechRecognitionSupported()) {
      setVoiceStatus('')
      toast.error('Voice input is not supported in this browser. You can still type your question.')
      return
    }

    if (!window.isSecureContext) {
      setVoiceStatus('')
      toast.error('Microphone access requires a secure connection (HTTPS or localhost).')
      return
    }

    voiceBaseTextRef.current = input
    const recognition = createSpeechRecognition({
      onStart: () => {
        setIsListening(true)
        setVoiceStatus('Listening...')
      },
      onResult: ({ transcript, isFinal }) => {
        const base = voiceBaseTextRef.current
        const separator = base && transcript ? ' ' : ''
        setInput(`${base}${separator}${transcript}`)
        setVoiceStatus(isFinal ? 'Processing...' : 'Listening...')
      },
      onError: (error) => {
        setIsListening(false)
        setVoiceStatus('')
        if (error === 'not-allowed' || error === 'service-not-allowed') {
          toast.error('Microphone permission was denied. Enable it in your browser settings.')
        } else if (error === 'no-speech') {
          toast.error('No speech was detected. Please try again.')
        } else if (error === 'audio-capture') {
          toast.error('No microphone was found. Check your audio input device.')
        } else if (error === 'network') {
          toast.error('Speech recognition could not reach the browser service.')
        } else {
          toast.error('Voice recognition stopped unexpectedly. Please try again.')
        }
      },
      onEnd: () => {
        setIsListening(false)
        setVoiceStatus('')
      },
    })

    recognitionRef.current = recognition
    if (!recognition) {
      toast.error('Voice input is unavailable in this browser.')
      return
    }

    try {
      recognition.start()
    } catch {
      recognition.abort()
      setIsListening(false)
      setVoiceStatus('')
      toast.error('Could not start the microphone. Please try again.')
    }
  }

  const toggleMessagePlayback = (messageId, text, language) => {
    if (!isSpeechSupported()) {
      toast.error('Voice playback is not supported in this browser.')
      return
    }

    if (playingMessageId === messageId) {
      if (playbackPaused) {
        resumeSpeech()
        setPlaybackPaused(false)
      } else {
        pauseSpeech()
        setPlaybackPaused(true)
      }
      return
    }

    stopSpeech()
    setPlayingMessageId(messageId)
    setPlaybackPaused(false)
    speak({
      text,
      language,
      onStart: () => setPlaybackPaused(false),
      onEnd: () => {
        setPlayingMessageId(null)
        setPlaybackPaused(false)
      },
      onError: (error) => {
        setPlayingMessageId(null)
        setPlaybackPaused(false)
        toast.error(error || 'Could not play this response aloud.')
      },
    })
  }

  const stopMessagePlayback = () => {
    stopSpeech()
    setPlayingMessageId(null)
    setPlaybackPaused(false)
  }

  const handleSend = async (questionText = input) => {
    const textToSend = typeof questionText === 'string' ? questionText.trim() : input.trim()
    if (!textToSend || loading) return

    if (!documentText) {
      toast.error('No document text is available for Q&A. Please upload a document first.')
      return
    }

    // Build history for backend API (role, content)
    const history = messages.map((m) => ({
      role: m.role,
      content: m.content || m.text || '',
    }))

    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: textToSend }])
    setLoading(true)

    try {
      let response
      if (documentId) {
        response = await api.post(`/documents/${documentId}/ask`, {
          document_text: documentText,
          question: textToSend,
          output_language: outputLanguage,
          conversation_history: history,
        }).then((result) => result.data)
      } else {
        response = await askQuestion({
          document_text: documentText,
          question: textToSend,
          output_language: outputLanguage,
          conversation_history: history,
        })
      }

      const answerText = response.answer || response.data?.answer || 'No answer returned.'
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: answerText,
          language: detectTextLanguage(answerText),
        },
      ])
    } catch (err) {
      toast.error(err.message || 'Could not fetch an answer.')
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `I encountered an error answering your question: ${
            err.message || 'Please check your connection and try again.'
          }`,
        },
      ])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleClear = async () => {
    try {
      stopSpeech()
      setPlayingMessageId(null)
      setPlaybackPaused(false)
      if (documentId) {
        await api.delete(`/documents/${documentId}/conversation`)
      }
      setMessages([
        {
          role: 'assistant',
          content: `Chat history cleared. What else would you like to know about "${documentTitle}"?`,
        },
      ])
      toast.success('Chat cleared')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Could not clear chat history.')
    }
  }

  return (
    <div className="flex flex-col rounded-3xl border border-primary-100 bg-white shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-canvas px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="font-heading text-sm font-bold text-primary-950">Ask FormSaathi</h3>
            <p className="text-[11px] text-gray-500">
              Interactive Q&A • Answering in {outputLanguage}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClear}
          className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition"
          aria-label="Clear chat conversation"
        >
          <Trash2 size={13} />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Suggested Questions */}
      <div className="border-b border-gray-100 bg-primary-50/40 p-4">
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary-900 mb-2">
          <HelpCircle size={13} className="text-primary-600" />
          <span>Suggested Questions:</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {DEFAULT_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              disabled={loading}
              onClick={() => handleSend(suggestion)}
              className="rounded-full border border-primary-200 bg-white px-3 py-1 text-xs font-medium text-primary-800 hover:border-primary-400 hover:bg-primary-50 transition disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-canvas/30"
        style={{ minHeight: '360px', maxHeight: '520px' }}
        aria-live="polite"
        role="log"
      >
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user'
          const messageId = msg.id || `message-${index}`
          const isPlaying = playingMessageId === messageId
          return (
            <div
              key={index}
              className={`flex gap-3 animate-fade-in ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-xs ${
                  isUser
                    ? 'bg-primary-600 text-white font-bold'
                    : 'bg-primary-100 text-primary-700'
                }`}
              >
                {isUser ? <User size={15} /> : <Bot size={15} />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-primary-600 text-white rounded-br-xs shadow-sm'
                    : `bg-white border text-gray-800 rounded-bl-xs shadow-sm ${
                        isPlaying ? 'border-primary-500 ring-2 ring-primary-100' : 'border-primary-100'
                      }`
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {!isUser && msg.content && (
                  <div className="mt-2 flex items-center justify-end gap-1.5 border-t border-primary-100/70 pt-2">
                    <button
                      type="button"
                      onClick={() => toggleMessagePlayback(
                        messageId,
                        msg.content,
                        msg.language || detectTextLanguage(msg.content),
                      )}
                      className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-bold transition ${
                        isPlaying
                          ? 'bg-primary-100 text-primary-800'
                          : 'text-gray-500 hover:bg-primary-50 hover:text-primary-700'
                      }`}
                      aria-label={isPlaying ? (playbackPaused ? 'Resume response' : 'Pause response') : 'Play response aloud'}
                    >
                      {isPlaying ? (
                        playbackPaused ? <Volume2 size={14} /> : <Pause size={14} />
                      ) : (
                        <Volume2 size={14} />
                      )}
                      <span>{isPlaying ? (playbackPaused ? 'Resume' : 'Pause') : 'Listen'}</span>
                    </button>
                    {isPlaying && (
                      <button
                        type="button"
                        onClick={stopMessagePlayback}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition"
                        aria-label="Stop response playback"
                      >
                        <Square size={13} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Loading / Typing indicator */}
        {loading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
              <Bot size={15} />
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white border border-primary-100 px-4 py-3 shadow-sm">
              <Loader2 size={16} className="text-primary-600 animate-spin" />
              <span className="text-xs text-gray-500 font-medium">FormSaathi is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-100 bg-white p-4">
        {(isListening || voiceStatus) && (
          <div
            className="mb-3 flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
            aria-live="polite"
          >
            {isListening && (
              <span className="flex h-5 items-end gap-0.5" aria-hidden="true">
                <span className="h-2 w-1 animate-pulse rounded-full bg-red-500" />
                <span className="h-4 w-1 animate-pulse rounded-full bg-red-500 [animation-delay:100ms]" />
                <span className="h-3 w-1 animate-pulse rounded-full bg-red-500 [animation-delay:200ms]" />
              </span>
            )}
            <span>{voiceStatus || 'Listening...'}</span>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder={`Ask any question about this document in ${outputLanguage}...`}
            className="flex-1 rounded-2xl border border-gray-200 bg-canvas px-4 py-3 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:border-primary-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100 transition disabled:opacity-50"
            aria-label="Ask a question about the document"
          />

          <button
            type="button"
            onClick={toggleListening}
            disabled={loading}
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border transition ${
              isListening
                ? 'border-red-300 bg-red-50 text-red-600'
                : 'border-primary-200 bg-white text-primary-700 hover:bg-primary-50'
            } disabled:opacity-50`}
            aria-label={isListening ? 'Stop voice recording' : 'Start voice recording'}
            title={isListening ? 'Stop recording' : 'Speak your question'}
          >
            {isListening ? <MicOff size={17} /> : <Mic size={17} />}
          </button>

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-green hover:bg-primary-700 transition disabled:opacity-50"
            aria-label="Send question"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </form>

        <p className="mt-2 text-[11px] text-gray-400 text-center">
          Answers are generated directly from the uploaded document using AI.
        </p>
      </div>
    </div>
  )
}
