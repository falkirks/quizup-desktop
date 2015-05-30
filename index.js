'use strict';
const app = require('app');
const BrowserWindow = require('browser-window');
var ipc = require('ipc');
var fs = require("fs");
String.prototype.endsWith = function(suffix) {
	return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
var walk = function(dir) {
	var results = [];
	var list = fs.readdirSync(dir);
	list.forEach(function(file) {
		file = dir + '/' + file;
		var stat = fs.statSync(file);
		if (stat && stat.isDirectory()) results = results.concat(walk(file));
		else results.push(file)
	});
	return results
};
var files = walk(__dirname + "/lib");
var scripts = [];
var styles = [];
for(var i = 0; i < files.length; i++){
	if(files[i].endsWith(".js")){
		scripts.push(files[i]);
	}
	else if(files[i].endsWith(".css")){
		styles.push(files[i]);
	}
}

// report crashes to the Electron project
require('crash-reporter').start();

// prevent window being GC'd
let mainWindow = null;

app.on('window-all-closed', function () {
	app.quit();
});

app.on('ready', function () {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 600,
		show: false,
		icon: __dirname + "/icon.png",
		resize: true
	});
	mainWindow.loadUrl('https://quizup.com');
	//mainWindow.webContents.executeJavaScript(fs.readFileSync(__dirname + "/page.js", "utf8"));

	mainWindow.on('closed', function () {
		// deref the window
		// for multiple windows store them in an array
		mainWindow = null;
	});
	mainWindow.webContents.on('dom-ready', function () {
		//mainWindow.webContents.insertCSS(fs.readFileSync(__dirname + "/page.css", "utf8"));
	});
	mainWindow.webContents.on('did-finish-load', function(){
		for(var i = 0; i < scripts.length; i++) {
			mainWindow.webContents.executeJavaScript(fs.readFileSync(scripts[i], "utf8"));
		}
		for(var j = 0; j < styles.length; j++){
			mainWindow.webContents.insertCSS(fs.readFileSync(styles[j], "utf8"));
		}
	});
	ipc.on('asynchronous-message', function (event, arg) {
		console.log(arg);  // prints "ping"
		event.sender.send('asynchronous-reply', 'pong');
		switch (arg) {
			case 'ready':
				mainWindow.show();
				break;
			case 'hide':

				break;
		}
	});

	ipc.on('synchronous-message', function (event, arg) {
		console.log(arg);  // prints "ping"
		event.returnValue = 'pong';
	});
});
