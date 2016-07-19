window.onload = function() {
	cb = function(){ 
		create_spritz(); 
	}; 
	var script=document.createElement('SCRIPT');
	script.src='spritz.js?callback=cb'; 
	script.onload=cb; 
	document.body.appendChild(script);
}