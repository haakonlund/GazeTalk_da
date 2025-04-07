export const speakText = (text) => {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.75;
    synth.speak(utterance);
  };


