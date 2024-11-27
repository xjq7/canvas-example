import { useEffect } from 'react';

import {
  App,
  Box,
  Rect,
  DragEvent,
  PointerEvent,
  Star,
  Ellipse,
} from 'leafer-ui';
import S from './index.module.less';

import { InnerEditor, registerInnerEditor } from '@leafer-in/editor';
import '@leafer-in/view';

import { SvgPath } from './svg-path';

@registerInnerEditor()
export class CustomEditor extends InnerEditor {
  public get tag() {
    return 'CustomEditor';
  }

  public point: Ellipse = new Ellipse();
  public closeBtn: Box = new Box();

  public onCreate(): void {
    this.point = new Ellipse();
    this.closeBtn = new Box({
      fill: '#FF4B4B',
      cornerRadius: 20,
      around: 'top',
      cursor: 'pointer',
      children: [{ tag: 'Text', text: '完成', padding: [3, 6] }],
    });
    this.view.addMany(this.point, this.closeBtn);
    this.eventIds = [
      this.point.on_(DragEvent.DRAG, () => {
        console.log('drag point');
      }),
      this.closeBtn.on_(PointerEvent.TAP, () => {
        this.editor.closeInnerEditor();
      }), // 关闭内部编辑器
    ];
  }

  public onLoad(): void {
    this.point.set({
      ...this.editBox.getPointStyle(),
      strokeWidth: 2,
      stroke: 'red',
      fill: 'red',
      x: 50,
      y: 50,
    });
    console.log(this.editor.element);
    this.editBox.add(this.view); // 添加在 editor 或 editBox 中都可以， 注意editBox本身具有定位
  }

  public onUpdate(): void {
    const { boxBounds, worldTransform } = this.editor.element; // 单个选中时 element 代表选中的元素
    const { x, y, height } = boxBounds,
      { scaleX, scaleY } = worldTransform;
    this.point.set({ x: (x + 50) * Math.abs(scaleX), y: y * Math.abs(scaleY) });
    this.closeBtn.set({
      x: (x + 50) * Math.abs(scaleX),
      y: (y + height) * Math.abs(scaleY),
    });
  }

  public onUnload(): void {
    this.editBox.remove(this.view);
  }

  public onDestroy(): void {
    this.point = this.closeBtn = null;
  }
}
Rect.setEditInner('CustomEditor'); // 1. 为元素类设置内部编辑器
// Star.setEditInner(function (star: Rect) {
//     return star.pathInputed ? 'PathEditor' : 'CustomEditor' // 支持函数
// })

SvgPath.setEditInner('CustomEditor');

export default function Component() {
  useEffect(() => {
    const app = new App({
      view: 'leafer-container',
      width: 1200,
      height: 1200,
      editor: {},
    });

    app.tree = app.addLeafer();
    app.sky = app.addLeafer({ type: 'draw', usePartRender: false });

    const rect1 = Star.one(
      { editable: true, fill: '#FEB027', corners: 3 },
      100,
      100
    );
    app.tree.add(rect1);
    app.tree.add(
      new SvgPath({
        editable: true,
        points: [
          {
            x: 210,
            y: 170,
            controls: [
              { offsetX: -50, offsetY: 0 },
              { offsetX: 50, offsetY: 0 },
            ],
          },
          {
            x: 330,
            y: 250,
            controls: [
              { offsetX: -50, offsetY: -50 },
              { offsetX: 50, offsetY: 50 },
            ],
          },
          {
            x: 330,
            y: 330,
          },
          { x: 210, y: 410 },
          { x: 90, y: 410 },
          { x: 50, y: 330 },
          { x: 50, y: 250 },
        ],
        fill: 'red',
      })
    );

    app.tree.add(
      Rect.one(
        { editable: true, fill: '#FFE04B', cornerRadius: [0, 20, 20, 0] },
        300,
        100
      )
    );

    // return () => {
    //   app.destroy();
    // };
  }, []);

  return <div id="leafer-container" className={S.container}></div>;
}
