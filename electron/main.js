const { app, BrowserWindow, Menu, Tray, ipcMain } = require('electron');
const path = require('path');
const { startLocalServer } = require('./server');

let mainWindow;
let tray;
let serverPort = 3456;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1000,
        minHeight: 700,
        icon: path.join(__dirname, '../build/icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: true
        },
        backgroundColor: '#050507',
        titleBarStyle: 'default',
        frame: true
    });

    // Load the app
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    // Auto-authenticate for desktop app
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.executeJavaScript(`
            // Set authentication state
            localStorage.setItem('void_auth', JSON.stringify({
                isAuthenticated: true,
                user: {
                    name: 'Desktop User',
                    email: 'user@vone.app',
                    role: 'Owner'
                }
            }));
            
            // Navigate to dashboard if not already there
            if (!window.location.hash || window.location.hash === '#/') {
                window.location.hash = '/dashboard';
            }
        `);
    });


    // Create application menu
    const template = [
        {
            label: 'vONE',
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function createTray() {
    const iconPath = path.join(__dirname, '../build/icon.png');
    tray = new Tray(iconPath);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'vONE - opendev-labs',
            enabled: false
        },
        { type: 'separator' },
        {
            label: 'Show vONE',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                }
            }
        },
        { type: 'separator' },
        {
            label: 'Quit',
            click: () => {
                app.quit();
            }
        }
    ]);

    tray.setToolTip('vONE - Hyper-Intelligent Virtual Environment Manager');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        if (mainWindow) {
            mainWindow.show();
        }
    });
}

app.whenReady().then(async () => {
    // Start local server for *.vone.app routing
    try {
        await startLocalServer(serverPort);
        console.log(`Local server started on port ${serverPort}`);
    } catch (error) {
        console.error('Failed to start local server:', error);
    }

    createWindow();
    createTray();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// IPC handlers
ipcMain.handle('get-server-port', () => {
    return serverPort;
});

ipcMain.handle('get-projects-dir', () => {
    return path.join(app.getPath('home'), 'void-projects');
});
