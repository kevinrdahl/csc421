function initUI() {
	//buttons
	document.getElementById("btn_generate").addEventListener("click", function() {
		generateInstance();
	});
	document.getElementById("btn_step").addEventListener("click", function() {
		stepSearch();
	});
	document.getElementById("btn_run").addEventListener("click", function() {
		runSearch();
	});
	document.getElementById("btn_reset").addEventListener("click", function() {
		startSearch();
	});
	document.getElementById("btn_stats").addEventListener("click", function() {
		collectSearchStats();
	});
	document.getElementById("btn_runNew").addEventListener("click", function() {
		generateInstance();
		startSearch();
		runSearch();
	});

	//selects
	document.getElementById("select_mode").addEventListener("change", function() {
		a1.mode = getMode();
		startSearch();
	});
	document.getElementById("select_heuristic").addEventListener("change", function() {
		a1.heuristic = getHeuristic();
		startSearch();
	});

	//text inputs
	document.getElementById("txt_fromNode").addEventListener("change", function() {
		startSearch();
	});
	document.getElementById("txt_toNode").addEventListener("change", function() {
		startSearch();
	});
}

function getMode() {
	var e = document.getElementById("select_mode");
	return e.options[e.selectedIndex].value;
}

function getHeuristic() {
	var e = document.getElementById("select_heuristic");
	return e.options[e.selectedIndex].value;
}

function getFromNode() {
	var e = document.getElementById("txt_fromNode");
	return e.value;
}

function getToNode() {
	var e = document.getElementById("txt_toNode");
	return e.value;
}