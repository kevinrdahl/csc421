var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function initProject() {
	window.canvas = document.getElementById("display");
	window.context = canvas.getContext("2d");
	context.font = "18px Arial";

	window.a1 = {
		scale:8,
		mode:'BFS'
	};

	initUI();

	generateInstance();
}

function generateInstance() {
	console.log("generateInstance");

	var node, otherNode;
	var i, j;

	a1.nodes = [];
	a1.distance = [];

	for (i = 0; i < 26; i++) {
		node = new Node(alphabet[i], [Math.random()*100, Math.random()*100]);
		a1.nodes.push(node);
	}

	for (i = 0; i < 26; i++) {
		node = a1.nodes[i];
		a1.distance[i] = [];
		for (j = 0; j < 26; j++) {
			otherNode = a1.nodes[j];
			if (i == j) {
				a1.distance[i].push(0);
			} else if (i > j) {
				a1.distance[i].push(a1.distance[j][i]);
			} else {
				a1.distance[i].push(vectorDistance(node.coords, otherNode.coords));
			}
		}
	}

	setNeighbors();


	startSearch();	
	drawInstance();
	drawState();
}

function setNeighbors() {
	console.log("setNeighbors");

	var numClosest = 5;
	var numToChoose = 3;
	var node, otherNode;
	var closest;
	var i, j, index;
	var nodes;

	//for each node...
	for (i = 0; i < 26; i++) {
		//copy the list of nodes, for sorting
		nodes = a1.nodes.slice();

		closest = [];
		node = a1.nodes[i];
		node.cost = 0;
		
		//set the cost of every other node to its distance from this node
		for (j = 0; j < 26; j++) {
			if (i == j)
				continue;
			otherNode = a1.nodes[j];
			otherNode.cost = a1.distance[i][j];
		}

		//sort nodes by cost, ascending
		nodes.sort(function(a,b) {
			if (a.cost < b.cost)
				return -1;
			if (a.cost > b.cost)
				return 1;
			return 0;
		});

		//take numClosest nearby nodes (skip first node, since it's this node)
		for (j = 0; j < numClosest; j++) {
			otherNode = nodes[j+1];
			closest.push(otherNode);
		}

		//randomly select numToChoose neighbors
		for (j = 0; j < numToChoose; j++){
			index = getRandomIndex(closest.length);
			otherNode = closest[index];
			closest.splice(index,1);

			connectNodes(node, otherNode);
		}
	}
}

function connectNodes(n1, n2) {
	if (n1.neighbors.indexOf(n2) == -1) {
		n1.neighbors.push(n2);
		n2.neighbors.push(n1);
	}
}

function startSearch() {
	a1.currentNode = getNodeByName(getFromNode());
	a1.targetNode = getNodeByName(getToNode());

	for (var i = 0; i < a1.nodes.length; i++) {
		a1.nodes[i].cost = -1;
	}
	a1.currentNode.cost = 0;

	switch(a1.mode) {
		case "BFS":
			a1.toVisit = [];
			break;
		default:
			break;
	}
}

function stepSearch(draw) {
	draw = (typeof draw === 'undefined') ? true : draw;

	var i, j;
	var node, otherNode;

	switch(a1.mode) {
		case "BFS":
			for (i = 0; i < a1.currentNode.neighbors.length; i++) {
				node = a1.currentNode.neighbors[i];
				if (a1.toVisit.indexOf(node) == -1) {
					a1.toVisit.push(node);
				}

			}
	}

	if (draw) {
		drawState();
	}
}

function runSearch() {

}

function getNodeByName(name) {
	var index = alphabet.indexOf(name);
	return a1.nodes[index];
}

function vectorDistance(v1, v2) {
	return Math.sqrt(Math.pow(v1[0] - v2[0], 2) + Math.pow(v1[1] - v2[1], 2));
}

function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}