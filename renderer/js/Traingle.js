export class Triangle {
    constructor(vec1, vec2, vec3, left, right, bottom) {
        this.DEFAULT_COLOR = [0.5,0.9,0.8,1]; // RGB
        this.TURNED_ON_COLOR = [1,0,0,1];


        // vec1, vec2 -> right
        // vec2, vec3 -> left
        // vec3, vec1 -> bottom
        this.vec1 = vec1;
        this.vec2 = vec2;
        this.vec3 = vec3;
        this.left = left;
        this.right = right;
        this.bottom = bottom;
        this.id = (performance.now().toString(36) + Math.random()
            .toString(36)).replace(/\./g, ""); // generate unique id
        this.isTurnedOn = false;
        this.normal = this.computeNormal();

        this.resetColor();

        this.subdivedTriangles = null;
        this.subdivisionConnected = true;
    }

    indicateMissingConnections(){
        if(!this.bottom) {
            this.vec1Color = [1,0,0];
            this.vec3Color = [1,0,0];
        }
        if(!this.left){
            this.vec1Color = [1,0,0];
            this.vec2Color = [1,0,0];
        }
        if(!this.right){
            this.vec2Color = [1,0,0];
            this.vec3Color = [1,0,0];
        }
    }

    resetColor(){
        this.vec1Color = this.DEFAULT_COLOR;
        this.vec2Color = this.DEFAULT_COLOR;
        this.vec3Color = this.DEFAULT_COLOR;
    }

    setRGBColor(r, g, b) {
        this.vec1Color = [r, g, b, 1]; // RGB
        this.vec2Color = [r, g, b, 1]; // RGB
        this.vec3Color = [r, g, b, 1]; // RGB
    }

    setRGBArray(RGBArray) {
        this.vec1Color = RGBArray; // RGB
        this.vec2Color = RGBArray; // RGB
        this.vec3Color = RGBArray; // RGB
    }

    getPositions(){
        if (this.subdivedTriangles) {
            let vectors = [];
            for (let i = 0; i < this.subdivedTriangles.length; i++) {
                vectors = vectors.concat(this.subdivedTriangles[i].getPositions());
            }
            return vectors;
        }
        return this.vec1.getPosition().concat(this.vec2.getPosition()).concat(this.vec3.getPosition());
    }

    getColors(){
        if (this.subdivedTriangles) {
            let colors = [];
            for (let i = 0; i < this.subdivedTriangles.length; i++) {
                colors = colors.concat(this.subdivedTriangles[i].getColors());
            }
            return colors;
        }
        return this.vec1Color.concat(this.vec2Color).concat(this.vec3Color);
    }

    subdivide() {
        if (this.subdivedTriangles) return;

        // calculate points between the triangle's corners
        let mid12 = this.vec1.getMidVector(this.vec2);
        let mid23 = this.vec2.getMidVector(this.vec3);
        let mid31 = this.vec3.getMidVector(this.vec1);

        // project the points onto a sphere
        const phi = (1 + Math.sqrt(5)) / 2; // Golden Ratio
        const radius = Math.sqrt(phi ** 2 + 1);
        mid12 = mid12.mul(radius / mid12.euclideanLength());
        mid23 = mid23.mul(radius / mid23.euclideanLength());
        mid31 = mid31.mul(radius / mid31.euclideanLength());

        this.subdivedTriangles = [
            new Triangle(this.vec1, mid12, mid31), // bottom right
            new Triangle(mid12, this.vec2, mid23), // top
            new Triangle(mid31, mid23, this.vec3), // bottom left
            new Triangle(mid23, mid31, mid12) // center
        ];

        this.subdivisionConnected = false;

        this.right?.subdivide();
        this.left?.subdivide();
        this.bottom?.subdivide();
    }

    connectSubdivisions() {
        if (this.subdivisionConnected || !this.subdivedTriangles) return;


        let rightPair = this.getAdjacentTrianglePair(this.right);
        let leftPair = this.getAdjacentTrianglePair(this.left);
        let bottomPair = this.getAdjacentTrianglePair(this.bottom);


        // bottom right
        this.subdivedTriangles[0].left = this.subdivedTriangles[3];
        this.subdivedTriangles[0].right = rightPair[1];
        this.subdivedTriangles[0].bottom = bottomPair[0];

        // top
        this.subdivedTriangles[1].left = leftPair[1];
        this.subdivedTriangles[1].right = rightPair[0];
        this.subdivedTriangles[1].bottom = this.subdivedTriangles[3];

        // bottom left
        this.subdivedTriangles[2].left = leftPair[0];
        this.subdivedTriangles[2].right = this.subdivedTriangles[3];
        this.subdivedTriangles[2].bottom = bottomPair[1];

        // center
        this.subdivedTriangles[3].left = this.subdivedTriangles[0];
        this.subdivedTriangles[3].bottom = this.subdivedTriangles[1];
        this.subdivedTriangles[3].right = this.subdivedTriangles[2];


        this.subdivisionConnected = true;
        this.right?.connectSubdivisions();
        this.left?.connectSubdivisions();
        this.bottom?.connectSubdivisions();
    }

    /**
     * this:          /_\
     *               /\ /\
     *              /_\/_\
     *           adjacentEdge
     * triangle:   (\-/\-/) = adjTrianglePair
     *              \/ \/
     *               \-/
     * @param triangle
     * @returns {null}
     */
    getAdjacentTrianglePair(triangle) {
        if (!triangle.subdivedTriangles) return null;

        // vec1, vec2 -> right
        // vec2, vec3 -> left
        // vec3, vec1 -> bottom

        let adjEdge = null;
        if (triangle.left?.id === this.id) {
            adjEdge = 'left';
            return [
                triangle.subdivedTriangles[1],
                triangle.subdivedTriangles[2]
            ]
        } else if (triangle.right?.id === this.id) {
            adjEdge = 'right';
            return [
                triangle.subdivedTriangles[0],
                triangle.subdivedTriangles[1]
            ]
        } else if (triangle.bottom?.id === this.id) {
            adjEdge = 'bottom';
            return [
                triangle.subdivedTriangles[2],
                triangle.subdivedTriangles[0]
            ]
        } else {
            return null;
        }

    }

    getNeighbors(){
        let neighbors = [];
        if(this.left) neighbors.push(this.left);
        if(this.right) neighbors.push(this.right);
        if(this.bottom) neighbors.push(this.bottom);
        return neighbors;
    }

    turnOn(){
        this.isTurnedOn = true;
        this.vec1Color = this.TURNED_ON_COLOR;
        this.vec2Color = this.TURNED_ON_COLOR;
        this.vec3Color = this.TURNED_ON_COLOR;
    }

    turnOff(){
        this.isTurnedOn = false;
        this.vec1Color = this.DEFAULT_COLOR;
        this.vec2Color = this.DEFAULT_COLOR;
        this.vec3Color = this.DEFAULT_COLOR;
    }

    computeNormal(){
        const U = this.vec2.sub(this.vec1);
        const V = this.vec3.sub(this.vec1);

        return U.crossProd(V);
    }
}





