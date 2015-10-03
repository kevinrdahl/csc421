function drawInstance() {
	var i, j;
	var node, otherNode;
	var coords;
	var costStr;

	context.clearRect(0, 0, canvas.width, canvas.height);

	//for each node...
	for (i = 0; i < a1.nodes.length; i++) {
		node = a1.nodes[i];

		//console.log(node.toString());

		//draw it
		drawNode(node, "black");

		//draw connections to its neighbors
		for (j = 0; j < node.neighbors.length; j++) {
			if (node.neighbors[j].name > this.name) {
				drawEdge(node, node.neighbors[j], "black");	
			}
		}
	}

	//draw names (so they're on top)
	context.fillStyle = "red";
	//context.strokeStyle = "black";
	//context.lineWidth = 1;

	for (i = 0; i < a1.nodes.length; i++) {
		node = a1.nodes[i];
		costStr = (node.cost == -1) ? "?" : stringRound(node.cost, 1);
		coords = [
			Math.min(Math.round(node.coords[0]*a1.scale + a1.scale/2), a1.scale*100 - 50), 
			Math.min(Math.round(node.coords[1]*a1.scale + a1.scale*2), a1.scale*100 - 5)
		];
		context.fillText(node.name + ": " + costStr, coords[0], coords[1]);
		//context.strokeText("(" + node.name + ")", coords[0], coords[1]);
	}
}

function drawState() {	
	var i,j;
	var node;

	for (i = 0; i < 26; i++) {
		node = a1.nodes[i];
		if (node.cost != -1) {
			drawNode(node, "blue");
		}
	}

	drawNode(a1.targetNode, "red");
	drawNode(getNodeByName(getFromNode()), "orange");
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

function drawPath(searchNode) {
	while (searchNode.parent != null) {
		drawEdge(searchNode.node, searchNode.parent.node, "blue");
		searchNode = searchNode.parent;
	}
}

//ugly!
function stringRound(num, places) {
	var split = num.toString().split(".");

	if (split.length == 2) {
		var str = split[0] + ".";

		if (split[1].length <= places) {
			str += split[1];
		} else {
			var str2 = Math.round(parseFloat(split[1].substr(0,places) + "." + split[1].substr(places))).toString();
			for (var i = places - str2.length; i > 0; i--) {
				str += "0";
			}
			str += str2;
		}

		return str;
	} else {
		return split[0];
	}
}