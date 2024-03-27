import { css } from "@emotion/react";

export const branchButton = ({active} : {active: boolean}) => css`
  background-color: #1a121b;
  color: #fff;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.9rem;

  &:hover {
    background-color: #3e2b41;
  }

  ${active ? `background-color: #3e2b41;` : ``}
`;


export const gitPageContainer = css`
  display: flex;
  flex-direction: row;
  gap: 16px;
  padding: 8px;
  align-items: stretch;
`

export const diagramContainer = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  max-height: 100%;
  overflow-y: auto;
  flex-grow: 1;
  align-items: stretch;
`

export const branchListContainer = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  border-radius: 4px;
  background-color: #1a121b;
  max-height: 100%;
  overflow-y: auto;
  width: 200px;
`

export const realDiagramContainer = css`
  flex-grow: 1;
`
