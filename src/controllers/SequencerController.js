import SequencerEvent from "../events/SequencerEvent.js";

export default class SequencerController extends EventTarget {
  constructor(sequencer, instruments) {
    super();
    this.sequencer = sequencer;
    this.instruments = instruments;
  }

  addEventListeners() {
    document.addEventListener("keydown", this.onKey.bind(this));
    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  removeEventListeners() {
    document.removeEventListener("keydown", this.onKey.bind(this));
    document.removeEventListener("keydown", this.onKeyDown.bind(this));
    document.removeEventListener("keyup", this.onKeyUp.bind(this));
  }

  onKeyDown(key) {
    // console.log("down", key.code, this._filling);
    if (key.code === "KeyF") {
      this.sequencer.fill();
    }
  }

  onKeyUp(key) {
    // console.log("up", key.code, this._filling);
    if (key.code === "KeyF") {
      this.sequencer.endFill();
    }
  }

  onKey(key) {
    if (key.code === "Enter") {
      if (this.sequencer.interval) {
        this.sequencer.stop();
      } else {
        this.sequencer.start();
      }
      this.updated();
    }
    if (key.code === "Space") {
      this.sequencer.trigger();
    }
    if (key.code === "KeyC") {
      if (key.ctrlKey) {
        this.sequencer.clearAll();
      } else {
        this.clearInstrumentSequence();
      }
    }
    if (key.code === "ArrowLeft") {
      this.prevInstrument();
    }
    if (key.code === "ArrowRight") {
      this.nextInstrument();
    }
    if (key.code === "ArrowUp") {
      if (key.ctrlKey) {
        /// something different
      } else {
        this.sequencer.volume += 0.05;
      }
      this.updated();
      //   console.log(this.sequencer.volume);
    }
    if (key.code === "ArrowDown") {
      if (key.ctrlKey) {
        /// something different
      } else {
        this.sequencer.volume -= 0.05;
      }
      this.updated();
    }
  }
  updated() {
    this.dispatchEvent(SequencerEvent.UPDATE(this.sequencer.toData()));
  }

  start() {
    this.addEventListeners();
    this.sequencer.instruments = this.instruments;
    this.sequencer.start();
    this.updated();
  }

  clearInstrumentSequence() {
    this.sequencer.clearInstrumentSequence();
  }
  prevInstrument() {
    this.sequencer.prevInstrument();
    this.updated();
  }
  nextInstrument() {
    this.sequencer.nextInstrument();
    this.updated();
  }
}
