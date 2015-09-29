function initUI() {
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

	document.getElementById("select_mode").addEventListener("change", function() {
		a1.mode = getMode();
		startSearch();
	});
}

function getMode() {
	var e = document.getElementById("select_mode");
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