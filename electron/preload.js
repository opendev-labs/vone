const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    getServerPort: () => ipcRenderer.invoke('get-server-port'),
    getProjectsDir: () => ipcRenderer.invoke('get-projects-dir'),
    platform: process.platform,
    isElectron: true
});
