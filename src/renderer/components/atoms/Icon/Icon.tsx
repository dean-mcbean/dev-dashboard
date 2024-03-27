
/** @jsxImportSource @emotion/react */

import * as Io5Icons from 'react-icons/io5';
import * as IoIcons from 'react-icons/io';
import * as MdIcons from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';
import * as RiIcons from 'react-icons/ri';
import * as BiIcons from 'react-icons/bi';
import * as HiIcons from 'react-icons/hi';
import * as GrIcons from 'react-icons/gr';
import { iconButtonContainer } from './Icon.styles';
import { IconType } from 'react-icons';

const allIcons: {[key: string]: IconType} = {
  ...Io5Icons,
  ...IoIcons,
  ...MdIcons,
  ...FaIcons,
  ...RiIcons,
  ...BiIcons,
  ...HiIcons,
  ...GrIcons
}
console.log(allIcons);

export interface IconButtonProps {
  icon: string;
  onClick?: () => void;
}

export const Icon = ({icon, onClick}: IconButtonProps) => {

  const IconComponent = allIcons[icon];
  return (
    <div css={iconButtonContainer} onClick={onClick}>
      {IconComponent && <IconComponent />}
    </div>
  );
}

export const getAllIcons = () => {
  const icons = Object.keys(allIcons);
  return icons;
}
