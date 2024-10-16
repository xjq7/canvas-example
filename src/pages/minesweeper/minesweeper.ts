import { Leafer, Rect, Text, PointerEvent } from 'leafer-ui';
import { Animate } from '@leafer-in/animate';
import { create2dimensionArr, getDelayTime, getTextColor } from './utils';
import bomberImage from './bomber.png';
import markImage from './mark.png';

export interface Config extends IBaseConfig {
  view: string;
  onFail: () => void;
  onSuccess: () => void;
}

export interface IBaseConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  bomberCount: number;
  gap: number;
}

type Status = 'success' | 'gaming' | 'fail';

export default class MineSweeper {
  grids: number[][];
  openGrids: number[][];
  markGrids: Rect[][];
  rectGrids: Rect[][];
  config: Config;
  w: number;
  h: number;
  leafer: Leafer;
  remainCount: number;
  status: Status = 'gaming';

  constructor(config: Config) {
    this.config = config;

    const { width, height, view } = config;

    this.leafer = new Leafer({ view, width, height });

    this.leafer.on(PointerEvent.TAP, this.handleTap.bind(this));
    this.leafer.on(PointerEvent.MENU_TAP, this.handleMenuTap.bind(this));

    this.init();
  }

  init() {
    this.leafer.clear();
    const { x, y, width, height, gap } = this.config;

    this.w = Math.floor((width - gap * x) / x);
    this.h = Math.floor((height - gap * y) / y);

    this.grids = this.generateGrids();
    this.openGrids = create2dimensionArr(x, y, 0);
    this.markGrids = create2dimensionArr(x, y, 0);
    this.rectGrids = create2dimensionArr(x, y);
    this.status = 'gaming';
    this.remainCount = x * y;

    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        const rect = new Rect({
          x: i * (this.w + gap),
          y: j * (this.h + gap),
          width: this.w,
          height: this.h,
          fill: '#22d2ef',
          cursor: 'pointer',
        });
        this.rectGrids[i][j] = rect;
        this.leafer.add(rect);
      }
    }
  }

  update(config: IBaseConfig) {
    this.config = { ...this.config, ...config };
    this.init();
  }

  handleSuccess() {
    const { x, y, onSuccess } = this.config;
    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        if (this.grids[i][j] === -1) {
          this.drawBomber(i, j);
        } else if (this.grids[i][j] > 0) {
          this.drawText(i, j, this.grids[i][j], 0);
        } else {
          this.drawText(i, j, undefined, 0);
        }
      }
    }
    this.status = 'success';
    onSuccess();
  }

  handleFail() {
    const { x, y, onFail } = this.config;
    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        if (this.grids[i][j] === -1) {
          this.drawBomber(i, j);
        }
      }
    }
    this.status = 'fail';
    onFail();
  }

  handleTap(e) {
    const { bomberCount, gap } = this.config;
    if (this.status !== 'gaming') {
      return;
    }

    if (e.target !== this.leafer) {
      const { x, y } = e.target;

      const i = x / (this.w + gap);
      const j = y / (this.h + gap);
      if (this.grids[i][j] !== -1) {
        this.leafer.remove(this.markGrids[i][j]);
        this.markGrids[i][j] = null;
        this.openGrids[i][j] = 1;
        this.turnOpen(i, j, 0);

        if (this.remainCount === bomberCount) {
          this.handleSuccess();
        }
      } else {
        this.handleFail();
      }
    }
  }

  handleMenuTap(e) {
    const { gap } = this.config;
    if (this.status !== 'gaming') {
      return;
    }

    if (e.target !== this.leafer) {
      const { x, y } = e.target;

      const i = x / (this.w + gap);
      const j = y / (this.h + gap);
      if (this.openGrids[i][j]) {
        return;
      }

      if (this.markGrids[i][j]) {
        this.leafer.remove(this.markGrids[i][j]);
        this.markGrids[i][j] = null;
      } else {
        const markRect = new Rect({
          x: i * (this.w + gap),
          y: j * (this.h + gap),
          width: this.w,
          height: this.h,
          fill: {
            type: 'image',
            url: markImage,
          },
          cursor: 'pointer',
        });
        this.markGrids[i][j] = markRect;
        this.leafer.add(markRect);
      }
    }
  }

  diffusion(i: number, j: number, step: number) {
    const { x, y } = this.config;
    const drts = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (let k = 0; k < drts.length; k++) {
      const x1 = drts[k][0] + i;
      const y1 = drts[k][1] + j;

      if (x1 >= 0 && x1 < x && y1 >= 0 && y1 < y) {
        if (this.openGrids[x1][y1]) {
          continue;
        }

        if (this.grids[x1][y1] !== -1) {
          this.openGrids[x1][y1] = 1;
          this.turnOpen(x1, y1, step + 1);
        }
      }
    }
  }

  drawBomber(i: number, j: number) {
    const { gap } = this.config;

    const width = this.w - 1 * 2;
    const height = this.h - 1 * 2;

    const bomberRect = new Rect({
      x: i * (this.w + gap) + 1,
      y: j * (this.h + gap) + 1,
      width,
      height,
      fill: {
        type: 'image',
        url: bomberImage,
      },
    });

    this.leafer.add(bomberRect);
  }

  /**
   * 绘制文本
   *
   * @param {number} i
   * @param {number} j
   * @param {number} num 第几个绘制的元素
   * @memberof MineSweeper
   */
  drawText(i: number, j: number, num: number, step: number) {
    const { gap } = this.config;

    const delayTime = getDelayTime(step);

    const rect = new Rect({
      x: i * (this.w + gap),
      y: j * (this.h + gap),
      width: this.w,
      height: this.h,
      fill: '#c4cbcf',
      cursor: 'pointer',
      opacity: 0,
      animationOut: null,
    });
    new Animate(rect, [{ opacity: 1 }], {
      duration: 1,
      delay: delayTime,
    });
    this.leafer.add(rect);
    if (num > 0) {
      const text = new Text({
        x: i * (this.w + gap),
        y: j * (this.h + gap),
        width: this.w,
        height: this.h,
        text: String(num),
        fill: getTextColor(num),
        textAlign: 'center',
        verticalAlign: 'middle',
        fontSize: (28 * this.w) / (600 / 15),
        fontWeight: 'bold',
        opacity: 0,
        animationOut: null,
      });
      new Animate(text, [{ opacity: 1 }], {
        duration: 1,
        delay: delayTime,
      });

      this.leafer.add(text);
    }
  }

  turnOpen(i: number, j: number, step: number) {
    const val = this.grids[i][j];
    this.drawText(i, j, val > 0 ? val : undefined, step);
    if (val === 0) {
      this.diffusion(i, j, step);
    }
    this.remainCount--;
  }

  generateGrids() {
    const { x, y, bomberCount } = this.config;

    const grids = create2dimensionArr(x, y, 0);

    const set = new Set();
    let bomberCountTemp = bomberCount;

    while (bomberCountTemp || bomberCountTemp === x * y - bomberCount) {
      const randomx = Math.round((x - 1) * Math.random());
      const randomy = Math.round((y - 1) * Math.random());

      const key = `${randomx}_${randomy}`;
      if (!set.has(key)) {
        set.add(key);
        grids[randomx][randomy] = -1;
        bomberCountTemp--;
      }
    }

    const updateRound = (x1: number, y1: number) => {
      const drts = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];
      drts.forEach((drt) => {
        let [x2, y2] = drt;
        x2 += x1;
        y2 += y1;
        if (x2 >= 0 && x2 < x && y2 >= 0 && y2 < y && grids[x2][y2] !== -1) {
          grids[x2][y2] += 1;
        }
      });
    };

    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        if (grids[i][j] === -1) {
          updateRound(i, j);
        }
      }
    }

    return grids;
  }
  reset() {
    this.init();
  }

  destroy() {
    this.leafer.destroy();
  }
}
