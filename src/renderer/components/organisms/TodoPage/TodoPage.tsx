/** @jsxImportSource @emotion/react */

import { useStorage } from "../../../contexts/StorageContext";
import { MarkdownPage } from "../MarkdownPage/MarkdownPage";

export const TodoPage = () => {
  const { currentFolder } = useStorage();

  return (
    <MarkdownPage folder={null} />
  );
};

/*
colors

red: #f74348
cyan: #15dbb7
yellow: #fac92d
black: #1a121b
*/
