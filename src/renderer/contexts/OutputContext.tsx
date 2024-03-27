import React, { createContext, useEffect, useState } from 'react';
import { useStorage } from './StorageContext';

// Define the initial state of the context
const initialList: OutputLine[] = [];

export type OutputLine = {
  id: string;
  content: string;
  type: 'input' | 'output' | 'error';
  collapsed?: boolean;
}

// Create the context
export const OutputContext = createContext<{
  output: OutputLine[];
  addToOutput: (item: OutputLine) => void;
  runCommand: (command: string, hide?: boolean) => Promise<string>;
  outputLoading?: boolean;
  updateOutputLine: (id: string, line: OutputLine) => void;
  clearOutput: () => void;
}>({
  output: initialList,
  addToOutput: () => {},
  runCommand: async () => '',
  outputLoading: false,
  updateOutputLine: () => {},
  clearOutput: () => {}
});

// Define the props for the provider component
interface OutputProviderProps {
  children: React.ReactNode;
}

// Create the provider component
export const OutputProvider = ({ children }: OutputProviderProps) => {
  const { getStorage, setStorage, currentFolder } = useStorage();

  const [output, setList] = useState<OutputLine[]>(initialList);
  const [outputLoading, setOutputLoading] = useState<boolean>(false);


  // Function to add an item to the output
  const addToOutput = (item: OutputLine) => {
    setList((prevList) => {
      const newlist = [...prevList, item];
      setStorage({key: 'output', folder: currentFolder, value: newlist});
      return [...prevList, item]
    });
  };

  const runCommand = async (command: string, hidden?: boolean) => {
    if (!hidden) {
      addToOutput({
        id: Date.now().toString(),
        content: '$ ' + command,
        type: 'input'
      });
      setOutputLoading(true)
    }
    try {
      const result = await window.electron.ipcRenderer.invoke('run-command', command);
      if (!hidden) {
        addToOutput({
          id: Date.now().toString(),
          content: result,
          type: 'output'
        });
        setOutputLoading(false)
      }
      return result;
    }
    catch (error: any) {
      console.log(error)
      if (!hidden) {
        addToOutput({
          id: Date.now().toString(),
          content: error.message,
          type: 'error'
        });
        setOutputLoading(false)
      }
      return error;
    }
  }

  const updateOutputLine = (id: string, line: OutputLine) => {
    const index = output.findIndex((line) => line.id === id);
    if (index !== -1) {
      const newOutput = [...output];
      newOutput[index] = line;
      setList(newOutput);
      setStorage({key: 'output', folder: currentFolder, value: newOutput});
    }
  }

  const clearOutput = () => {
    setList([]);
    setStorage({key: 'output', folder: currentFolder, value: []});
  }

  useEffect(() => {
    getStorage({key: 'output', folder: currentFolder}).then((output: OutputLine[]) => {
      console.log("OUTPUT", output)
      if (output) {
        setList(output);
      } else {
        setList([]);
        setStorage({key: 'output', folder: currentFolder, value: []});
      }
    });
  }, [currentFolder]);


  return (
    <OutputContext.Provider value={{ output, addToOutput, runCommand, outputLoading, updateOutputLine, clearOutput }}>
      {children}
    </OutputContext.Provider>
  );
};

export const useOutput = () => React.useContext(OutputContext);
