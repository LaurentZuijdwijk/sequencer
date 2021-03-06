import Oscillator from "./src/Oscillator.js";
import Envelope from "./src/Envelope.js";
import Sample from "./src/Sample.js";
import BufferLoader from "./src/BufferLoader.js";
import Sequencer from "./src/Sequencer.js";
import SequencerController from './src/controllers/SequencerController.js';
import SequencerEvent from './src/events/SequencerEvent.js';
import View from './src/components/view.js'
import VolumeView from './src/components/volume-knob.js'



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
  let kick = new Sample("Kickdrum", audioCtx, myMerger);
  let hihat = new Sample("Hihat", audioCtx, myMerger);

  const cymbal = new Sample("Cymbal", audioCtx, myMerger);
  const snaredrum = new Sample("Snaredrum", audioCtx, myMerger);
  const clap = new Sample("Clap", audioCtx, myMerger);
  const clav = new Sample("Clav", audioCtx, myMerger);
  const cowbell = new Sample("Cowbell", audioCtx, myMerger);
  const rimshot = new Sample("Rimshot", audioCtx, myMerger);
  const maraca = new Sample("Maraca", audioCtx, myMerger);

  const instruments = [
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
    rimshot.buffer = bufferList[7];
    maraca.buffer = bufferList[8];

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

  const sequencer = new Sequencer(audioCtx);
  const controller = new SequencerController(sequencer, instruments);
  controller.start();
  controller.addEventListener(SequencerEvent.DATA_CHANGE, (event)=>{

    const data = event.detail.instrument;
    // document.getElementById('instrument').innerText = data
    // document.getElementById('volume').innerText =  event.detail.volume

  })

  new VolumeView(controller, document.getElementById('volume'))
  new BPMView(controller, document.getElementById('bpm'))
new Instrumentsiew(controller , document.getElementById('instruments'))
};

class BPMView extends View {
  bpm;

  handleData(data) {
    if(data.bpm !== this.bpm)
      this.render(data);
  }
  render({bpm}){
    console.log(bpm)
		if(!this.input){
			this.element.innerHTML = `
			<div class="sliderControl">
			  <div class="label"><span class="bpmValue">${bpm}</span>
        BPM</div>
			  <div class="sliderWrapper">
          <input type="range" min="60" max="220" value="${bpm}" class="slider" id="BpmSlider">
			  </div>
      </div>` 
      this.input = this.element.querySelector('input');
      this.label = this.element.querySelector('.bpmValue');
      this.input.addEventListener('input', (e)=>{
				console.log(e.target.value)
				 this.controller.setBpm(e.target.value)
			})

		}
		else {
			this.label.innerText = bpm;
			this.input.value = bpm;
		}
  }
}

class Instrumentsiew extends View {
  instruments;
  instrument;

  handleData(data) {
    console.log(data)
    if(data.instrument !== this.instrument)
      this.render(data);
  }
  render({instruments, instrument}){
    const instrumentEls = instruments.map(el=> `<div class="${el}"><span class="light small ${el === instrument ? 'on' : 'off'}"></span>${el}</div>`)
    
    this.element.innerHTML = instrumentEls.join('')
  }
}



