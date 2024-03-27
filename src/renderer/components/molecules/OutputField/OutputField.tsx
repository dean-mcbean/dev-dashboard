/** @jsxImportSource @emotion/react */

import { useEffect, useRef } from "react";
import { OutputLine, useOutput } from "../../../contexts/OutputContext";
import { collapseLineButton, commandInput, input, loadingStyle, outputFieldContainer, outputFieldContainerParent, outputFieldEmptyLine, outputFieldLine, outputLineContent, prompt } from "./OutputField.styles";
import Convert from 'ansi-to-html';

const convert = new Convert({
  newline: true,
  colors: {
    0: '#1a121b',
    1: '#f74348',
    2: '#15dbb7',
    3: '#fac92d',
  }
});


export const OutputField = () => {
  const { output,runCommand, outputLoading, updateOutputLine } = useOutput();

  const textInputRef = useRef<HTMLInputElement>(null);
  const prevCommandIndex = useRef<number>(-1);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  }

  const copyCommand = (line: OutputLine) => {
    if (line.type === 'input') {
      if (textInputRef.current) {
        textInputRef.current.value = line.content.replace('$ ', '');
        textInputRef.current.focus();
      }
    }
  }

  const collapseLine = (e: React.MouseEvent, line: OutputLine) => {
    e.stopPropagation();
    updateOutputLine(line.id, {...line, collapsed: !line.collapsed});
  }

  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output]);

  console.log(output)

  return (
    <div css={outputFieldContainerParent}>
      <div css={outputFieldContainer} onClick={handleClick}>
        {output.map((line, index) => line.type === 'input' || line.content.length > 0 ? (
          <div key={index} css={outputFieldLine(line.type)}>
            {line.type !== 'input' ?
            <div css={collapseLineButton(line.collapsed)} onClick={(e) => collapseLine(e, line)}>{line.collapsed ? '+' : '-'}</div> : null}
            <div css={outputLineContent(line.collapsed)} onClick={(e) => copyCommand(line)} dangerouslySetInnerHTML={{__html: convert.toHtml(line.content)}}>
            </div>
          </div>
        ) : (
          <div key={index} css={outputFieldEmptyLine(line.type)}>No Response</div>
        ))}
        {outputLoading && (<>
          <div css={loadingStyle} style={{width: '90%'}}/>
          <div css={loadingStyle} style={{width: '86%'}}/>
          <div css={loadingStyle} style={{width: '28%'}}/></>
        )}

        <div css={commandInput}>
          <span css={prompt}>$</span>
          <input ref={textInputRef} css={input} type="text"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                console.log(event.currentTarget.value);
                runCommand(event.currentTarget.value);
                event.currentTarget.value = '';
              } else if (event.key === 'ArrowUp') {
                const lastCommand = output.filter((line) => line.type === 'input').reverse()[prevCommandIndex.current + 1];
                if (lastCommand) {
                  event.currentTarget.value = lastCommand.content.replace('$ ', '');
                  prevCommandIndex.current++;
                }
              } else if (event.key === 'ArrowDown') {
                if (prevCommandIndex.current < 0) {
                  event.currentTarget.value = '';
                  return;
                }
                const lastCommand = output.filter((line) => line.type === 'input').reverse()[prevCommandIndex.current];
                if (lastCommand) {
                  event.currentTarget.value = lastCommand.content.replace('$ ', '');
                  prevCommandIndex.current--;
                }
              }
            }}/>
        </div>
      </div>
    </div>
  );
}
