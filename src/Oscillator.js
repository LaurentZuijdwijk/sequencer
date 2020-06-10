export default class Oscillator {
    constructor(audioCtx, freq, dest, waveform = "sine") {
      this.oscillator = audioCtx.createOscillator();

      this.oscillator.type = waveform;
      this.oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime); // value in hertz

      let panNode = audioCtx.createStereoPanner();

      this.gainNode = audioCtx.createGain();
      this.oscillator.connect(panNode);
      panNode.pan.setValueAtTime(0, audioCtx.currentTime);

      panNode.connect(this.gainNode);
      this.gainNode.connect(dest);
      this.gainNode.gain.value = 0;
      this.oscillator.start();
    }
    set volume(val) {
      this.gainNode.gain.value = val;
    }
    get ctr() {
      return this.gainNode;
    }
  }