/** @jsxImportSource @emotion/react */

import { useOutput } from "../../../contexts/OutputContext";
import { Icon } from "../Icon/Icon";
import { iconButtonContainer } from "./IconButton.styles";


export interface IconButtonProps {
  icon?: JSX.Element;
  iconName?: string;
  onClick: () => void;
}

export const IconButton = ({icon, iconName, onClick}: IconButtonProps) => {

  return (
    <div css={iconButtonContainer} onClick={onClick}>
      {icon && icon}
      {iconName && <Icon icon={iconName} />}
    </div>
  );
};
