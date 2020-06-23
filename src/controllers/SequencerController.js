import SequencerEvent from "../events/SequencerEvent.js";

export default class SequencerController extends EventTarget {
  constructor(sequencer, instruments) {
    super();
    this.sequencer = sequencer;
    this.instruments = instruments;
    setTimeout(()=>{
      this.updated();
    }, 10)
  }

  addEventListeners() {
    document.addEventListener("keydown", this.onKey.bind(this));
    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));
    document.addEventListener("visibilitychange", this.handleVisibilityChange.bind(this), false);

  }

  removeEventListeners() {
    document.removeEventListener("keydown", this.onKey.bind(this));
    document.removeEventListener("keydown", this.onKeyDown.bind(this));
    document.removeEventListener("keyup", this.onKeyUp.bind(this));
    document.removeEventListener("visibilitychange", this.handleVisibilityChange.bind(this), false);

  }

  onKeyDown(key) {
    // console.log("down", key.code, this._filling);
    if (key.code === "KeyF") {
      this.sequencer.fill();
    }
  }

  selectSequence(val){
    this.sequencer.selectSequence(val);

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
    else if (key.code === "Space") {
      this.sequencer.trigger();
    }
    else if (key.code === "KeyC") {
      if (key.ctrlKey) {
        this.sequencer.clearAll();
      } else {
        this.clearInstrumentSequence();
      }
    }
    else if (key.code === "ArrowLeft") {
      this.prevInstrument();
    }
    else if (key.code === "ArrowRight") {
      this.nextInstrument();
    }
    else if (key.code === "ArrowUp") {
      if (key.ctrlKey) {
        /// something different
      } else {
        this.sequencer.volume += 0.05;
      }
      this.updated();
      //   console.log(this.sequencer.volume);
    }
  
    else if (key.code === "Digit1") {
      this.selectSequence(1)
    }
    else if (key.code === "Digit2") {
      this.selectSequence(2)
    }
    else if (key.code === "Digit3") {
      this.selectSequence(3)
    }
    else if (key.code === "Digit4") {
      this.selectSequence(4)
    }
    else if (key.code === "Minus") {
      this.decreaseBpm()
    }
    else if (key.code === "Equal") {
      this.increaseBpm()
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
    this.updated()
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
  increaseBpm(){
    this.sequencer.bpm++;
    this.updated();

  }
  decreaseBpm(){
    this.sequencer.bpm--;
    this.updated();

  }


  handleVisibilityChange(){
    if (document['hidden']) {
      this.sequencer.stop();
    } else {
      this.sequencer.start();
    }
    this.updated();
  }
}
