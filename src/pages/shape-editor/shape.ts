import { App, Ellipse, Group, IGroupInputData, Pen, UI } from 'leafer-ui';
import Editor from './editor';
import Control, { IControl } from './control';

const circleRadius = 14;

interface IPoint {
  x: number;
  y: number;
  controls: IControl[];
}

export interface IConfig extends IGroupInputData {
  points: IPoint[];
  onMoveEnd?: (e) => void;
}

export default class ShapeEditor {
  app: App;
  editor: Editor;

  selector: Ellipse;
  private points: Ellipse[] = [];

  private controls: [IControl, IControl][] = [
    [
      { offsetX: -50, offsetY: 0 },
      { offsetX: 50, offsetY: 0 },
    ],
    [
      {
        offsetX: -50,
        offsetY: -50,
      },
      {
        offsetX: 50,
        offsetY: 50,
      },
    ],
  ];

  private pointsIdxMap: Map<number, number> = new Map();

  config: IConfig = { points: [] };
  private pen: Pen = new Pen({ fill: 'black' });

  private selectBox: Ellipse = null;

  private control: Control;

  private container: Group;

  constructor(config: IConfig) {
    const { points, x, y } = config;
    this.config = config;
    this.app = new App({ view: window, tree: {} });

    this.container = new Group({ x, y });

    this.app.tree.add(this.container);
    this.container.add(this.pen);

    const { onMoveEnd = () => {} } = this.config;

    this.editor = new Editor(this.app, {
      onMove: (e) => {
        const idx = this.pointsIdxMap.get(e.target.innerId);
        if (idx !== undefined) {
          this.selector = e.target;
          this.drawSelectBox();
          this.drawPolygon();
        }
      },
      onTap: (e) => {
        if (this.pointsIdxMap.get(e.target.innerId) !== undefined) {
          this.selector = e.target;
          this.drawSelectBox();
          return;
        }

        if (e.target === this.pen.pathElement) {
          const { x, y } = e;

          this.addPoint(x - circleRadius / 2, y - circleRadius / 2);
        }

        this.selector = null;
        this.clearSelectBox();
      },
      onMoveEnd(e) {
        onMoveEnd(e);
      },
    });

    this.drawPoints(points);

    this.control = new Control(this.app, {
      points: this.points,
      controls: this.controls,
      onMove: () => {
        this.drawPolygon();
      },
      onMoveEnd: (e) => {
        console.log(e);
      },
    });

    this.drawPolygon();
  }

  private addPoint(x, y) {
    const arc = new Ellipse({
      x,
      y,
      width: circleRadius,
      height: circleRadius,
      fill: 'rgb(50,205,121)',
      cursor: 'move',
    });

    this.points.push(arc);

    this.pointsIdxMap.set(arc.innerId, this.points.length - 1);

    this.control?.update({ points: this.points });

    this.addEls(arc);
  }

  private addEls(nodes: UI | UI[]) {
    if (!Array.isArray(nodes)) {
      nodes = [nodes];
    }

    this.container.addMany(...nodes);
  }

  private removeEls(nodes: UI | UI[]) {
    if (!Array.isArray(nodes)) {
      nodes = [nodes];
    }

    nodes.forEach((node) => {
      this.container.remove(node);
    });
  }

  private drawPoints(points) {
    this.removeEls(this.points);

    for (let i = 1; i < points.length; i += 2) {
      const x = points[i - 1],
        y = points[i];
      this.addPoint(x, y);
    }

    this.drawPolygon();
  }

  private drawPolygon() {
    this.pen.clear();

    const points = this.points.map(({ x, y }) => {
      return { x: x + circleRadius / 2, y: y + circleRadius / 2 };
    });

    this.pen.setStyle({ stroke: '#FF4B4B' });

    this.pen.moveTo(points[0].x, points[0].y);
    points.forEach((point, index) => {
      const controls = this.controls[index];

      let nextIdx = index + 1;
      if (nextIdx >= points.length) nextIdx = 0;

      const leftPoint = point,
        rightPoint = points[nextIdx];

      let controlLeft = null,
        controlRight = null;

      if (controls) {
        controlLeft = controls[1];
      }
      const nextControls = this.controls[nextIdx];

      if (nextControls) {
        controlRight = nextControls[0];
      }

      if (!controlLeft && !controlRight) {
        this.pen.lineTo(rightPoint.x, rightPoint.y);
      } else if (controlLeft && !controlRight) {
        this.pen.quadraticCurveTo(
          controlLeft.offsetX + leftPoint.x,
          controlLeft.offsetY + leftPoint.y,
          rightPoint.x,
          rightPoint.y
        );
      } else if (!controlLeft && controlRight) {
        this.pen.quadraticCurveTo(
          controlRight.offsetX + rightPoint.x,
          controlRight.offsetY + rightPoint.y,
          rightPoint.x,
          rightPoint.y
        );
      } else {
        this.pen.bezierCurveTo(
          controlLeft.offsetX + leftPoint.x,
          controlLeft.offsetY + leftPoint.y,
          controlRight.offsetX + rightPoint.x,
          controlRight.offsetY + rightPoint.y,
          rightPoint.x,
          rightPoint.y
        );
      }
    });
  }

  private drawSelectBox() {
    if (!this.selector) return;

    if (this.selectBox) this.removeEls(this.selectBox);

    const { x, y, width, height } = this.selector;

    this.selectBox = new Ellipse({
      x: x - 2,
      y: y - 2,
      width: width + 4,
      height: height + 4,
      stroke: '#FF4B4B',
      strokeWidth: 1,
    });

    this.addEls(this.selectBox);
  }

  private clearSelectBox() {
    if (this.selectBox) this.removeEls(this.selectBox);
  }

  destroy() {
    this.app.destroy();
  }
}
