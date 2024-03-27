import React, { createContext, useEffect, useRef, useState } from 'react';

export type ProjectFolder = {
  path: string;
  name: string;
  icon: string;
  id: string;
}

// Define the type for your context value
type StorageContextValue = {
  // Add your context properties and methods here
  getStorage: ({key, folder}: {key: string, folder?: ProjectFolder | null}) => Promise<any>;
  setStorage: ({key, folder, value}: {key: string, folder?: ProjectFolder | null, value: any}) => Promise<void>;
  folders: {[key: string] : ProjectFolder};
  setFolder: ({id, folder}: {id?: string, folder: ProjectFolder}) => Promise<void>;
  currentFolder: ProjectFolder | null;
  setCurrentFolder: (folder_id: string | null) => void;
  deleteFolder: (folder_id: string) => void;
};

// Create the initial context value
const initialContextValue: StorageContextValue = {
  // Initialize your context properties and methods here
  getStorage: async () => {},
  setStorage: async () => {},
  folders: {},
  setFolder: async () => {},
  currentFolder: null,
  setCurrentFolder: () => {},
  deleteFolder: () => {},
};

// Create the context
export const StorageContext = createContext<StorageContextValue>(initialContextValue);


// Define the props for the provider component
interface StorageProviderProps {
  children: React.ReactNode;
}

// Create the provider component
export const StorageProvider = ({ children }: StorageProviderProps) => {
  // Define your state or any other logic here
  const [folders, setFolders] = useState<{[key: string] : ProjectFolder}>({});
  const [currentFolder, setCurrentFolderState] = useState<ProjectFolder | null>(null);

  const setCurrentFolder = (folder_id: string | null) => {
    if (!folder_id) {
      setCurrentFolderState(null);
      window.electron.ipcRenderer.invoke('set-current-folder', null);
      return;
    }
    setCurrentFolderState(folders[folder_id]);
    window.electron.ipcRenderer.invoke('set-current-folder', folders[folder_id].path);
  }

  const getStorage = async ({key, folder}: {key: string, folder?: ProjectFolder | null}) => {
    return window.electron.ipcRenderer.invoke('store-get', folder?.id + '|' + key);
  }

  const setStorage = async ({key, folder, value} : {key: string, folder?: ProjectFolder | null, value: any}) => {
    return window.electron.ipcRenderer.invoke('store-set', folder?.id + '|' + key, value);
  }

  const getFolders = async () => {
    return getStorage({key: 'folders'});
  }

  const setFolder = async ({id, folder}: {id?: string, folder: ProjectFolder}) => {
    const folders = await getFolders();
    if (id) {
      folder.id = id;
      folders[id] = folder;
    } else {
      folder.id = Date.now().toString();
      folders[Date.now().toString()] = folder;
    }
    setFolders(folders);
    const fold = setStorage({key: 'folders', value: folders});
    setCurrentFolder(null);
    return fold;
  }

  const deleteFolder = async (folder_id: string) => {
    const new_folders = await getFolders();
    delete new_folders[folder_id];
    setFolders(new_folders);
    setStorage({key: 'folders', value: new_folders});
    setCurrentFolder(null);
  }

  useEffect(() => {
    getFolders().then((folders) => {
      if (!folders) {
        folders = {};
        setStorage({key: 'folders', value: folders});
      }
      setFolders(folders);
    });
  }, []);

  return (
    <StorageContext.Provider value={{
      getStorage,
      setStorage,
      folders,
      setFolder,
      currentFolder,
      setCurrentFolder,
      deleteFolder
    }}>
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => React.useContext(StorageContext);
