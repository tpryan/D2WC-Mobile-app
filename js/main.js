

var readyFunc = [];


ready(function () {
	replaceLinks();
});



function DOMReady () {
	for(var i=0, l=readyFunc.length; i<l; i++) {
		readyFunc[i]();
	}

	readyFunc = null;
	document.removeEventListener('DOMContentLoaded', DOMReady, false);
}

function ready (fn) {
	if (readyFunc.length == 0) {
		document.addEventListener('DOMContentLoaded', DOMReady, false);
	}

	readyFunc.push(fn);
}

function replaceLinks(){
	var links = document.querySelectorAll('a');
	
	for (i=0; i<links.length; i++){
		
		var link = links[i];
		link.addEventListener("click",replacePage, false);
	}
	
}

function replacePage(){
	event.preventDefault();
	var href= this.href;
	var stateObj = { foo: "bar" };
	
	
	var ajax = new XMLHttpRequest();
	ajax.open("GET",href,true);
	ajax.send();
	
	ajax.onreadystatechange=function(){
		if(ajax.readyState==4 && (ajax.status==200)){
			document.querySelector('html').innerHTML = ajax.responseText;
			history.pushState(stateObj, "page 2", href);
		}
	} 
	
}