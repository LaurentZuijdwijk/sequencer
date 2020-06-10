export default class Sample {
    buffer;
    constructor(audioCtx, dest) {
        this.audioCtx = audioCtx;
        this.dest = dest;

    }
    play(){
        const source = this.audioCtx.createBufferSource();
        source.buffer = this.buffer;
        source.connect(this.dest);
        source.start(0)
    }

    set buffer(val){
        this.buffer = val;
    }
}