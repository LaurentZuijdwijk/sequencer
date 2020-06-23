import SequencerEvent from './../events/SequencerEvent.js'


export default class View {
    constructor(controller, element) {
      this.element = element
      this.controller = controller;
      this.controller.addEventListener(SequencerEvent.DATA_CHANGE, (event)=>{
        this.handleData(event.detail);
      })
  
    }
    handleData(data) {
      this.render(data);
    }
    render(data){}
  }
  