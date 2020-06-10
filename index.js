import Oscillator from "./src/Oscillator.js";
import Envelope from "./src/Envelope.js";
import Sample from "./src/Sample.js";
// document.onload = ()=>{
//     const btn = document.querySelector('button')

//     btn.addEventListener('click', ()=>{
document.onkeydown = (key) => {
  //   console.log("awefawef", key);
  if (key.code !== "Enter") return;

  document.onkeydown = () => {};

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

//   const gainNodeL = audioCtx.createGain();
//   const gainNodeR = audioCtx.createGain();
  const splitter = audioCtx.createChannelSplitter(2);
//   const merger = audioCtx.createChannelMerger(2);

  //   splitter.connect(gainNodeL, 0);
  //   splitter.connect(gainNodeR, 1);

  //   gainNodeL.connect(merger, 0, 1);
  //   gainNodeR.connect(merger, 0, 0);

  let myMerger = audioCtx.createChannelMerger(6);
  myMerger.connect(splitter);

  splitter.connect(audioCtx.destination);

  const bufferLoader = new BufferLoader(
    audioCtx,
    [
      "./tr-808/BassDrum/KickDrum0001.mp3",
      "./tr-808/open-hihat/open-hihat001.mp3",
      "./tr-808/cymbal/cymbal01.mp3",
      "./tr-808/snaredrum/snaredrum002.mp3",
      "./tr-808/cowbell.mp3",
      "./tr-808/clap.mp3",
      "./tr-808/clav.mp3",
      "./tr-808/rimshot.mp3",
      "./tr-808/maraca.mp3",
    ],
    finishedLoading
  );

  bufferLoader.load();

  // let kick = audioCtx.createBufferSource();
  let kick = new Sample(audioCtx, myMerger);
  let hihat = new Sample(audioCtx, myMerger);

  const cymbal = new Sample(audioCtx, myMerger);
  const snaredrum = new Sample(audioCtx, myMerger);
  const clap = new Sample(audioCtx, myMerger);
  const clav = new Sample(audioCtx, myMerger);
  const cowbell = new Sample(audioCtx, myMerger);
  const rimshot = new Sample(audioCtx, myMerger);
  const maraca = new Sample(audioCtx, myMerger);

  function finishedLoading(bufferList) {
    // Create two sources and play them both together.
    // var source2 = context.createBufferSource();
    kick.buffer = bufferList[0];
    hihat.buffer = bufferList[1];
    cymbal.buffer = bufferList[2];
    snaredrum.buffer = bufferList[3];

    cowbell.buffer = bufferList[4];
    clap.buffer = bufferList[5];
    clav.buffer = bufferList[6];
    rimshot.buffer = bufferList[6];
    maraca.buffer = bufferList[7];

    // kick.connect(myMerger);
    // kick.start(0)
    // source2.connect(context.destination);
    // source1.start(0);
    // source2.start(0);
  }

  //   const osc = new Oscillator(audioCtx, 440, myMerger);
  //   const bass = new Oscillator(audioCtx, 70, myMerger, "sawtooth");
  //   const hi = new Oscillator(audioCtx, 4000, myMerger, "sawtooth");

  //   const lfo = audioCtx.createOscillator();
  //   lfo.frequency.setValueAtTime(4, audioCtx.currentTime); // value in hertz
  //   lfo.waveform = "sawtooth";
  //   lfo.start();

//   const lfoGainNode = audioCtx.createGain();
  //   lfoGainNode.gain.value = 0.17;
  //   lfo.connect(lfoGainNode);

  //   const osc2 = new Oscillator(audioCtx, 300, myMerger);
  //   osc2.volume = 0.2;
  //   lfoGainNode.connect(osc2.gainNode.gain);

  //   const bassenv = new Envelope(audioCtx, bass.ctr, 0.01, 0.1, 0.1, 0.3);
  //   const env2 = new Envelope(audioCtx, osc.ctr, 0.1);
  //   const hihi = new Envelope(audioCtx, hi.ctr, 0.01, 0.02, 0.2, 0.41);

  //   document.addEventListener("keypress", (key) => {
  //     if (key.key === "z") env2.play();
  //     if (key.key === "x") hihi.play();
  //   });

  // document.addEventListener('keypress', (key) => {
  //     if(key.code === 'Space') env.play()

  // })
  class Sequencer {
    interval;

    constructor() {
      this.bpm = 120;
      this.sequence = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
      ];
      this.index = 0;
      this.instrument = 0;
      this.instruments = [
        kick,
        hihat,
        cymbal,
        snaredrum,
        cowbell,
        clav,
        clap,
        rimshot,
        maraca,
      ];
      this._fill;
      this._filling = false;
    }

    onKeyPress(key) {
      console.log("down", key.code, this._filling);
      if (key.code === "KeyF") {
        this.fill();

        this._filling = true;
      }
    }
    onKeyUp(key) {
      console.log("up", key.code, this._filling);
      if (key.code === "KeyF") {
        this._filling = false;
      }
    }

    onKey(key) {
      if (key.code === "Enter") {
        if (this.interval) {
          this.stop();
          this.interval = undefined;
        } else {
          this.start();
        }
      }
      if (key.code === "Space") {
        this.sequence[this.index][this.instrument] = this.instruments[
          this.instrument
        ];
      }
      if (key.code === "KeyC") {
        this.sequence[this.index][this.instrument] = null;
      }
      if (key.code === "ArrowLeft") {
        this.instrument =
          this.instrument === 0
            ? this.instruments.length - 1
            : this.instrument - 1;
      }
      if (key.code === "ArrowRight") {
        this.instrument =
          this.instrument === this.instruments.length - 1
            ? 0
            : this.instrument + 1;
      }
    }

    fill() {
      this._fill = this.instruments[this.instrument];
    }
    stop() {
      if (this.interval) clearInterval(this.interval);

      document.removeEventListener("keydown", this.onKey.bind(this));
      document.removeEventListener("keydown", this.onKeyPress.bind(this));
      document.removeEventListener("keyup", this.onKeyUp.bind(this));
    }
    start() {
      if (this.interval) clearInterval(this.interval);

      document.addEventListener("keydown", this.onKey.bind(this));
      document.addEventListener("keydown", this.onKeyPress.bind(this));
      document.addEventListener("keyup", this.onKeyUp.bind(this));
      this.interval = setInterval(() => {
        if (this._filling) {
          this._fill = this.instruments[this.instrument];

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

        cur.forEach((el) => {
          if (el && el.play) el.play();
          if (el && el.start) el.start(0);
        });
        // console.log(cur, this.index)
        this.index += 1;
        if (this.index >= this.sequence.length) {
          this.index = 0;
        }
      }, 60000 / (this.bpm * 4));
    }
  }

  const sequencer = new Sequencer();
  sequencer.start();
};

function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function (url, index) {
  let request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  let loader = this;

  request.onload = function () {
    loader.context.decodeAudioData(request.response, (buffer) => {
      if (!buffer) {
        alert(`error decoding file data: ${url}`);
        return;
      }
      loader.bufferList[index] = buffer;
      if (++loader.loadCount == loader.urlList.length)
        loader.onload(loader.bufferList);
    });
  };

  request.onerror = function () {
    alert("BufferLoader: XHR error");
  };

  request.send();
};

BufferLoader.prototype.load = function () {
  for (let i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
};
