let prevTime = 0;
export default class Sequencer {
    interval;

    constructor(audioctx) {
      this.audioctx = audioctx;
      this.bpm = 120;
      this.sequence = Array.from(new Array(16),()=> [])
      this.index = 0;
      this.instrumentIndex = 0;
      this.instruments = [];
      this._fill;
      this._filling = false;
    }

    get instrument(){
        return this.instruments[this.instrumentIndex];
    }

    toData(){
        return {

            instruments: this.instruments.map(e=>e.name),
            instrument: this.instrument.name,
            bpm: this.bpm,
            volume: this.volume,
            running: this.interval ? true: false
        }

    }

    nextInstrument() {
      this.instrumentIndex =
        this.instrumentIndex === this.instruments.length - 1
          ? 0
          : this.instrumentIndex + 1;
    }
    prevInstrument() {
      this.instrumentIndex =
        this.instrumentIndex === 0
          ? this.instruments.length - 1
          : this.instrumentIndex - 1;
    }

    set volume(val){
        if(val > 1) val = 1;
        if(val < 0) val = 0;

        this.instrument.volume = val
    }
    get volume(){
        return this.instrument.volume
    }

    trigger() {
      this.sequence[this.index][this.instrumentIndex] = this.instruments[
        this.instrumentIndex
      ];
    }
    clearAll(){
        this.sequence = Array.from(new Array(16),()=> [])
    }
    clearInstrumentSequence() {
      this.sequence[this.index][this.instrumentIndex] = null;
    }
    fill() {
      this._fill = this.instrument;
      this._filling = true;
    }
    endFill() {
    //   this._fill = this.instruments[this.instrument];
      this._filling = false;
    }

    stop() {
      if (this.interval) this.interval.stop();
      this.interval = undefined;
    }

    start() {
      if (this.interval) this.interval.stop();

      this.interval = new AdjustingInterval(() => {
        if (this._filling) {
          this._fill = this.instrument;

          this._fill.play();
          this._fill = undefined;
        }
        if (this._fill) {
          this._fill.play();
          this._fill = undefined;
        }

        const cur = this.sequence[this.index];

        if (document.querySelector('.seq-light[active="true"]')) {
          document
            .querySelector('.seq-light[active="true"]')
            .removeAttribute("active");
        }
        document
          .getElementById(`seq-${this.index}`)
          .setAttribute("active", true);

        const timeDelta = ( this.audioctx.currentTime - prevTime)*1000
        const offset = timeDelta > (60000 / (this.bpm * 4)) ? 0 : 60000 / (this.bpm * 4) - timeDelta



          cur.forEach((el) => {
          if (el && el.play) el.play();
          if (el && el.start) el.start(offset);
        });
        this.index += 1;

        prevTime = this.audioctx.currentTime
        if (this.index >= this.sequence.length) {
          this.index = 0;
        }
      }, 60000 / (this.bpm * 4));
      this.interval.start()
    }
  }


function AdjustingInterval(workFunc, interval, errorFunc) {
    var that = this;
    var expected, timeout;
    this.interval = interval;

    this.start = function() {
        expected = Date.now() + this.interval;
        timeout = setTimeout(step, this.interval);
    }

    this.stop = function() {
        clearTimeout(timeout);
    }

    function step() {
        var drift = Date.now() - expected;
        if (drift > that.interval) {
            // You could have some default stuff here too...
            if (errorFunc) errorFunc();
        }
        workFunc();
        expected += that.interval;
        timeout = setTimeout(step, Math.max(0, that.interval-drift));
    }
}