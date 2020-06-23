import View from './view.js'

export default class VolumeView extends View {
    volume;
  
    handleData(data) {
      if(data.volume !== this.volume)
        this.render(data);
    }
    render({volume}){
	  const rot = Math.round(volume * 11)
		if(!this.input){
			this.element.innerHTML = `
			<div class="sliderControl">
			    <div class="label">Volume</div>
			    <div class="sliderWrapper">
		            <input type="range" min="0" max="11" value="${rot}" class="slider" id="volumeSlider">
			    </div>
			</div>`; 
		 	this.input = this.element.querySelector('input')
		}
		else {
			this.input.value = rot
		}
	}
  }
  