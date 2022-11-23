export class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(vector) {
        return new Vector(
            this.x + vector.x,
            this.y + vector.y,
            this.z + vector.z,
        );
    }

    sub(vector) {
        return new Vector(
            this.x - vector.x,
            this.y - vector.y,
            this.z - vector.z,
        );
    }

    mul(scalar) {
        return new Vector(
            this.x * scalar,
            this.y * scalar,
            this.z * scalar,
        );
    }

    div(scalar) {
        return new Vector(
            this.x / scalar,
            this.y / scalar,
            this.z / scalar,
        );
    }

    crossProd(vector){
        return new Vector(
            this.y * vector.z  -  this.z * vector.y,
            this.z * vector.x  -  this.x * vector.z,
            this.x * vector.y  -  this.y * vector.x
        );
    }

    clone() {
        return new Vector(
            this.x,
            this.y,
            this.z
        );
    }

    getMidVector(vector) {
        return this.sub(this.sub(vector).div(2));
    }

    normalized(){
        const len = this.euclideanLength();
        return new Vector(
            this.x / len,
            this.y / len,
            this.z / len
        );
    }

    euclideanLength() {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }

    getPosition(){
        return [this.x,this.y,this.z];
    }
}