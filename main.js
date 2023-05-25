const { app, BrowserWindow } = require('electron')
const express = require('express')
const path = require('path')

// Create an instance of the Express app
const expressApp = express()

// Configure the Express app
expressApp.use(express.json())
expressApp.use(express.urlencoded({ extended: true }))
expressApp.use(express.static(path.join(__dirname, 'index.js')))

// Define your Express app routes here

// Create a new BrowserWindow when Electron has finished initializing
app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  // Load your Express app in the BrowserWindow
  mainWindow.loadURL('http://localhost:5000/')

  // Open DevTools
  mainWindow.webContents.openDevTools()
})

// Quit the app when all windows are closed, except on macOS where it is common
// for applications and their menu bar to stay active until the user quits
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Re-create the BrowserWindow when the app is activated but no windows are open
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
