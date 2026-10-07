let selectedVoice = null

const loadVoice = () => {
  const voices = window.speechSynthesis.getVoices()

  if (!voices.length) return null

  const maleVoiceNames = [
    'Google US English Male',
    'Microsoft Guy Online (Natural) - English (United States)',
    'Microsoft Christopher Online (Natural) - English (United States)',
    'Microsoft Eric Online (Natural) - English (United States)',
    'Alex',
    'Daniel',
    'Fred',
  ]

  selectedVoice =
    voices.find((voice) =>
      maleVoiceNames.some((name) =>
        voice.name.toLowerCase().includes(name.toLowerCase())
      )
    ) ||
    voices.find(
      (voice) =>
        voice.lang === 'en-US' &&
        /male|guy|david|daniel|alex|fred|christopher|eric/i.test(
          voice.name
        )
    ) ||
    voices.find(
      (voice) =>
        voice.lang.startsWith('en') &&
        /male|guy|david|daniel|alex|fred|christopher|eric/i.test(
          voice.name
        )
    )

  return selectedVoice
}

if ('speechSynthesis' in window) {
  loadVoice()

  window.speechSynthesis.onvoiceschanged = () => {
    loadVoice()
  }
}

export const speak = (text) => {
  if (!text || !('speechSynthesis' in window)) {
    return
  }

  window.speechSynthesis.cancel()

  const voice = selectedVoice || loadVoice()

  const utterance = new SpeechSynthesisUtterance(String(text))

  if (voice) {
    utterance.voice = voice
    utterance.lang = voice.lang
  } else {
    utterance.lang = 'en-US'
  }

  utterance.rate = 0.85
  utterance.pitch = 0.8
  utterance.volume = 1

  window.speechSynthesis.speak(utterance)
}