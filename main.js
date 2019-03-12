const electron = require('electron');
const path = require('path');

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

// Reload application on changes in src folder
require('electron-reload')(path.join(__dirname, 'src'), {
  ignored: /^.*\.(json|txt)$/,
  electron: require(path.join(__dirname, 'node_modules', 'electron'))
});

let mainWindow;
app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 1000, height: 600, webPreferences: { nodeIntegration: true } });

  // Open Development Tools
  mainWindow.openDevTools();

  mainWindow.loadURL('file://' + __dirname + '/public/index.html');
});

app.on('window-all-closed', () => {
  app.quit();
});

//change window size depending on if at login screen or inside the program
let { ipcMain } = electron;
ipcMain.on('maximize', function(e) {
  mainWindow.maximize();
});
ipcMain.on('minimize', function(e) {
  mainWindow.restore();
});
