import { EditorMoveEvent } from '@leafer-in/editor';
import { App, Ellipse, Pen, PointerEvent, UI } from 'leafer-ui';

const circleRadius = 14;

export interface IConfig {
  points: { x; y }[];
}

export interface IEditorConfig {
  onMove?: (e) => void;
  onMoveEnd?: (e) => void;
  onTap?: (e) => void;
}

class Editor {
  app: App;
  config: IEditorConfig;
  isMouseDown: boolean;
  selector: UI;

  constructor(app: App, config: IEditorConfig) {
    this.app = app;
    this.config = config;

    this.app.on(PointerEvent.MOVE, (e) => {
      const { x, y } = e;

      if (this.isMouseDown) {
        if (this.selector) {
          this.selector.x = x;
          this.selector.y = y;
          this.config?.onMove({ target: this.selector, x, y });
        }
      }
    });

    this.app.on(PointerEvent.DOWN, (e) => {
      this.isMouseDown = true;
      if (this.app !== e.target) {
        this.selector = e.target;
      }
    });

    this.app.on(PointerEvent.UP, (e) => {
      this.isMouseDown = false;
      console.log(e);

      this.config?.onMoveEnd({ target: e.target });
    });

    this.app.on(PointerEvent.TAP, (e) => {
      const { x, y } = e;

      if (this.app === e.target) {
        this.selector = null;
      } else {
        this.selector = e.target;
        this.config?.onTap({ target: e.target, x, y });
      }
    });
  }
}

export default class ShapeEditor {
  app: App;
  editor: Editor;

  selector: Ellipse;
  points: Ellipse[] = [];

  config: IConfig = { points: [] };
  polygon: Pen = new Pen();

  lPoint: Ellipse;
  rPoint: Ellipse;

  constructor(config: IConfig) {
    const { points } = config;
    this.config = config;
    this.app = new App({ view: window, tree: {} });

    this.editor = new Editor(this.app, {
      onMove: (e) => {
        this.drawPolygon();
      },
      onTap(e) {},
      onMoveEnd(e) {},
    });

    this.drawPoints(points);

    // this.polygon.setStyle({ fill: 'black' });
    // this.app.tree.add(this.polygon);
  }

  // private genEditPoints() {

  //   const selectIdx = this.points.findIndex((point) => point === this.selector);
  //   console.log(selectIdx);

  //   const P1 = this.points[selectIdx - 1];
  //   const P2 = this.points[selectIdx];
  //   const P3 = this.points[selectIdx + 1];

  //   const AC = { x: P3.x - P1.x, y: P3.y - P1.y };

  //   const ACLen = Math.sqrt(AC.x ** 2 + AC.y ** 2);

  //   const u = { x: AC.x / ACLen, y: AC.y / ACLen };

  //   const P21 = { x: P2.x - 100 * u.x, y: P2.y - 100 * u.y };
  //   const P22 = { x: P2.x + 50 * u.x, y: P2.y + 50 * u.y };

  //   this.lPoint = new Ellipse({
  //     x: P21.x - circleRadius / 2,
  //     y: P21.y - circleRadius / 2,
  //     width: circleRadius,
  //     height: circleRadius,
  //     fill: 'rgb(50,205,121)',
  //     cursor: 'move',
  //   });

  //   this.rPoint = new Ellipse({
  //     x: P22.x - circleRadius / 2,
  //     y: P22.y - circleRadius / 2,
  //     width: circleRadius,
  //     height: circleRadius,
  //     fill: 'rgb(50,205,121)',
  //     cursor: 'move',
  //   });

  //   this.app.tree.add(this.lPoint);
  //   this.app.tree.add(this.rPoint);
  // }

  private addPoint(x, y) {
    const arc = new Ellipse({
      x,
      y,
      width: circleRadius,
      height: circleRadius,
      fill: 'rgb(50,205,121)',
      cursor: 'move',
    });

    arc.on(EditorMoveEvent.MOVE, (e) => {
      console.log(e.target);
    });

    // arc.on(PointerEvent.CLICK, (e) => {
    //   this.genEditPoints();
    // });

    this.points.push(arc);

    this.app.tree.add(arc);
  }

  private drawPoints(points) {
    this.points.forEach((point) => {
      this.app.tree.remove(point);
    });

    for (let i = 1; i < points.length; i += 2) {
      const x = points[i - 1],
        y = points[i];
      this.addPoint(x, y);
    }

    // this.drawPolygon();
  }

  private drawPolygon() {
    this.polygon.clear();

    const points = this.points.map(({ x, y }) => {
      return { x: x + circleRadius / 2, y: y + circleRadius / 2 };
    });

    this.polygon.setStyle({ stroke: '#FF4B4B' });
    this.polygon.moveTo(points[0].x, points[0].y);

    if (this.selector) {
      const selectIdx = this.points.findIndex(
        (point) => point === this.selector
      );

      this.polygon.moveTo(
        this.points[selectIdx - 1].x + circleRadius / 2,
        this.points[selectIdx - 1].y + circleRadius / 2
      );
      this.polygon.quadraticCurveTo(
        this.lPoint.x,
        this.lPoint.y,
        this.points[selectIdx].x + circleRadius / 2,
        this.points[selectIdx].y + circleRadius / 2
      );
      this.polygon.quadraticCurveTo(
        this.rPoint.x,
        this.rPoint.y,
        this.points[selectIdx + 1].x + circleRadius / 2,
        this.points[selectIdx + 1].y + circleRadius / 2
      );
    }

    points.slice(2).forEach((point) => {
      this.polygon.lineTo(point.x, point.y);
    });

    this.polygon.closePath();
    // this.polygon.quadraticCurveTo();
  }

  destroy() {
    this.app.destroy();
  }
}
