/** @jsxImportSource @emotion/react */

import { useOutput } from "../../../contexts/OutputContext";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { commandButtonContainer } from "./CommandButton.styles";


export interface CommandButtonProps {
  name: string;
  command: string;
  icon: JSX.Element;
}

export const CommandButton = ({name, command, icon}: CommandButtonProps) => {

  const { runCommand } = useOutput();

  const handleClick = async () => {
    runCommand(command);
  }

  return (
    <div css={commandButtonContainer}>
      <div className="commandName">{name}</div>
      <IconButton icon={icon} onClick={handleClick}/>
    </div>
  );
};
