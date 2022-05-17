

export default class Canvas {
  particles = []
  matrix = []

  constructor() {
    let tmpElem = document.createElement('svg');

    this.stepSize = 20;
    this.particleSize = 10;
    this.paper = Snap("#svg");
    this.paperElement = document.getElementById('svg');
    this.scalingFactor = 1;
    this.sizeFactor = 1;
    this.minSizeOfParticle = 0;

    this.baseParticle = Snap(tmpElem).group()
    this.baseParticle.append(Snap(10, 10).circle(0, 0, this.particleSize));

    this.particleTypes = [this.baseParticle];
  }


  clear() {
    for(let i = 0; i < this.particles.length; i++){
      this.particles[i].remove()
    }
    this.particles = [];
  }

  clearParticleTypes(){
    this.particleTypes = [];
  }

  popParticle(){
    this.particleTypes.pop();
  }

  changeParticleFromUrl(url, pos){
    Snap.load(url, (loadedParticle) => {
      let tmpElem = document.createElement('svg');
      let particle = Snap(tmpElem).group();
      let svg = loadedParticle.select('svg');
      svg.attr({width:this.particleSize + 'px',height: this.particleSize + 'px'})
      particle.append(svg);
      this.particleTypes[pos] = particle;
    });
  }

  appendParticleFromUrl(url){
    this.particleTypes.push(null);
    this.changeParticleFromUrl(url, this.particleTypes.length-1);
  }



  getDownloadURL(){
    return this.paper.toDataURL();
  }

  setMatrix(matrix) {
    this.matrix = matrix.getMatrix();
    let width = this.matrix[0].length;
    let height = this.matrix.length;

    if(width > 800){
      this.scalingFactor = (800. / width);
      height = height * this.scalingFactor;
      width = 800;
    }

    this.paperElement.style.height = height + 'px';
    this.paperElement.style.width = width + 'px';
  }

  draw = async () => {
    this.clear();
    for(let y = 0; y < this.matrix.length; y += this.stepSize){
      for(let x = 0; x < this.matrix[y].length; x += this.stepSize){

        if(this.particleTypes.length === 0) return;

        // select ParticleType

        let index = Math.floor(this.matrix[y][x] * (this.particleTypes.length))
        index = index >= this.particleTypes.length ? index - 1 : index;
        let particle = this.particleTypes[index].clone();


        // create Particle
        this.paper.append(particle)

        let translateX = x * this.scalingFactor;
        let translateY = y * this.scalingFactor;
        let scale = this.matrix[y][x] * this.scalingFactor * this.sizeFactor;
        scale = scale < this.minSizeOfParticle ? this.minSizeOfParticle : scale;

        particle.transform(
          'T' + translateX + ' ' + translateY + ' ' + 'S' + scale
        )


        // push to particles list
        this.particles.push(particle);
      }
    }
  }
}
