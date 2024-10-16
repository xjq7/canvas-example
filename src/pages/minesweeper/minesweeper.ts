import { Leafer, Rect, Text, PointerEvent } from 'leafer-ui';
import { create2dimensionArr } from './utils';
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
        this.turnOpen(i, j);

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

  diffusion(i: number, j: number) {
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
          this.turnOpen(x1, y1);
        }
      }
    }
  }

  drawBomber(i: number, j: number) {
    const { gap } = this.config;
    const bomberRect = new Rect({
      x: i * (this.w + gap) + 1,
      y: j * (this.h + gap) + 1,
      width: this.w - 1 * 2,
      height: this.h - 1 * 2,
      fill: {
        type: 'image',
        url: bomberImage,
      },
    });
    this.leafer.add(bomberRect);
  }

  turnOpen(i: number, j: number) {
    const { gap } = this.config;
    const target = this.rectGrids[i][j];
    const val = this.grids[i][j];
    if (val > 0) {
      const text = new Text({
        x: i * (this.w + gap),
        y: j * (this.h + gap),
        width: this.w,
        height: this.h,
        text: String(this.grids[i][j]),
        textAlign: 'center',
        verticalAlign: 'middle',
        fontSize: 24,
        fontWeight: 'bold',
      });

      this.leafer.add(text);
    } else if (val === 0) {
      this.diffusion(i, j);
    }
    this.remainCount--;
    target.fill = '#abcabc';
  }

  generateGrids() {
    const { x, y, bomberCount } = this.config;

    const grids = create2dimensionArr(x, y, 0);

    const set = new Set();
    let bomberCountTemp = bomberCount;

    while (bomberCountTemp) {
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
