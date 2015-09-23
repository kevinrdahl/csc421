//yes, I know what node.js is

var Node = Class({
	constructor: function(name, coords) {
		this.name = name;
		this.coords = coords;
		this.neighbors = [];
		this.cost;
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
	}
})