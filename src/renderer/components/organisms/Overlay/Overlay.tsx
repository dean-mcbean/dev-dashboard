/** @jsxImportSource @emotion/react */

import { useEffect, useMemo, useRef, useState } from "react";
import { buttonGroup, buttonGroupDivider, buttonPanel, closeBox, controls, dragBox, folderName, header, maximizeBox, minimizeBox, motionOverlayContainer, outputField, tab, tabs } from "./Overlay.styles";
import { CommandButton } from "../../molecules/CommandButton/CommandButton";
import { GrGithub, GrStatusInfo } from "react-icons/gr";
import { OutputField } from "../../molecules/OutputField/OutputField";
import { CgGitPull } from "react-icons/cg";
import { IoPush } from "react-icons/io5";
import { IoIosInformationCircle } from "react-icons/io";
import { IoDownload } from "react-icons/io5";
import { IoDownloadOutline } from "react-icons/io5";
import { IoAddCircle } from "react-icons/io5";
import { IoAddCircleOutline } from "react-icons/io5";
import { IoCheckboxOutline } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";
import { ipcRenderer } from "electron";
import { IoTerminal } from "react-icons/io5";
import { IoFolder } from "react-icons/io5";
import { FaMinus } from "react-icons/fa";
import { TiMinus } from "react-icons/ti";
import { HiMinusSmall } from "react-icons/hi2";
import { HiMiniMinusSmall } from "react-icons/hi2";
import { MdDeleteOutline } from "react-icons/md";
import { AppTab, useAppState } from "../../../contexts/AppStateContext";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { useOutput } from "../../../contexts/OutputContext";
import { GoScreenFull } from "react-icons/go";
import { RxEnterFullScreen } from "react-icons/rx";
import { MdOutlineFullscreen } from "react-icons/md";
import { FaRegWindowRestore } from "react-icons/fa6";
import { BiWindows } from "react-icons/bi";
import { FolderPage } from "../FolderPage/FolderPage";
import { useStorage } from "../../../contexts/StorageContext";
import { FaNoteSticky } from "react-icons/fa6";
import { NotesPage } from "../NotesPage/NotesPage";
import { LuListTodo } from "react-icons/lu";
import { TodoPage } from "../TodoPage/TodoPage";
import { Icon } from "../../atoms/Icon/Icon";
import { VscGitCommit } from "react-icons/vsc";
import { VscDebugStart } from "react-icons/vsc";
import { MdOutlineBuildCircle } from "react-icons/md";
import { LuUploadCloud } from "react-icons/lu";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaDev } from "react-icons/fa6";
import { GitPage } from "../GitPage/GitPage";

type Command = {
  name: string;
  command: string;
  icon: JSX.Element;
  group: string;
  available?: boolean;
}

const allCommands: Command[] = [
  {
    name: 'Git Push',
    command: 'git push',
    icon: <LuUploadCloud />,
    group: 'git'
  },
  {
    name: 'Git Commit',
    command: 'git commit -m "{Commit Message}"',
    icon: <VscGitCommit />,
    group: 'git'
  },
  {
    name: 'Git Pull',
    command: 'git pull',
    icon: <IoDownloadOutline />,
    group: 'git'
  },
  {
    name: 'Git Status',
    command: 'git status',
    icon: <IoMdInformationCircleOutline />,
    group: 'git'
  },
  {
    name: 'Git Add',
    command: 'git add .',
    icon: <IoAddCircleOutline />,
    group: 'git'
  },
  {
    name: 'NPM Install',
    command: 'npm install',
    icon: <IoCheckboxOutline />,
    group: 'npm',
    available: true
  },
  {
    name: 'NPM Start',
    command: 'npm start',
    icon: <VscDebugStart />,
    group: 'npm'
  },
  {
    name: 'NPM Build',
    command: 'npm run build',
    icon: <MdOutlineBuildCircle />,
    group: 'npm'
  },
  {
    name: 'NPM Dev',
    command: 'npm run dev',
    icon: <FaDev />,
    group: 'npm'
  }
]

export const motionOverlaySize = 120;
export const borderWidth = 4;

export const Overlay = () => {
  const {currentTab, setCurrentTab} = useAppState();
  const { clearOutput, runCommand } = useOutput();
  const { currentFolder } = useStorage();

  const [availableCommands, setAvailableCommands] = useState<Command[]>(allCommands);

  const [currentlyFullScreen, setCurrentlyFullScreen] = useState(false);

  const tabClick = (tab: AppTab) => {
    setCurrentTab(tab);
  }

  useEffect(() => {
    // check which npm scripts are available
    runCommand('npm run', true).then((output) => {
      setAvailableCommands((prev) => {
        const newCommands = prev;
        const lines = output.split('\n');
        const commands = lines.map((line) => line.trim().split(' ')[0]);
        console.log(commands, lines, output)
        if (commands.includes('start')) {
          newCommands.find((command) => command.name === 'NPM Start')!.available = true;
        }
        if (commands.includes('build')) {
          newCommands.find((command) => command.name === 'NPM Build')!.available = true;
        }
        if (commands.includes('dev')) {
          newCommands.find((command) => command.name === 'NPM Dev')!.available = true;
        }
        console.log(newCommands)
        return newCommands;
      });
    });

    // check if this is a git repository
    runCommand('git status', true).then((output) => {
      setAvailableCommands((prev) => {
        const newCommands = prev;
        if (!output.includes('fatal: not a git repository')) {
          newCommands.map((command) => {
            if (command.group === 'git') {
              command.available = true;
            }
          });
        }
        return newCommands;
      });
    });
  }, [ currentFolder ])

  const usableCommands = useMemo(() => {
    const groupedCommands: { [key: string]: Command[] } = {};
    availableCommands.forEach((command) => {
      if (command.available) {
        if (groupedCommands[command.group]) {
          groupedCommands[command.group].push(command);
        } else {
          groupedCommands[command.group] = [command];
        }
      }
    });
    return groupedCommands;
  }, [availableCommands, currentFolder]);

  return (
    <div id="motionOverlay" css={motionOverlayContainer(motionOverlaySize)}>
      <div css={header}>
        <div css={tabs}>
          <div css={tab(currentTab == 'folders')} onClick={() => tabClick('folders')}> <IoFolder /></div>
          {currentFolder && <div css={tab(currentTab == 'commandLine')} onClick={() => tabClick('commandLine')}><IoTerminal /></div>}
          {currentFolder && <div css={tab(currentTab == 'notes')} onClick={() => tabClick('notes')}><FaNoteSticky /></div>}
          <div css={tab(currentTab == 'todo')} onClick={() => tabClick('todo')}><LuListTodo /></div>
          {currentFolder && <div css={tab(currentTab == 'git')} onClick={() => tabClick('git')}><GrGithub /></div>}
        </div>
        <div css={controls}>
          <div css={minimizeBox} onClick={() => window.electron.ipcRenderer.send('minimize-app')}>
            <HiMiniMinusSmall />
          </div>
          <div css={maximizeBox} onClick={() => {
            window.electron.ipcRenderer.send('maximize-app')
            setCurrentlyFullScreen(!currentlyFullScreen);
          }}>
            {currentlyFullScreen ? <BiWindows /> : <MdOutlineFullscreen />}
          </div>
          <div css={closeBox} onClick={() => window.electron.ipcRenderer.send('close-app')}>
            <IoCloseOutline />
          </div>
        </div>
        {currentFolder && <div css={folderName}>
          <Icon icon={currentFolder.icon} />
          {currentFolder.name}
        </div>}
      </div>
      {currentTab == 'folders' && (<FolderPage />)}
      {currentTab == 'commandLine' && (
        <div css={{display: 'flex'}}>
          <div css={outputField}>
            <OutputField />
          </div>
          <div css={buttonPanel}>
            {
              Object.keys(usableCommands).map((group, index) => {
                return (
                  <>
                  <div css={buttonGroup}>
                    {usableCommands[group].map((command, index) => {
                      return (
                        <CommandButton key={index} name={command.name} command={command.command} icon={command.icon} />
                      )
                    })}
                  </div>
                  <div css={buttonGroupDivider}></div>
                  </>
                )
              })
            }
            <div css={buttonGroup}>
              <IconButton icon={<MdDeleteOutline />} onClick={clearOutput}/>
            </div>
          </div>
        </div>
      )}
      {currentTab == 'notes' && (
        <NotesPage />
      )}
      {
        currentTab == 'todo' && (
          <TodoPage />
        )

      }
      {currentTab == 'git' && (
        <GitPage />
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
