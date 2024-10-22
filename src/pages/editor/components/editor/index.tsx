import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Editor from '../../core/editor';
import { useLayoutStore } from '../../store/layout';
import { useComponentStore } from '../../store/components';

import S from './index.module.less';

export default function EditorComponent() {
  const { contentWidth, contentHeight } = useLayoutStore();
  const { components, updateEditor } = useComponentStore();
  const editorRef = useRef<Editor>();

  useEffect(() => {
    const id = 'editor-canvas-container';

    const el = document.querySelector(`#${id}`);

    let cancelContextMenuListener;

    if (el) {
      editorRef.current = new Editor({
        width: contentWidth,
        height: contentHeight,
        frameHeight: 900,
        frameWidth: 500,
        view: id,
        onMenuTap(event) {
          console.log('event', event);
        },
        onSelect(event) {
          // updateSelectCmp(event.value);
          console.log(event);
        },
        onMove(event) {
          console.log(event);
        },
      });

      updateEditor(editorRef.current);

      cancelContextMenuListener = document.addEventListener('click', () => {
        setMenuPosition({ x: 0, y: 0 });
      });
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
      }

      if (cancelContextMenuListener) {
        document.removeEventListener('click', cancelContextMenuListener);
      }
    };
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.resize({ width: contentWidth, height: contentHeight });
    }
  }, [contentWidth, contentHeight]);

  useEffect(() => {}, [components]);

  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const Menu = ({ x, y }) => {
    return createPortal(
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          background: '#f0f0f0',
          padding: '5px',
          border: '1px solid #ccc',
        }}
      >
        <ul>
          <li onClick={() => {}}>移除</li>
          <li>置顶</li>
          <li>置底</li>
        </ul>
      </div>,
      document.body
    );
  };

  return (
    <main
      className={S.editor}
      style={{ width: contentWidth }}
      id="editor-canvas-container"
    >
      {menuPosition.x !== 0 && <Menu x={menuPosition.x} y={menuPosition.y} />}
    </main>
  );
}
