import Canvas from "./Canvas.js";
import Matrix from "./Matrix.js";


const canvas = new Canvas();
const matrix = new Matrix();

const applyButton = document.getElementById("applyButton");
const matrixImg = document.getElementById('matrixImg')
const iconsContainer = document.getElementById('iconsContainer');
const addParticleButton = document.getElementById('addParticleButton');
const subParticleButton = document.getElementById('subParticleButton');
const sizeSlider = document.getElementById('sizeSlider');
const minSizeSlider = document.getElementById('minSizeSlider');
const stepSize = document.getElementById('stepSize');

let numOfParticleInputs = 1;



function onIconUploadChange() {
  if (!(this.files && this.files[0])) return;
  const svgUrl = URL.createObjectURL(this.files[0]);

  let idNum = parseInt(this.id.split('_')[1]);

  if(idNum == canvas.particleTypes.length){
    canvas.appendParticleFromUrl(svgUrl);
  }
  else {
    canvas.changeParticleFromUrl(svgUrl, idNum)
  }
}

const changeMatrixFromImgUrl = (url) => {
  matrix.createMatrixFromImg(url).then(() => {
    matrixImg.src = url;
    canvas.setMatrix(matrix)
    canvas.draw()
  });
}

const createParticlesInput = (i) => {
  let particlesInput = document.createElement('input');
  //<input type='file' id="iconUpload" style="background: gold"/>
  particlesInput.id = "iconUpload_" + i
  particlesInput.type = 'file'
  particlesInput.addEventListener('change', onIconUploadChange)
  return particlesInput
}

applyButton.addEventListener('click', () => {
  canvas.draw()
  document.getElementById('download_link').href = canvas.getDownloadURL();
})

addParticleButton.addEventListener('click', () => {
  if(numOfParticleInputs > canvas.particleTypes.length) return;
  iconsContainer.appendChild(createParticlesInput(canvas.particleTypes.length));
  numOfParticleInputs++;
})

subParticleButton.addEventListener('click', () => {
  if(numOfParticleInputs <= 1) return;
  iconsContainer.removeChild(iconsContainer.lastChild);

  if(numOfParticleInputs == canvas.particleTypes.length) canvas.popParticle();

  numOfParticleInputs--;
})

sizeSlider.addEventListener('change', (e) => {
  console.log(e.target.value)
  canvas.sizeFactor = parseFloat(e.target.value)
})

minSizeSlider.addEventListener('change', (e) => {
  console.log(e.target.value)
  canvas.minSizeOfParticle = parseFloat(e.target.value)
})

stepSize.addEventListener('change', (e) => {
  console.log(e.target.value)
  canvas.stepSize = parseInt(e.target.value);
})

document.getElementById('matrixUpload').addEventListener('change', function() {
  if (this.files && this.files[0]) {
    changeMatrixFromImgUrl(URL.createObjectURL(this.files[0]))
  }
})


document.getElementById('iconUpload_0').addEventListener('change', onIconUploadChange)



changeMatrixFromImgUrl('img/sample.jpeg')









function getVals(){
  // Get slider values
  var parent = this.parentNode;
  var slides = parent.getElementsByTagName("input");
  var slide1 = parseFloat( slides[0].value );
  var slide2 = parseFloat( slides[1].value );
  var slide3 = parseFloat( slides[2].value );
  // Neither slider will clip the other, so make sure we determine which is larger
  if( slide1 > slide2 ){ var tmp = slide2; slide2 = slide1; slide1 = tmp; }
  console.log(slide3)
  var displayElement = parent.getElementsByClassName("rangeValues")[0];
  displayElement.innerHTML = slide1 + " - " + slide2;
}

window.onload = function(){
  // Initialize Sliders
  var sliderSections = document.getElementsByClassName("range-slider");
  for( var x = 0; x < sliderSections.length; x++ ){
    var sliders = sliderSections[x].getElementsByTagName("input");
    for( var y = 0; y < sliders.length; y++ ){
      if( sliders[y].type ==="range" ){
        sliders[y].oninput = getVals;
        // Manually trigger event first time to display values
        sliders[y].oninput();
      }
    }
  }
}








