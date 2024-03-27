/** @jsxImportSource @emotion/react */

import { useStorage } from "../../../contexts/StorageContext";
import { MarkdownPage } from "../MarkdownPage/MarkdownPage";

export const NotesPage = () => {
  const { currentFolder } = useStorage();

  return (
    <MarkdownPage folder={currentFolder} />
  );
};
