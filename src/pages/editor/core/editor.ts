import {
  Editor as LeaferEditor,
  EditorEvent,
  EditorMoveEvent,
} from '@leafer-in/editor';

import { Frame, PointerEvent } from 'leafer-ui';
import { Application, IApplicationConfig } from './application';

interface IEditorConfig extends IApplicationConfig {
  frameWidth: number;
  frameHeight: number;
  onMenuTap?: (event) => void;
  onSelect?: (event) => void;
  onMove?: (event) => void;
}

export default class Editor extends Application {
  declare config: IEditorConfig;

  constructor(config: IEditorConfig) {
    super(config);
    this.config = config;

    const { onMenuTap, onSelect, onMove } = config;

    this.app.editor = new LeaferEditor({ continuousSelect: true });
    this.app.sky.add(this.app.editor);

    this.app.on(PointerEvent.MENU_TAP, onMenuTap);
    this.app.editor.on(EditorEvent.SELECT, onSelect);
    this.app.editor.on(EditorMoveEvent.MOVE, onMove);

    this.initFrame();
  }

  initFrame() {
    const { frameWidth, frameHeight } = this.config;

    const centerX = this.app.width / 2 - frameWidth / 2;
    const centerY = this.app.height / 2 - frameHeight / 2;
    this.page = new Frame({
      x: centerX,
      y: centerY,
      width: frameWidth,
      height: frameHeight,
      fill: 'white',
    });

    this.app.tree.add(this.page);
  }

  addCmp(cmp: any) {
    this.page.add(cmp);
    return cmp;
  }

  removeCmp() {}

  updateCmp() {}
}
