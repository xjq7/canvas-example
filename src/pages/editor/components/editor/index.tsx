import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { Application } from './application';
import { useLayoutStore } from '../../store/layout';
import { useComponentStore } from '../../store/components';

import S from './index.module.less';

export default function EditorComponent() {
  const { contentWidth, contentHeight } = useLayoutStore();
  const { components, updateApp, updateSelectCmp } = useComponentStore();
  const appRef = useRef<Application>();

  const selectTargetRef = useRef();

  useEffect(() => {
    const id = 'editor-canvas-container';

    const el = document.querySelector(`#${id}`);

    let contextMenuListener, cancelContextMenuListener;

    if (el) {
      appRef.current = new Application({
        width: contentWidth,
        height: contentHeight,
        view: id,
        onMenuTap(event) {
          console.log('event', event);
          selectTargetRef.current = event.target;
        },
        onSelect(event) {
          updateSelectCmp(event.value);
        },
      });
      updateApp(appRef.current);

      contextMenuListener = el.addEventListener(
        'contextmenu',
        handleContextMenu
      );

      cancelContextMenuListener = document.addEventListener('click', () => {
        setMenuPosition({ x: 0, y: 0 });
      });
    }

    return () => {
      if (appRef.current) {
        appRef.current.destroy();
      }
      if (contextMenuListener) {
        el.removeEventListener('contextmenu', contextMenuListener);
      }
      if (cancelContextMenuListener) {
        document.removeEventListener('click', cancelContextMenuListener);
      }
    };
  }, []);

  useEffect(() => {
    if (appRef.current) {
      appRef.current.resize({ width: contentWidth, height: contentHeight });
    }
  }, [contentWidth, contentHeight]);

  useEffect(() => {
    // appRef.current
  }, [components]);

  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (event) => {
    event.preventDefault();
    console.log(useComponentStore.getState().selectCmp);

    setMenuPosition({ x: event.clientX, y: event.clientY });
  };

  const handleCloseMenu = () => {
    setMenuPosition({ x: 0, y: 0 });
  };

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
          <li
            onClick={() => {
              console.log(selectTargetRef.current);
            }}
          >
            移除
          </li>
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
      {menuPosition.x !== 0 && (
        <Menu x={menuPosition.x} y={menuPosition.y} onClose={handleCloseMenu} />
      )}
    </main>
  );
}
