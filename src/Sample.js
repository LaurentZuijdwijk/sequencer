export default class Sample {
    buffer;
    constructor(name, audioCtx, dest) {
        this.name = name;
        this.audioCtx = audioCtx;
        this.dest = dest;
        this.gainNode = audioCtx.createGain();
        this.gainNode.connect(this.dest)
    }
    play(){
        const source = this.audioCtx.createBufferSource();
        source.buffer = this.buffer;
        source.connect(this.gainNode);
        source.start(0)
    }

    set volume (val) {
        this.gainNode.gain.value = val;
    }
    get volume () {
        return this.gainNode.gain.value;
    }
    
    set buffer(val){
        this.buffer = val;
    }
}