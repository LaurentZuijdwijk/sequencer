export default 
class Envelope {
  constructor(
      ctx,
    dest,
    attack = 0.05,
    decay = 0.1,
    sustain = 0.41,
    release = 0.03
  ) {
      this.ctx = ctx
    this.dest = dest;
    this.attack = attack;
    this.decay = decay;
    this.release = release;
    this.sustain = sustain;
  }
  play() {
    this.dest.gain.cancelScheduledValues(this.ctx.currentTime);
    this.dest.gain.setValueAtTime(0, this.ctx.currentTime);
    this.dest.gain.linearRampToValueAtTime(
      0.5,
      this.ctx.currentTime + this.attack
    );
    this.dest.gain.linearRampToValueAtTime(
      0.4,
      this.ctx.currentTime + this.attack + this.decay
    );
    this.dest.gain.linearRampToValueAtTime(
      0.2,
      this.ctx.currentTime + this.attack + this.decay + this.sustain
    );
    this.dest.gain.linearRampToValueAtTime(
      0.0,
      this.ctx.currentTime +
        this.attack +
        this.decay +
        this.sustain +
        this.release
    );
  }
}