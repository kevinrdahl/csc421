//yes, I know what node.js is

var Node = Class({
	constructor: function(name, id, coords) {
		this.name = name;
		this.id = id;
		this.coords = coords;
		this.neighbors = [];
		this.cost = -1;
		this.hCost = -1;

		this.fCost = -1;
	},

	toString: function() {
		var s = "Node " + this.name + 
			"\n  " + JSON.stringify(this.coords) +
			"\n  [";
		for (var i = 0; i < this.neighbors.length; i++) {
			if (i > 0)
				s += ", ";
			s += this.neighbors[i].name;
		}
		s += "]";

		return s;
	},

	getAStarCost: function() {
		return this.cost + this.hCost;
	}
});

var SearchNode = Class({
	constructor: function(node, parent) {
		this.node = node;
		this.parent = (typeof parent === "undefined") ? null : parent;
		this.counter = 0;
		this.closed = false;

		this.setCost();
	},

	hasAncestor: function(node) {
		if (this.parent == null) {
			return false;
		} else if (this.parent.node == node) {
			return true;
		} else {
			return this.parent.hasAncestor(node);
		}
	},

	createChild: function(node) {
		return new SearchNode(node, this);
	},

	changeParent: function(parent) {
		this.parent = parent;
		this.setCost();
	},

	setCost: function() {
		if (this.parent == null) {
			this.cost = 0;
			this.pathLength = 1;
		} else {
			this.cost = this.parent.cost + vectorDistance(this.node.coords, this.parent.node.coords);
			this.pathLength = this.parent.pathLength + 1;
		}
	},

	//prints the path TO this node
	printPath: function() {
		if (this.parent == null) {
			return this.node.name;
		} else {
			return this.parent.printPath() + "-" + this.node.name;
		}
	}
});