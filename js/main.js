

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
	
	
	
	var ajax = new XMLHttpRequest();
	ajax.open("GET",href,true);
	ajax.send();


	ajax.onreadystatechange=function(){
		if(ajax.readyState==4 && (ajax.status==200)){
			var body = document.querySelector('body');

			var bodyContent =  grabBettwenTags(ajax.responseText, "body");
			var bodyID = grabBodyID(ajax.responseText);
			var bodyClasses = grabBodyClass(ajax.responseText);

			

			function returnToCenter(event){
				var body = document.querySelector('body');
				body.removeEventListener( 'webkitTransitionEnd', returnToCenter, false);
				body.innerHTML = bodyContent;
				body.id = bodyID;
				body.className = bodyClasses;
				history.pushState(null, null, href);

				window.addEventListener("popstate", 
					function(e) {

				   		var ajaxBack = new XMLHttpRequest();
						ajaxBack.open("GET",location.pathname,true);
						ajaxBack.send();


						ajaxBack.onreadystatechange=function(){
							var bodyBack = document.querySelector('body');
							var bodyBackContent =  grabBettwenTags(ajaxBack.responseText, "body");
							var bodyBackID = grabBodyID(ajaxBack.responseText);
							var bodyBackClasses = grabBodyClass(ajaxBack.responseText);

							function backToCenter(event){
								var body = document.querySelector('body');
								body.removeEventListener( 'webkitTransitionEnd', backToCenter, false);
								body.innerHTML = bodyBackContent;
								body.id = bodyBackID;
								body.className = bodyBackClasses;

								body.style.opacity = 1;
								body.style.left = 0;
								replaceLinks();
							}

							function moveToLeft(event){
								var body = document.querySelector('body');
								body.removeEventListener( 'webkitTransitionEnd', moveToLeft, false);
								body.addEventListener( 'webkitTransitionEnd', backToCenter, false);
								body.style.opacity = 0;
								body.style.left = "-100%"
							}

							body.addEventListener( 'webkitTransitionEnd', moveToLeft, false);
							body.style.left = "100%";

						}


					}
				);


				body.style.opacity = 1;
				body.style.left = 0;
				replaceLinks();
			}

			function moveToRight(event){
				var body = document.querySelector('body');
				body.removeEventListener( 'webkitTransitionEnd', moveToRight, false);
				body.addEventListener( 'webkitTransitionEnd', returnToCenter, false);
				body.style.opacity = 0;
				body.style.left = "100%"
			}


			body.addEventListener( 'webkitTransitionEnd', moveToRight, false);

			body.style.left = "-100%";


		}
	}		


	
}

function grabBettwenTags(html, tag){
	var tag = typeof tag !== 'undefined' ? tag : "p";
	var tagStart = html.indexOf("<" + tag);
	var start = html.indexOf(">", tagStart) + 1;
	var end = html.indexOf("</" + tag, start );
	return html.slice(start, end);
}

function grabBodyID(html){
	var result = "";
	var tagStart = html.indexOf("<body");
	var start = html.indexOf('id="', tagStart) + 4;
	var end = html.indexOf('"', start );

	if (start - tagStart < 20){
		if (end > start){
			result = html.slice(start, end);
		}
	}	

	console.log("start: 	'" + start + "'");
	console.log("end: 	'" + end + "'");
	console.log("result: 	'" + result + "'");
	

	return result.trim();
}

function grabBodyClass(html){
	var list = "";
	var result = "";
	var tagStart = html.indexOf("<body");
	var start = html.indexOf('class="', tagStart) + 7;
	var end = html.indexOf('"', start );
	
	if (start - tagStart < 20){
		if (end > start){
			list = html.slice(start, end);
		}
	}

	
	return list;
}

