'use strict';
const app = require('app');
const BrowserWindow = require('browser-window');
var ipc = require('ipc');
var fs = require("fs");


// report crashes to the Electron project
require('crash-reporter').start();

// prevent window being GC'd
let mainWindow = null;

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
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
	mainWindow.webContents.on('did-finish-load', function () {
		mainWindow.webContents.executeJavaScript(fs.readFileSync(__dirname + "/page.js", "utf8"));
		mainWindow.webContents.insertCSS(fs.readFileSync(__dirname + "/page.css", "utf8"));
	});
	ipc.on('asynchronous-message', function (event, arg) {
		console.log(arg);  // prints "ping"
		event.sender.send('asynchronous-reply', 'pong');
		switch (arg) {
			case 'show':
				mainWindow.show();
				break;
		}
	});

	ipc.on('synchronous-message', function (event, arg) {
		console.log(arg);  // prints "ping"
		event.returnValue = 'pong';
	});
});
