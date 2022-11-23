import {Vector} from "./Vector.js";
import {Triangle} from "./Traingle.js";

export class Graph {
    constructor(subdivisions) {
        this.triangles = [];
        this.triangles = this.createBaseIcosahedron();
        this.subdivide(subdivisions);
    }

    subdivide(subdivisions) {
        for (let j = 0; j < subdivisions; j++) {
            this.triangles[0].subdivide();
            this.triangles[0].connectSubdivisions();
            let t = [];
            for (let i = 0; i < this.triangles.length; i++) {
                t = t.concat(this.triangles[i].subdivedTriangles);
            }
            for(let i = 0; i < t.length; i++){
                t[i].indicateMissingConnections();
            }
            this.triangles = t;
        }
    }

    createBaseIcosahedron() {
        const phi = (1 + Math.sqrt(5)) / 2; // Golden Ratio
        let v = [
            new Vector(0, 1, phi),      // A 0
            new Vector(0, 1, -phi),     // B 1
            new Vector(0, -1, phi),     // C 2
            new Vector(0, -1, -phi),    // D 3

            new Vector(1, phi, 0),      // E 4
            new Vector(1, -phi, 0),     // F 5
            new Vector(-1, phi, 0),     // G 6
            new Vector(-1, -phi, 0),    // H 7

            new Vector(phi, 0, 1),      // I 8
            new Vector(phi, 0, -1),     // J 9
            new Vector(-phi, 0, 1),     // K 10
            new Vector(-phi, 0, -1),    // L 11
        ];

        let indices = [
            // TOP PENTAGON
            10, 0, 6,         // K A G
            6, 0, 4,          // G A E
            4, 0, 8,          // E A I
            8, 0, 2,          // I A C
            2, 0, 10,         // C A K

            // MID RING
            // C F I J E B G L K H
            6, 11, 10,        // G L K
            11, 6, 1,          // G B L
            4, 1, 6,          // E B G
            1, 4, 9,           // E J B
            8, 9, 4,          // I J E
            9, 8, 5,           // I F J
            2, 5, 8,          // C F I
            5, 2, 7,           // C H F
            10, 7, 2,         // K H C
            7, 10, 11,         // K L H

            // BOTTOM PENTAGON
            1, 3, 11,         // D L B
            9, 3, 1,          // D B J
            5, 3, 9,          // D J F
            7, 3, 5,           // D F H
            11, 3, 7,           // D H L
        ]

        let triangles = [];

        for (let i = 0; i < indices.length; i += 3) {
            triangles.push(
                new Triangle(
                    v[indices[i]],
                    v[indices[i + 1]],
                    v[indices[i + 2]],
                    null, null, null)
            );
        }

        // connect top pentagon (left and right)
        for (let i = 0; i < 5; i++) {
            triangles[i].left = triangles[(i + 1) % 5];
            triangles[i].right = triangles[((i - 1) + 5) % 5]; // ((i-1)+5)%5 = (i-1) mod 5
        }

        // connect bottom pentagon (left and right)
        for (let i = 0; i < 5; i++) {
            let offset = triangles.length - 5;
            triangles[i + offset].left = triangles[((i + 1) % 5) + offset];
            triangles[i + offset].right = triangles[(((i - 1) + 5) % 5) + offset]; // ((i-1)+5)%5 = (i-1) mod 5
        }

        // connect inner ring
        for (let i = 0; i < 5; i += 1) {
            let offset = 5;
            let offsetBottom = triangles.length - 5;

            // i*2
            triangles[i * 2 + offset].bottom = triangles[i];
            triangles[i].bottom = triangles[i * 2 + offset];

            triangles[i * 2 + offset].left = triangles[((i * 2 - 1) + 10) % 10 + offset] // (i*2-1)+10)%10 = (i*2-1) mod 10
            triangles[i * 2 + offset].right = triangles[(i * 2 + 1) % 10 + offset]

            // i*2 +1
            triangles[i * 2 + 1 + offset].bottom = triangles[i + offsetBottom];
            triangles[i + offsetBottom].bottom = triangles[i * 2 + 1 + offset];

            triangles[i * 2 + 1 + offset].right = triangles[i * 2 + offset];
            triangles[i * 2 + 1 + offset].left = triangles[(i * 2 + 2) % 10 + offset];
            ;
        }

        return triangles;
    }

    getPositions(){
        let points = [];
        for (let i = 0; i < this.triangles.length; i++) {
            points = points.concat(this.triangles[i].getPositions());
        }
        return points;
    }

    setRGBColor(r,g,b){
        this.triangles.forEach(triangle => {
            triangle.setRGBColor(r,g,b);
        });
    }

    getColors(){
        let colors = [];
        for (let i = 0; i < this.triangles.length; i++) {
            colors = colors.concat(this.triangles[i].getColors());
        }
        return colors;
    }

    getNormals(){
        let normals = [];
        this.triangles.forEach(triangle => {
            let xyzNormal = [triangle.normal.x, triangle.normal.y, triangle.normal.z];
            normals = normals.concat(xyzNormal); // vec1 normal
            normals = normals.concat(xyzNormal); // vec2 normal
            normals = normals.concat(xyzNormal); // vec3 normal
        });
        return normals;
    }

}

