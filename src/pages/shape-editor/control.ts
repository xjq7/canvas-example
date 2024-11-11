import { App, Ellipse, Line, UI } from 'leafer-ui';
import Editor from './editor';

export interface IControl {
  offsetX: number;
  offsetY: number;
  effect?: string;
}

const circleRadius = 12;

export interface IControlConfig {
  points?: UI[];
  controls?: IControl[][];
  onMove?: (e) => void;
  onMoveEnd?: (e) => void;
}

export default class Control {
  config: IControlConfig;
  app: App;
  editor: Editor;
  private controlEls: UI[] = [];

  point: UI;
  control: IControl[];

  private pointsIdxMap: Map<number, number> = new Map();

  private controlIdxMap: Map<number, number> = new Map();

  constructor(app: App, config: IControlConfig) {
    this.config = config;
    this.app = app;

    this.config.points.forEach((point, index) => {
      this.pointsIdxMap.set(point.innerId, index);
    });

    const { onMove = () => {}, onMoveEnd = () => {} } = this.config;

    this.editor = new Editor(this.app, {
      onMove: (e) => {
        const controlIdx = this.controlIdxMap.get(e.target.innerId);
        const pointIdx = this.pointsIdxMap.get(e.target.innerId);

        if (controlIdx !== undefined) {
          const offsetX = e.x - this.point.x;
          const offsetY = e.y - this.point.y;

          this.control[controlIdx].offsetX = offsetX;
          this.control[controlIdx].offsetY = offsetY;
          this.draw();
          onMove({ offsetX, offsetY });
        }

        if (pointIdx !== undefined) {
          this.point = this.config.points[pointIdx];
          this.control = this.config.controls[pointIdx];
          this.draw();
        }
      },

      onTap: (e) => {
        const idx = this.pointsIdxMap.get(e.target.innerId);

        if (idx !== undefined) {
          if (this.point && this.point.innerId !== e.target.innerId) {
            this.reset();
          }

          this.point = this.config.points[idx];
          this.control = this.config.controls[idx];
          this.draw();
        } else {
          this.reset();
        }
      },
      onMoveEnd: (e) => {
        onMoveEnd(e);
      },
    });
    this.draw();
  }

  private draw() {
    if (!this.point || !this.control?.length) return;

    this.clear();

    const [leftControl, rightControl] = this.control || [];
    if (leftControl) {
      const x = leftControl.offsetX + this.point.x;
      const y = leftControl.offsetY + this.point.y;

      const leftPoint = new Ellipse({
        x,
        y,
        width: circleRadius,
        height: circleRadius,
        fill: 'rgb(50,205,121)',
        cursor: 'move',
      });

      this.controlIdxMap.set(leftPoint.innerId, 0);

      this.controlEls.push(leftPoint);
      this.app.tree.add(leftPoint);

      const leftLine = new Line({
        points: [
          x + circleRadius / 2,
          y + circleRadius / 2,
          this.point.x + this.point.width / 2,
          this.point.y + this.point.height / 2,
        ],
        width: 1,
        stroke: 'rgb(50,205,121)',
      });

      this.controlEls.push(leftLine);

      this.app.tree.add(leftLine);
    }
    if (rightControl) {
      const x = rightControl.offsetX + this.point.x;
      const y = rightControl.offsetY + this.point.y;

      const rightPoint = new Ellipse({
        x: rightControl.offsetX + this.point.x,
        y: rightControl.offsetY + this.point.y,
        width: circleRadius,
        height: circleRadius,
        fill: 'rgb(50,205,121)',
        cursor: 'move',
      });
      this.controlEls.push(rightPoint);

      this.controlIdxMap.set(rightPoint.innerId, 1);
      this.app.tree.add(rightPoint);

      const rightLine = new Line({
        points: [
          this.point.x + this.point.width / 2,
          this.point.y + this.point.height / 2,
          x + circleRadius / 2,
          y + circleRadius / 2,
        ],
        width: 1,
        stroke: 'rgb(50,205,121)',
      });

      this.controlEls.push(rightLine);

      this.app.tree.add(rightLine);
    }
  }

  update(config: IControlConfig) {
    this.config = { ...this.config, ...config };
  }

  clear() {
    this.controlEls.forEach((el) => {
      this.app.tree.remove(el);
    });
  }

  reset() {
    this.clear();
    this.point = null;
    this.control = [];
  }
}
