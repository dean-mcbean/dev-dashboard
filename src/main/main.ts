/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { exec } from 'child_process';
import Store from 'electron-store';

const store = new Store()

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    width: 500,
    height: 500,
    icon: getAssetPath('happy.png'),
    transparent: true, // Make the window transparent
    frame: false, // Disable the default frame
    hasShadow: false, // Remove the shadow
    alwaysOnTop: true, // Make the window always on top
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  await mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);


ipcMain.handle('run-command', (event, command) => {
  return new Promise((resolve, reject) => {
    const directory = store.get('currentFolder') as string;
    try {
      exec(command, { cwd: directory }, (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error.message}`);
          resolve(error.message);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          resolve(stderr);
          return;
        }
        console.log(`stdout: ${stdout}`);
        resolve(stdout);
      });
    } catch (error) {
      resolve((error as Error).message);
    }
  });
});

ipcMain.on('close-app', () => {
  app.quit();
})

ipcMain.on('minimize-app', () => {
  mainWindow?.minimize();
})

ipcMain.on('maximize-app', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow?.unmaximize();
  } else {
    mainWindow?.maximize();
  }
})

ipcMain.handle('store-set', (event, key, value) => {
  return new Promise<void>((resolve) => {
    console.log('store-set', key, value);
    store.set(key, value);
    resolve();
  })
})

ipcMain.handle('store-get', (event, key) => {
  return new Promise((resolve, reject) => {
    const value = store.get(key);
    console.log('store-get', key, value);
    if (value) {
      resolve(value);
    } else {
      resolve(null);
    }
  })
})

ipcMain.on('store-delete', (event, key) => {
  store.delete(key);
})


ipcMain.handle('open-directory-dialog', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  if (result.canceled) {
    return null;
  } else {
    return result.filePaths[0]; // The selected directory path
  }
});

ipcMain.handle('set-current-folder', async (event, folder: string) => {
  store.set('currentFolder', folder);
});
