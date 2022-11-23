/**
 * this file implements a game of life like game engine
 * but is not currently used by any other file
 * since there is further development needed in
 * order to make this game engine interesting
 * however it is fully functional
 */


import {Graph} from "./graph.js";

export class Earth{
    constructor(subdivisions) {
        this.graph = new Graph(subdivisions);
        this.setRandomInitialState();
    }

    setRandomInitialState(){
        for(let i = 0; i < this.graph.triangles.length; i++){
            if(Math.random() > 0.5) this.graph.triangles[i].turnOn();
        }
    }

    step(){
        for(let i = 0; i < this.graph.triangles.length; i++){
            // count neighbors of triangle
            let nb = new Set();
            this.graph.triangles[i].getNeighbors().forEach(neighbor => {
                if(neighbor.isTurnedOn) nb.add(neighbor)
                if(neighbor.left?.isTurnedOn) nb.add(neighbor.left);
                if(neighbor.right?.isTurnedOn) nb.add(neighbor.right);
                if(neighbor.bottom?.isTurnedOn) nb.add(neighbor.bottom);
            });

            const S = new Set([5,6,7]);
            const B = new Set([5,6]);
            // turn on or off
            if(B.has(nb.size)) this.graph.triangles[i].turnOn();
            else if(!S.has(nb.size)) this.graph.triangles[i].turnOff();
        }
    }


}