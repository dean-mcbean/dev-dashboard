import { css, keyframes } from "@emotion/react";


export const folderPageContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #1a121b;
  color: white;

`;

export const folderButton = css`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: #3e2b41;
  color: white;
  padding: 8px 16px;
  margin: 8px;
  gap: 4px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

export const folderAddButton = css`
  ${folderButton}
  background-color: #15dbb7;
  color: #1a121b;
`;

export const folderButtonContainer = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-grow: 1;
  align-content: center;
`;

export const iconForm = css`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const iconContainer = css`
  display: flex;
  flex-wrap: wrap;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  justify-content: center;
  align-items: flex-start;
  align-content: flex-start;
  gap: 2px;
  padding: 16px;
  font-size: 20px;
  border: 1px solid #1a121b;
  border-radius: 4px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #15dbb7;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background-color: #1a121b;
    border-radius: 10px;
  }
`

export const currentFolderMenu = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  gap: 8px;
  padding: 0 8px;
  border-radius: 4px 4px;
  background-color: #3e2b41;
  position: absolute;
  top: 8px;

  svg {
    cursor: pointer;
    transition: color 0.2s, transform 0.2s;
    color: #15dbb7;

    &:hover {
      color: #00ffd0;
      transform: scale(1.2);
    }
  }
`;

export const addLayerFormContainer = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: stretch;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #3e2b41;
  width: 90%;

  form {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  i {
    opacity: 0.5;
  }

  input {
    background-color: #1a121b;
    color: white;
    border: 1px solid #15dbb7;
    border-radius: 4px;
    padding: 4px;
    margin: 8px 16px;
  }
  button {
    background-color: #15dbb7;
    color: #1a121b;
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
    cursor: pointer;
    transition: transform 0.2s;
    margin: 8px 16px;

    &:hover {
      transform: scale(1.1);
    }
  }
`;
