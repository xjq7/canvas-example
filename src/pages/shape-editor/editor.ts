import { App, PointerEvent, UI } from 'leafer-ui';

export interface IEditorConfig {
  onMove?: (e) => void;
  onMoveEnd?: (e) => void;
  onTap?: (e) => void;
  onDown?: (e) => void;
}

interface ISelector {
  _offsetX: number;
  _offsetY: number;
  target: UI;
}

export default class Editor {
  app: App;
  config: IEditorConfig;
  isMouseDown: boolean;
  isMoving: boolean;
  selector: ISelector;

  constructor(app: App, config: IEditorConfig) {
    this.app = app;
    this.config = config;

    const {
      onMove = () => {},
      onMoveEnd = () => {},
      onTap = () => {},
      onDown = () => {},
    } = this.config;

    this.app.on(PointerEvent.MOVE, (e) => {
      const { x, y } = e;

      if (this.isMouseDown) {
        if (this.selector && this.selector.target.cursor === 'move') {
          this.isMoving = true;

          const { _offsetX, _offsetY } = this.selector;

          this.selector.target.x = x - _offsetX;
          this.selector.target.y = y - _offsetY;

          onMove({
            target: this.selector.target,
            x,
            y,
            offsetX: x - this.selector.target.x,
            offsetY: y - this.selector.target.y,
          });
        }
      }
    });

    this.app.on(PointerEvent.DOWN, (e) => {
      this.isMouseDown = true;

      if (this.app !== e.target) {
        const { x, y } = e.target;

        const _offsetX = e.x - x;
        const _offsetY = e.y - y;

        this.selector = { target: e.target, _offsetX, _offsetY };
        onDown({ target: e.target });
      }
    });

    this.app.on(PointerEvent.UP, (e) => {
      if (this.isMoving) {
        onMoveEnd({ target: e.target });
      }
      this.isMouseDown = false;
      this.isMoving = false;
    });

    this.app.on(PointerEvent.TAP, (e) => {
      const { x, y } = e;

      if (this.app === e.target) {
        this.selector = null;
        onTap({ target: e.target, x, y });
      } else {
        this.selector.target = e.target;
        onTap({ target: e.target, x, y });
      }
    });
  }
}
