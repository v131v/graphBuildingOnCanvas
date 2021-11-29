class Vertex {

	constructor(id, x, y) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.r = 20;
		this.edges = [];
	}

	setEdge(vertex) {
		if (!this.hasEdge(vertex)) this.edges.push(vertex);
		if (!vertex.hasEdge(this)) vertex.setEdge(this);
	}

	hasEdge(vertex) {
		return this.edges.includes(vertex);
	}

	setCoord(x, y) {
		this.x = x;
		this.y = y;
	}

	inArea(x, y) {
		return this.r >= Math.sqrt(Math.pow(Math.abs(x-this.x), 2) + Math.pow(Math.abs(y-this.y), 2));
	}

};


class Graph {

	constructor() {
		this.vertexes = {};
		this.length = 0;
		this.selected = null;
		this.moveMod = false;
	}

	addVertex(...params) {
		this.vertexes[params[0]] = new Vertex(...params);
		this.length++;
		return this.vertexes[params[0]];
	}

	getById(id) {
		return this.vertexes[id]||null;
	}

}


let gr, loop, ctx;

window.onload = function() {

	let cnv = document.querySelector('#cnv');

	ctx = cnv.getContext('2d');

	gr = new Graph();


	cnv.onmousedown = function(event) {
		let newVert = true;
		gr.moveMod = true;

		for (let vertex in gr.vertexes) {
			if (gr.getById(vertex).inArea(event.offsetX, event.offsetY)) {
				if (event.ctrlKey && gr.selected && gr.selected !== vertex) {
					gr.getById(vertex).setEdge(gr.getById(gr.selected));
				}
				newVert = false;
				gr.selected = vertex;
			}
		}

		if (newVert && gr.selected) {
			gr.selected = null;
		} else if (newVert && !gr.selected) {
			gr.addVertex(gr.length, event.offsetX, event.offsetY);
		}
	};

	cnv.onmousemove = function(event) {
		if (!gr.moveMod || !gr.selected) return;
		gr.getById(gr.selected).setCoord(event.offsetX, event.offsetY);
	};

	cnv.onmouseup = function(event) {
		gr.moveMod = false;
	};


	loop = setInterval(() => {

		ctx.fillStyle = 'White';
		ctx.fillRect(0, 0, 400, 400);

		for (let vertex in gr.vertexes) {
			for (let i = 0; i < gr.getById(vertex).edges.length; i++) {
				
				ctx.beginPath();

				ctx.strokeStyle = 'Black';
				ctx.lineWidth = 2;
				ctx.moveTo(gr.getById(vertex).x, gr.getById(vertex).y);
				ctx.lineTo(gr.getById(vertex).edges[i].x, gr.getById(vertex).edges[i].y);
				ctx.stroke();

				ctx.closePath();

			}
		}

		for (let vertex in gr.vertexes) {
			
			ctx.beginPath();

			ctx.fillStyle = 'Red';
			ctx.arc(gr.getById(vertex).x, gr.getById(vertex).y, gr.getById(vertex).r, 0, 2*Math.PI);
			ctx.fill();

			if (vertex === gr.selected) {

				ctx.strokeStyle = 'Yellow';
				ctx.lineWidth = 5;
				ctx.stroke();

				ctx.strokeStyle = 'Black';
				ctx.lineWidth = 1;
				ctx.stroke();

			}

			ctx.closePath();

		}

	}, 20);

};