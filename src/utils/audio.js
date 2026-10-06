export const speak = (text) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis is not supported')
    return
  }

  window.speechSynthesis.cancel()
  

  const utterance = new SpeechSynthesisUtterance(text)
  

  utterance.lang = 'en-US'
  utterance.rate = 0.85
  utterance.pitch = 1
  utterance.volume = 1

  window.speechSynthesis.speak(utterance)
}