var ipc = require('ipc');

ipc.on('asynchronous-reply', function(arg) {
	console.log(arg); // prints "pong"
});
if(document.getElementsByClassName("Hero__login").length > 0){
	document.getElementsByClassName("Hero__login")[0].click();
	document.getElementsByClassName("LoginModal__backdrop")[0].style.backgroundColor = "rgba(51,51,51,0.3)";
	document.getElementsByClassName("LoginModal__backdrop")[0].onclick = function(event){
		event.stopPropagation();
	};
	document.getElementsByClassName("LoginModal__close")[0].style.display = 'none';
}
else{

}
/*
 	https://github.com/lloeki/unelastic
 */
(function () {

	var debug = 0;

	var MODES = { 'CSS':    'css',
		'JS':     'js',
		'HYBRID': 'hybrid',
		'NATIVE': 'native' };

	var defaultMode = MODES.JS;
	var modeMap = { '.*\\.pdf$': MODES.CSS,
		'play\\.google\\.com/music/listen': MODES.CSS };

	detectMode = function () {
		var location = document.location;
		var mode;

		for (var re in modeMap) {
			if (modeMap.hasOwnProperty(re)) {
				if ((new RegExp(re)).test(location)) {
					mode = modeMap[re];
					if (debug == 1) {
						console.log("mode " + mode + " matched with: " + re)
					}
					break;
				}
			}
		}

		return (mode || defaultMode);
	};

	var scrollHandler = function (e, mode) {
		var stopScroll = false;
		var stopScrollX = false;
		var stopScrollY = false;

		var deltaX = e.wheelDeltaX;
		var deltaY = e.wheelDeltaY;

		var scrollToX = window.scrollX - deltaX;
		var scrollToY = window.scrollY - deltaY;

		var scrollMaxX = document.body.scrollWidth - window.innerWidth;
		var scrollMaxY = document.body.scrollHeight - window.innerHeight;

		var scrollX = window.scrollX;
		var scrollY = window.scrollY;

		if (debug > 1) {
			console.log("body", document.body.scrollWidth, document.body.scrollHeight);
			console.log("window", window.innerWidth, window.innerHeight);
			console.log("scroll", window.scrollX, window.scrollY);
			console.log("scrollMax", scrollMaxX, scrollMaxY);
			console.log("delta", deltaX, deltaY);
		}

		/*if (deltaX > 0 && scrollX <= 0) {
			stopScrollX = true;
			scrollToX = 0;
		}*/

		if (deltaY > 0 && scrollY <= 0) {
			stopScrollY = true;
			scrollToY = 0;
		}

		/*if (deltaX < 0 && scrollX >= scrollMaxX) {
			stopScrollX = true;
			scrollToX = scrollMaxX;
		}*/

		if (deltaY < 0 && scrollY >= scrollMaxY) {
			stopScrollY = true;
			scrollToY = scrollMaxY;
		}

		if (debug > 0) {
			console.log("stopScroll", stopScrollX, stopScrollY);
		}

		if (mode == MODES.HYBRID) {
			document.documentElement.classList.remove('unelasticX');
			document.documentElement.classList.remove('unelasticY');

			if (stopScrollX) {
				document.documentElement.classList.add('unelasticX');
			}

			if (stopScrollY) {
				document.documentElement.classList.add('unelasticY');
			}
		}

		if (mode == MODES.JS) {
			if (stopScrollX || stopScrollY) {
				e.preventDefault();
				e.stopPropagation();
				window.scroll(scrollToX, scrollToY);
			}

			return (stopScrollX || stopScrollY);
		}
	};


	/* main */

	var mode = detectMode();

	if (mode == MODES.JS || mode == MODES.HYBRID) {
		document.addEventListener('mousewheel',
			function (e) { scrollHandler(e, mode) },
			false);
	}


	if (mode == MODES.CSS) {
		document.addEventListener('DOMContentLoaded', function () {
			document.documentElement.classList.add('unelastic');
		});
	}

})();
/**
 *
 */
process.nextTick(function(){
	ipc.send('asynchronous-message', 'ready');
});
