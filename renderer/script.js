import {Graph} from "./js/graph.js";
import {Renderer} from "./js/Renderer.js";
import {Earth} from "./js/GameEngine.js";
import {hexToRgb} from "./js/util.js";

const colorInput = document.getElementById("colorInput");
const subdivisionsInput = document.getElementById("subdivisionsInput");
const lightningInput = document.getElementById("lightningInput");

let graph = new Graph(3);
let color = {"r":0.5,"g":0.9,"b":0.8};
graph.setRGBColor(color.r,color.g,color.g);

colorInput.addEventListener("input",event => {
    color = hexToRgb(colorInput.value);
    graph.setRGBColor(color.r, color.g, color.b);
    changeGraph(graph)
});

subdivisionsInput.addEventListener("input", event => {
    graph = new Graph(parseInt(subdivisionsInput.value));
    graph.setRGBColor(color.r, color.g, color.b);
    changeGraph(graph);
})

lightningInput.addEventListener("input", event => {
    engine.renderWithLighting = lightningInput.checked
})


const positions = graph.getPositions();
const indices = [...Array(positions.length).keys()];
const colors = graph.getColors();
const normals = graph.getNormals();


const canvasElement = document.getElementById("glcanvas");
const engine = new Renderer({
    "canvasElement": canvasElement,
    "positions": positions,
    "indices": indices,
    "colors": colors,
    "normals": normals
});


const changeGraph = (newGraph) => {
    engine.setColors(newGraph.getColors())
    engine.setPositions(newGraph.getPositions())
    engine.setNormals(newGraph.getNormals())
}
