/** @jsxImportSource @emotion/react */

import MDEditor from "@uiw/react-md-editor";
import { editingToggleButton, notesPageContainer } from "./MarkdownPage.styles";
import { useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { ProjectFolder, useStorage } from "../../../contexts/StorageContext";

export const MarkdownPage = ({folder}: {folder: ProjectFolder | null}) => {
  const { setStorage, getStorage } = useStorage();
  const [value, setValue] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (value === null) {
      return;
    }
    setStorage({key: 'todo', folder, value: value});
  }, [value]);

  useEffect(() => {
    getStorage({
      key: 'todo',
      folder
    }).then((todo) => {
      if (todo) {
        setValue(todo);
      } else {
        setValue('');
      }
    }
    );
  }, []);

  const handleCheckboxChange = (event: any) => {
    const checkbox = event.target;
    const checked = checkbox.checked;
    // Save `checked` and `index` in storage
    console.log(checkbox, checked)
    const checkbox_id = checkbox.id.split('-')[1];
    setStorage({key: `todo-checkbox-${checkbox_id}`, folder, value: checked});
  };

  useEffect(() => {
    if (!isEditing) {
      const checkbox_items = document.querySelectorAll('#todo > .wmde-markdown .task-list-item');
      checkbox_items.forEach((checkbox_item, i) => {
        const checkbox = checkbox_item.querySelector('input[type="checkbox"]') as HTMLInputElement;
        const text = checkbox_item.childNodes[1].textContent;
        if (!checkbox || !text) {
          return;
        }
        console.log('checkbox', checkbox, text, checkbox_item.textContent, checkbox_item.children, checkbox_item.childNodes[1].textContent)
        const checkbox_id = text.split(']')[0].split('[')[1];
        const rest_of_text = text.split(']')[1];
        if (checkbox_id === undefined) {
          return;
        }
        // get the checked value from storage
        getStorage({key: `todo-checkbox-${checkbox_id}`, folder}).then((checked) => {
          checkbox.checked = checked;
        });
        checkbox.removeAttribute('disabled');
        checkbox.addEventListener('change', handleCheckboxChange);
        checkbox.setAttribute('id', `checkbox-${checkbox_id}`);
        // then remove the checkbox id from the text without removing any other children elements of checkbox_item by just lazily setting the textContent
        checkbox_item.childNodes[1].textContent = rest_of_text;

      });
      const markdowns = document.querySelectorAll('#todo > .wmde-markdown');
      const todos = document.querySelectorAll('#todo');
      console.log('added event listeners', checkbox_items, markdowns, todos)
    }
  }, [isEditing, value]);

  if (value === null) {
    return <div>Loading...</div>;
  }

  return (
    <div css={notesPageContainer} id="todo">
      {isEditing ? <MDEditor
        value={value}
        onChange={(value) => value ? setValue(value) : setValue('')}
      /> :
      <MDEditor.Markdown source={value} css={{padding: '16px', paddingBottom: '28px'}}/>
      }
      <div css={editingToggleButton(isEditing)} onClick={() => setIsEditing(v => !v)}>
        <FaPencilAlt />
      </div>
    </div>
  );
};

/*
colors

red: #f74348
cyan: #15dbb7
yellow: #fac92d
black: #1a121b
*/
