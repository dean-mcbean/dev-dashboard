/** @jsxImportSource @emotion/react */

import { useEffect, useMemo, useRef, useState } from "react";
import { useOutput } from "../../../contexts/OutputContext";
import { useStorage } from "../../../contexts/StorageContext";
import { Icon, getAllIcons } from "../../atoms/Icon/Icon";
import { addLayerFormContainer, currentFolderMenu, folderAddButton, folderButton, folderButtonContainer, folderPageContainer, iconContainer, iconForm } from "./FolderPage.styles";
import { IoIosAdd } from "react-icons/io";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { useAppState } from "../../../contexts/AppStateContext";
import { BiPencil } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

export const FolderPage = () => {
  const { folders, setFolder, setCurrentFolder, currentFolder, deleteFolder } = useStorage();
  const { setCurrentTab } = useAppState();
  const [pageState, setPageState] = useState('folderbuttons');
  const [iconPage, setIconPage] = useState(0);
  const projectNameRef = useRef<HTMLInputElement>(null);
  const [folderPath, setFolderPath] = useState('');
  const [icon, setIcon] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');

  const handleAddFolder = () => {
    // Collect folder info and perform necessary actions
    const folderName = projectNameRef.current?.value || '';
    console.log("Folder Name:", folderName);
    console.log("Folder Path:", folderPath);

    if (folderName === '' || folderPath === '' || icon === '') {
      return;
    }

    console.log(editingId, folderName, folderPath, icon);

    const id = editingId || Date.now().toString();

    console.log(folders, id)

    setFolder({id, folder: {
      name: folderName,
      path: folderPath,
      icon: icon,
      id
    }});

    // Reset form fields
    projectNameRef.current!.value = '';
    setFolderPath('');
    setIcon('');
    setEditingId(null);

    // Return to folderbuttons state
    setPageState('folderbuttons');

  };

  const getDir = () => {
      window.electron.ipcRenderer.invoke('open-directory-dialog').then((result) => {
        setFolderPath(result);
      }
    );
  }

  const allIcons = useMemo(() => {
    return getAllIcons();
  }, []);

  const selectFolder = (id: string) => {
    setCurrentFolder(id);
  };

  const editFolder = (id: string) => {
    setEditingId(id);
    setPageState('addFolderForm');
  }

  useEffect(() => {
    if (!editingId) return;
    if (pageState !== 'addFolderForm') {
      setEditingId(null);
      return;
    }
    const folder = folders[editingId];
    projectNameRef.current!.value = folder.name;
    setFolderPath(folder.path);
    setIcon(folder.icon);
  }, [pageState]);

  const iconsToRender = useMemo(() => {
    return allIcons.filter((icon) => icon.includes(filterText));
  }, [allIcons, filterText, iconPage]);

  return (
    <div css={folderPageContainer}>
      {pageState === 'folderbuttons' && (
        <div css={folderButtonContainer}>
          {Object.entries(folders).map(([id, folder]) => (
            <div key={id} css={folderButton} onClick={() => selectFolder(id)}>
              <Icon icon={folder.icon} />
              {folder.name}
            </div>
          ))}
          <div css={folderAddButton} onClick={() => setPageState('addFolderForm')}>
            <IoIosAdd />
            Add Folder
          </div>
          {currentFolder && <div css={currentFolderMenu}>
            {currentFolder?.name}
            <BiPencil onClick={() => editFolder(currentFolder.id)}/>
            <MdDelete onClick={() => {
              deleteFolder(currentFolder.id);
              setCurrentFolder(null);
            }}/>
          </div>}
        </div>
      )}
      {pageState === 'addFolderForm' && (
        <div css={addLayerFormContainer}>
          <form>
            <label>
              Project Name:
              <input ref={projectNameRef} type="text"/>
            </label>
            <label>
              Folder Path:
              <button type="button" onClick={getDir}>Browse</button>
              <i>{folderPath}</i>
            </label>
            <div css={iconForm}>
              <label>
                Icon (Page {iconPage + 1}/{Math.ceil(iconsToRender.length / 100)}):
                {icon === '' ? (
                  <>
                  <input
                    type="text"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    placeholder="Filter icons"
                  />
                  <div css={iconContainer}>
                    {iconsToRender.splice(iconPage * 100, 100).map((icon) => (
                        <IconButton key={icon} iconName={icon} onClick={() => setIcon(icon)} />
                      ))}
                  </div>
                  <div css={{display: 'flex', justifyContent: 'center'}}>
                  <button type="button" onClick={() => setIconPage(iconPage - 1)} disabled={iconPage === 0}>Prev</button>
                  <button type="button" onClick={() => setIconPage(iconPage + 1)} disabled={iconPage === iconsToRender.length / 100}>Next</button>
                  </div>
                  </>
                ) : (
                  <IconButton iconName={icon} onClick={() => setIcon('')} />
                )}
              </label>
            </div>
            <div css={{display: 'flex', justifyContent: 'space-between'}}>
            <button type="button" onClick={() => setPageState('folderbuttons')}>
              Return
            </button>
            <button type="button" onClick={handleAddFolder}>
              {!editingId ? 'Add Folder' : 'Save Changes'}
            </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

/*
colors

red: #f74348
cyan: #15dbb7
yellow: #fac92d
black: #1a121b
*/
// ...


// ...


// ...
