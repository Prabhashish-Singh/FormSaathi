import { useState, useEffect } from 'react'
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  RotateCcw,
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  speak,
  pauseSpeech,
  resumeSpeech,
  stopSpeech,
  isSpeechSupported,
} from '../utils/speech'

export default function ReadAloud({ text = '', language = 'English' }) {
  const [playbackState, setPlaybackState] = useState('stopped') // 'playing' | 'paused' | 'stopped'
  const [rate, setRate] = useState(1)
  const isSupported = isSpeechSupported()

  // Clean up speech when component unmounts
  useEffect(() => {
    return () => {
      stopSpeech()
    }
  }, [])

  const handlePlayPause = () => {
    if (!text.trim()) {
      toast.error('No explanation text available to read aloud.')
      return
    }

    if (playbackState === 'playing') {
      pauseSpeech()
      setPlaybackState('paused')
    } else if (playbackState === 'paused') {
      resumeSpeech()
      setPlaybackState('playing')
    } else {
      setPlaybackState('playing')
      speak({
        text,
        language,
        rate,
        onStart: () => setPlaybackState('playing'),
        onEnd: () => setPlaybackState('stopped'),
        onError: (err) => {
          setPlaybackState('stopped')
          toast.error(err || 'Read Aloud encountered an issue.')
        },
      })
    }
  }

  const handleStop = () => {
    stopSpeech()
    setPlaybackState('stopped')
  }

  const handleRestart = () => {
    stopSpeech()
    setPlaybackState('playing')
    speak({
      text,
      language,
      rate,
      onStart: () => setPlaybackState('playing'),
      onEnd: () => setPlaybackState('stopped'),
      onError: () => setPlaybackState('stopped'),
    })
  }

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
        <VolumeX size={16} className="text-amber-600 flex-shrink-0" />
        <span>Read Aloud is not supported on this browser. Try Chrome, Edge, or Safari.</span>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-primary-200/80 bg-primary-50/50 p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Playback status indicator */}
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-2xl transition ${
              playbackState === 'playing'
                ? 'bg-primary-600 text-white shadow-green animate-pulse'
                : 'bg-primary-100 text-primary-700'
            }`}
          >
            <Volume2 size={20} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-primary-950">Read Aloud</span>
              {playbackState === 'playing' && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-600 animate-ping" />
                  Playing in {language}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {playbackState === 'playing'
                ? 'Reading the explanation aloud...'
                : playbackState === 'paused'
                ? 'Playback paused'
                : `Listen to this explanation in ${language}`}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Rate selector */}
          <div className="flex items-center gap-1 rounded-xl bg-white border border-primary-200 px-2.5 py-1 text-xs">
            <span className="text-gray-400 font-medium">Speed:</span>
            <select
              value={rate}
              onChange={(e) => {
                const nextRate = Number(e.target.value)
                setRate(nextRate)
                if (playbackState === 'playing') {
                  stopSpeech()
                  speak({
                    text,
                    language,
                    rate: nextRate,
                    onStart: () => setPlaybackState('playing'),
                    onEnd: () => setPlaybackState('stopped'),
                    onError: () => setPlaybackState('stopped'),
                  })
                }
              }}
              className="bg-transparent font-bold text-primary-800 focus:outline-none"
              aria-label="Speech rate"
            >
              <option value="0.75">0.75×</option>
              <option value="1">1×</option>
              <option value="1.25">1.25×</option>
              <option value="1.5">1.5×</option>
            </select>
          </div>

          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={handlePlayPause}
            className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-xs font-bold text-white shadow-green hover:bg-primary-700 transition"
            aria-label={playbackState === 'playing' ? 'Pause reading aloud' : 'Start reading aloud'}
          >
            {playbackState === 'playing' ? <Pause size={14} /> : <Play size={14} />}
            <span>
              {playbackState === 'playing'
                ? 'Pause'
                : playbackState === 'paused'
                ? 'Resume'
                : 'Listen Now'}
            </span>
          </button>

          {/* Stop Button */}
          {playbackState !== 'stopped' && (
            <button
              type="button"
              onClick={handleStop}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
              title="Stop playback"
              aria-label="Stop reading aloud"
            >
              <Square size={13} />
            </button>
          )}

          {/* Restart Button */}
          {playbackState !== 'stopped' && (
            <button
              type="button"
              onClick={handleRestart}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-primary-50 hover:text-primary-700 transition"
              title="Restart reading aloud"
              aria-label="Restart reading aloud"
            >
              <RotateCcw size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
