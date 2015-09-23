function initProject() {
	window.canvas = document.getElementById("display");
	window.context = canvas.getContext("2d");
	context.font = "20px monospace";

	window.a1 = {
		scale:8
	};

	generateInstance();
	drawInstance();
}

function generateInstance() {
	console.log("generateInstance");

	var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var node;

	a1.nodes = [];

	for (var i = 0; i < 26; i++) {
		node = new Node(alphabet[i], [Math.random()*100, Math.random()*100]);
		a1.nodes.push(node);
	}

	setNeighbors();
}

function setNeighbors() {
	console.log("setNeighbors");

	var numClosest = 5;
	var numToChoose = 3;
	var node, otherNode;
	var closest;
	var i, j, index;

	//for each node...
	for (i = 0; i < 26; i++) {
		closest = [];
		node = a1.nodes[i];
		node.cost = 0;
		
		//set cost of every other node to distance from this node
		for (j = 0; j < 26; j++) {
			if (i == j)
				continue;
			otherNode = a1.nodes[j];
			otherNode.cost = vectorDistance(node.coords, otherNode.coords);
		}

		//sort nodes by cost, ascending
		a1.nodes.sort(function(a,b) {
			if (a.cost < b.cost)
				return -1;
			if (a.cost > b.cost)
				return 1;
			return 0;
		});

		//take numClosest nearby nodes (skip first node, since it's this node)
		for (j = 0; j < numClosest; j++) {
			otherNode = a1.nodes[j+1];

			if (node.neighbors.indexOf(otherNode) == -1)
				closest.push(otherNode);
		}

		//randomly choose numToChoose from closest (may already have some neighbors from previous iterations)
		while (node.neighbors.length < numToChoose) {
			index = getRandomIndex(closest.length);
			otherNode = closest[index];
			closest.splice(index,1);

			node.neighbors.push(otherNode);
			otherNode.neighbors.push(node);
		}

		resortNodes();
	}
}

function resortNodes() {
	//sort nodes by name for prettier printing
	a1.nodes.sort(function(a,b) {
		if (a.name < b.name)
			return -1;
		if (a.name > b.name)
			return 1;
		return 0;
	});
}

function drawInstance() {
	var i, j;
	var node, otherNode;
	var coords;

	context.clearRect(0, 0, canvas.width, canvas.height);

	//for each node...
	for (i = 0; i < a1.nodes.length; i++) {
		node = a1.nodes[i];

		console.log(node.toString());

		//draw it
		drawNode(node, "black");

		//draw connections to its neighbors (these will be drawn twice but oh well)
		for (j = 0; j < node.neighbors.length; j++) {
			drawEdge(node, node.neighbors[j], "black");
		}
	}

	//draw names (so they're on top)
	context.fillStyle = "red";
	//context.strokeStyle = "black";
	//context.lineWidth = 1;
	console.log()

	for (i = 0; i < a1.nodes.length; i++) {
		node = a1.nodes[i];
		coords = [
			Math.min(Math.round(node.coords[0]*a1.scale + a1.scale/2), a1.scale*100 - 15), 
			Math.min(Math.round(node.coords[1]*a1.scale + a1.scale*2), a1.scale*100 - 5)
		];
		context.fillText(node.name, coords[0], coords[1]);
		//context.strokeText("(" + node.name + ")", coords[0], coords[1]);
	}
}

function drawState() {

}

function drawNode(node, style) {
	context.fillStyle = style;
	context.fillRect(Math.round((node.coords[0]-0.5)*a1.scale), Math.round((node.coords[1]-0.5)*a1.scale), a1.scale, a1.scale);
}

function drawEdge(node1, node2, style) {
	context.strokeStyle = style;
	context.lineWidth = Math.max(1, Math.round(a1.scale/4));
	context.beginPath();
	context.moveTo(Math.round(node1.coords[0]*a1.scale), Math.round(node1.coords[1]*a1.scale));
	context.lineTo(Math.round(node2.coords[0]*a1.scale), Math.round(node2.coords[1]*a1.scale));
	context.stroke();
}

function vectorDistance(v1, v2) {
	return Math.sqrt(Math.pow(v1[0] - v2[0], 2) + Math.pow(v1[1] - v2[1], 2));
}

function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}