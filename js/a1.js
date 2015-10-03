var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

var nodesCreated, nodesVisited, maxNodes, timeTaken, pathFound, completePaths;

function initProject() {
	window.canvas = document.getElementById("display");
	window.context = canvas.getContext("2d");
	context.font = "18px Arial";

	window.a1 = {
		scale:8,
		mode:'BFS',
		heuristic:'distance'
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
		node = new Node(alphabet[i], i, [Math.random()*100, Math.random()*100]);
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
		a1.nodes[i].hCost = -1;
		a1.nodes[i].fCost = -1;
	}
	a1.currentNode.cost = 0;

	drawInstance();
	drawState();
}

function stepSearch() {
	console.log("Nope!");
}

function runSearch() {
	console.log("\n" + a1.mode + " SEARCH\n====================");

	switch(a1.mode) {
		case "BFS":
			findPathBFS();
			break;
		case "DFS":
			findPathDFS();
			break;
		case "IDS":
			findPathIDS();
			break;
		case "GBFS":
			findPathGBFS();
			break;
		case "A*":
			findPathAStar();
			break;
		default:
			console.log("Uh oh!");
	}
}

function collectSearchStats () {
	var avgNodesCreated = 0;
	var avgNodesVisited = 0;
	var avgMaxNodes = 0;
	var avgTimeTaken = 0;
	var pathsFound = 0;

	for (var i = 0; i < 100; i++) {
		generateInstance();
		runSearch();

		avgNodesCreated += nodesCreated;
		avgNodesVisited += nodesVisited;
		avgMaxNodes += maxNodes;
		avgTimeTaken += timeTaken;
		if (pathFound) {
			pathsFound++;
		}
	}

	avgNodesCreated /= 100;
	avgNodesVisited /= 100;
	avgMaxNodes /= 100;
	avgTimeTaken /= 100;

	console.log("\n==================");
	console.log("Avg Nodes Created: " + avgNodesCreated);
	console.log("Avg Nodes Visited: " + avgNodesVisited);
	console.log("Avg Max Nodes: " + avgMaxNodes);
	console.log("Avg Time Taken: " + avgTimeTaken/1000);
	console.log("Paths Found: " + pathsFound);
}

function findPathBFS () {
	var startNode = new SearchNode(a1.currentNode);
	var toVisit = [startNode];
	var sNode, sNodeNext, node;
	var i;
	var startTime = Date.now();
	var path;

	var currentNodes = 1;

	initRunStats();

	while (toVisit.length > 0 && !pathFound) {
		sNode = toVisit.shift();
		nodesVisited++;

		//some other path here is superior, don't expand
		if (sNode.cost > sNode.node.cost) {
			currentNodes--;
			continue;
		}
		
		//for each neighbor city...
		for (i = 0; i < sNode.node.neighbors.length; i++) {
			node = sNode.node.neighbors[i];

			//if not already in this path, create a search node
			if (!(sNode.hasAncestor(node))) {
				sNodeNext = sNode.createChild(node);
				nodesCreated++;

				//if it's the destination, add to the list of complete paths
				if (node == a1.targetNode) {
					//completePaths.push(sNodeNext);
					//currentNodes++;
					path = sNodeNext;
					pathFound = true;
					console.log("Path " + completePaths.length + ", " + sNodeNext.printPath() + ", cost: " + sNodeNext.cost);
					break;
				} 

				//update its minimum cost
				if (node.cost == -1 || sNodeNext.cost < node.cost) {
					//add it to toVisit (if not updating the minimum cost then it will be or has been visited)
					if (node != a1.targetNode) {
						toVisit.push(sNodeNext);
						currentNodes++;
					}
					node.cost = sNodeNext.cost;
				}
			}
		}
	}

	//findBestCompletePath();

	timeTaken = Date.now() - startTime;
	maxNodes = currentNodes+1; //any node not added to toVisit is discarded, so there's only ever the 1 extra
	printRunStats();


	drawInstance();
	drawState();
	if (pathFound) {
		drawPath(path);
	}
}

function findPathDFS() {
	var startTime = Date.now();
	var startNode;

	initRunStats();

	startNode = new SearchNode(a1.currentNode);
	findPathDFSRecursive(startNode);
	findBestCompletePath();

	timeTaken = Date.now()-startTime;
	printRunStats();

	drawInstance();
	drawState();
	drawPath(completePaths[0]);
}

function findPathDFSRecursive(sNode, depth) {
	depth = (typeof depth === "undefined") ? -1 : depth;
	if (depth == 0) {
		return;
	}

	nodesVisited++;

	var i;
	var node;
	var sNodeNext;

	for (i = 0; i < sNode.node.neighbors.length; i++) {
		node = sNode.node.neighbors[i];

		if (!(sNode.hasAncestor(node))) {
			sNodeNext = sNode.createChild(node);
			nodesCreated++;

			if (sNodeNext.pathLength > maxNodes) {
				maxNodes = sNodeNext.pathLength;
			}

			if (node.cost == -1 || sNodeNext.cost <= node.cost) {
				node.cost = sNodeNext.cost;

				if (node != a1.targetNode) {
					findPathDFSRecursive(sNodeNext, depth-1);
				}

				if (pathFound) {
					break;
				}
			}

			//if it's the destination, add to the list of complete paths
			if (node == a1.targetNode) {
				pathFound = true;
				completePaths.push(sNodeNext);
				console.log("Path " + completePaths.length + ", " + sNodeNext.printPath() + ", cost: " + sNodeNext.cost);
				break;
			}
		}
	}
}

function findPathIDS() {
	var startTime = Date.now();
	var startNode;
	var depth;

	initRunStats();

	startNode = new SearchNode(a1.currentNode);
	for (depth = 2; depth < 26 && completePaths.length == 0; depth++) {
		findPathDFSRecursive(startNode, depth);
	}
	findBestCompletePath();

	timeTaken = Date.now()-startTime;
	printRunStats();

	drawInstance();
	drawState();
	drawPath(completePaths[0]);
}

function findPathGBFS() {
	var startTime = Date.now();
	var startNode = new SearchNode(a1.currentNode);
	var queue = [startNode];
	var sNode, sNodeNext;
	var node;
	var i;
	var path;

	var sNodes = [];
	sNodes[startNode.node.index] = startNode;
	setHCost(startNode.node);

	initRunStats();
	while (queue.length > 0 && !pathFound) {
		var names = [];
		for (var j = 0; j < queue.length; j++) {
			names.push(queue[j].node.name);
		}
		console.log("queue: " + JSON.stringify(names));

		if (queue.length > maxNodes) {
			maxNodes = queue.length;
		}

		sNode = queue.shift();
		nodesVisited++;
		
		while (sNode.counter < sNode.node.neighbors.length) {
			node = sNode.node.neighbors[sNode.counter];
			sNode.counter++;
			console.log("  Successor " + node.name);

			if (node.hCost == -1) {
				setHCost(node);
			}
			sNodeNext = sNode.createChild(node);
			nodesCreated++;

			if (sNode.hasAncestor(node) || sNodeNext.cost < node.cost) {
				console.log("    nope");
				continue;
			}

			node.cost = sNodeNext.cost;

			if (node == a1.targetNode) {
				path = sNodeNext;
				pathFound = true;
				break;
			}

			//GREED
			if (node.hCost < sNode.node.hCost) {
				console.log("    this one looks good");
				queue.unshift(sNodeNext, sNode);
				break;
			} else {
				insertSorted(queue, sNodeNext);
				if (queue.length > maxNodes) {
					maxNodes = queue.length;
				}
			}
		}
	}


	timeTaken = Date.now()-startTime;
	printRunStats();

	drawInstance();
	drawState();
	if (pathFound) {
		console.log("PATH FOUND");
		console.log(path.printPath());
		drawPath(path);
	}
}

function findPathAStar () {
	var startTime = Date.now();

	var openSet = [];
	var sNodes = [];
	var current, next;
	var path;
	var i;
	var cost;

	initRunStats();
	maxNodes = 26;
	nodesCreated = 26;

	for (i = 0; i < 26; i++) {
		sNodes.push(new SearchNode(a1.nodes[i]));
		setHCost(a1.nodes[i]);
	}
	openSet.push(sNodes[a1.currentNode.id]);
	openSet[0].node.fCost = openSet[0].node.cost;

	//DO IT
	while (openSet.length > 0) {
		current = getLowest(openSet);
		nodesVisited++;

		console.log("Consider " + current.node.name);
		current.closed = true;

		for (i = 0; i < current.node.neighbors.length; i++) {
			next = sNodes[current.node.neighbors[i].id];

			var dist = a1.distance[current.node.id][next.node.id];

			console.log("  Neighbor " + next.node.name);

			if (next.closed) {
				console.log("    CLOSED");
				continue;
			}

			cost = current.node.cost + a1.distance[current.node.id][next.node.id];

			if (next.node.cost == -1 || cost < next.node.cost) {
				if (next.node.cost == -1) {
					setHCost(next.node);
					openSet.unshift(next); //should make my lame getLowest faster, in a greedy sense
				}
				next.node.cost = cost;
				next.node.fCost = next.node.cost + next.node.hCost;
				next.parent = current;

				//console.log("    Update it: " + stringRound(next.node.cost, 1) + " | " + stringRound(next.node.fCost, 1));
				console.log("    Update it: " + Math.round(next.node.cost) + " | " + Math.round(next.node.fCost));
			}

			if (next.node == a1.targetNode) {
				path = next;
				pathFound = true;
				break;
			}
		}

		if (pathFound) {
			break;
		}
	}

	timeTaken = Date.now()-startTime;
	printRunStats();

	drawInstance();
	drawState()

	if (pathFound) {
		console.log("PATH FOUND");
		console.log(path.printPath());
		drawPath(path);
	}
}

//a proper implementation would use a min heap
function getLowest (list) {
	var min = list[0];
	var minIndex = 0;

	for (var i = 1; i < list.length; i++) {
		if (list[i].node.fCost < min.node.fCost) {
			minIndex = i;
			min = list[i];
		}
	}

	list.splice(minIndex, 1);
	return min;
}

function setHCost(node) {
	if (a1.heuristic == "distance") {
		node.hCost = a1.distance[node.id][a1.targetNode.id];
	} else {
		node.hCost = Math.min(
			Math.abs(node.coords[0] - a1.targetNode.coords[0]),
			Math.abs(node.coords[1] - a1.targetNode.coords[1])
		)
	}
}


function insertSorted(queue, sNode) {
	if (queue.length == 0) {
		queue.push(sNode);
	} else {
		queue.splice(insertSearch(queue, sNode.node.hCost), 0, sNode);	
	}
}

//reinserting current node at start means queue may not be completely sorted, so start from end
function insertSearch(queue, hCost) {
	var i, h;

	for (i = queue.length-1; i >= 0; i--) {
		h = queue[i].node.hCost;
		if (h < hCost) {
			return i+1;
		}
	}

	return 0;
}

function findBestCompletePath() {
	if (completePaths.length > 0) {
		completePaths.sort(function(a, b) {
			if (a.cost < b.cost) {
				return -1;
			} else if (a.cost > b.cost) {
				return 1;
			} else {
				return 0;
			}
		});

		pathFound = true;
		console.log("\nVERY SUPER BEST PATH:");
		console.log(completePaths[0].printPath() + " (" + completePaths[0].cost + ")");
	} else {
		console.log("No path found :(");
	}
}

function initRunStats() {
	completePaths = [];

	nodesCreated = 1;
	nodesVisited = 0;
	maxNodes = 0;
	timeTaken = 0;
	pathFound = false;
}

function printRunStats() {
	console.log("Nodes Created: " + nodesCreated);
	console.log("Nodes Visited: " + nodesVisited);
	console.log("Max Nodes: " + maxNodes);
	console.log("Time Taken: " + timeTaken/1000);
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