import { css } from "@emotion/react";


export const notesPageContainer = css`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  background-color: #1a121b;
  color: white;
  padding: 2px 8px 2px 2px;
  position: relative;
  gap: 8px;

  > div:first-child {
    flex-grow:1;
    min-height: 100%;
    max-height: 100%;
    box-shadow: none;
    border-bottom-left-radius: 12px;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    --color-canvas-subtle: #3e2b41;
    --color-canvas-default: #1a121b;
    --color-fg-default: white;
    --color-border-default: #865d8d;
    --color-border-muted: #865d8d80;
    --color-fg-muted: #fff8;
    --color-accent-fg: #ce8fd9;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #865d8d;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-track {
      background-color: #1a121b;
      border-radius: 10px;
    }
  }
  .w-md-editor-toolbar {
    background-color: #865d8d;
    color: white;
    border-color: #865d8d;
  }
  .w-md-editor-content {
    color: #1a121b;
    background-color: white;
  }

`;


export const editingToggleButton = (isEditing: boolean)=> css`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  color: #ce8fd9;
  width: 1em;
  height: 1em;
  cursor: pointer;
  padding: 4px;
  margin-top: 12px;
  ${isEditing ? 'background-color: #ce8fd9; color: #1a121b;' : ''}
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: #ce8fd980;
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;
