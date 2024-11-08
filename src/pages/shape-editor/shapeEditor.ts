import { EditorMoveEvent } from '@leafer-in/editor';
import { App, Ellipse, Pen } from 'leafer-ui';

const circleRadius = 14;

export interface IConfig {
  points: { x; y }[];
}

class Editor {
  app: App;
  constructor(app: App) {
    this.app = app;
  }
}

export default class ShapeEditor {
  app: App;
  editor: Editor;

  moveTarget;
  points: Ellipse[] = [];

  config: IConfig = { points: [] };
  polygon: Pen = new Pen();

  lPoint: Ellipse;
  rPoint: Ellipse;

  constructor(config: IConfig) {
    const { points } = config;
    this.config = config;
    this.app = new App({ view: window, tree: {} });

    this.editor = new Editor(this.app);

    // this.app.on(PointerEvent.MOVE, (e) => {
    //   const { x, y } = e;

    //   if (this.moveTarget) {
    //     this.moveTarget.x = x;
    //     this.moveTarget.y = y;
    //     this.drawPolygon();
    //     this.genSelectBox(this.moveTarget);

    //     this.genEditPoints();
    //   }
    // });

    // this.app.on(PointerEvent.TAP, (e) => {
    //   if (e.target !== this.selector) {
    //     this.clearEditPoints();
    //     this.clearSelectBox();
    //   }

    //   const { x, y } = e;

    //   if (e.target === this.polygon) {
    //     this.addPoint(x - circleRadius / 2, y - circleRadius / 2);
    //   }
    // });

    this.drawPoints(points);
    // this.drawPolygon();

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

    // arc.on(PointerEvent.DOWN, (e) => {
    //   this.moveTarget = e.target;
    // });

    // arc.on(PointerEvent.CLICK, (e) => {
    //   this.genEditPoints();
    // });

    // arc.on(PointerEvent.UP, (e) => {
    //   this.moveTarget = null;
    // });
    function getCentroid(points) {
      let xSum = 0,
        ySum = 0;
      for (const point of points) {
        xSum += point.x;
        ySum += point.y;
      }
      return { x: xSum / points.length, y: ySum / points.length };
    }

    this.points.push(arc);
    this.points = sortPoints(this.points);
    function sortPoints(points) {
      const centroid = getCentroid(points);
      return points.sort((a, b) => {
        const angleA = Math.atan2(a.y - centroid.y, a.x - centroid.x);
        const angleB = Math.atan2(b.y - centroid.y, b.x - centroid.x);
        return angleB - angleA; // 顺时针排序
      });
    }
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

    // if (this.selector) {
    //   const selectIdx = this.points.findIndex(
    //     (point) => point === this.selector
    //   );

    //   this.polygon.moveTo(
    //     this.points[selectIdx - 1].x + circleRadius / 2,
    //     this.points[selectIdx - 1].y + circleRadius / 2
    //   );
    //   this.polygon.quadraticCurveTo(
    //     this.lPoint.x,
    //     this.lPoint.y,
    //     this.points[selectIdx].x + circleRadius / 2,
    //     this.points[selectIdx].y + circleRadius / 2
    //   );
    //   this.polygon.quadraticCurveTo(
    //     this.rPoint.x,
    //     this.rPoint.y,
    //     this.points[selectIdx + 1].x + circleRadius / 2,
    //     this.points[selectIdx + 1].y + circleRadius / 2
    //   );
    // }

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
