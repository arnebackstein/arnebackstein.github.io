//import {onload2promise} from './helpers.js'

function onload2promise(obj){
  return new Promise((resolve, reject) => {
    obj.onload = () => resolve(obj);
    obj.onerror = reject;
  });
}

export default class Matrix{
  constructor() {
    this.width = 800
    this.height = 600
    this.createRandomMatrix();
  }

  createEmptyMatrix() {
    this.matrix = Array(this.height);
    for(let y = 0; y < this.matrix.length; y++){
      this.matrix[y] = Array(this.width)
    }
  }

  createRandomMatrix() {
    this.matrix = Array(this.height);
    for(let y = 0; y < this.matrix.length; y++){
      this.matrix[y] = Array(this.width).fill(1).map((value) => Math.random())
    }
  }

  async createMatrixFromImg(imgSrc){
    return new Promise(async (resolve, reject) => {

      const img = await this.addImageProcess(imgSrc);

      this.width = img.width;
      this.height = img.height;
      this.createEmptyMatrix();

      const rgba = this.imgToRgba(img);

      this.setMatrixFromRgba(rgba)

      resolve();
    });
  }

  addImageProcess(src){
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  imgToRgba(img){
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    let rgba = ctx.getImageData(
      0, 0, img.width, img.height
    ).data;
    return rgba;
  }

  setMatrixFromRgba(rgba){
    for(let i = 0; i < rgba.length; i += 4){
      let red = rgba[i] / 255.
      let green = rgba[i+1] / 255.
      let blue = rgba[i+2] / 255.
      let alpha = rgba[i+3] / 255.

      let grayValue = 1 - (0.3 * red + 0.59 * green + 0.11 * blue)*alpha

      let pos = i / 4
      let x = pos % this.width; // Remainder
      let y = Math.floor(pos/this.width); // Quotient

      this.matrix[y][x] = grayValue;
    }
  }

  getMatrix(){
    return this.matrix;
  }
}
