import { Group, Leafer, PointerEvent, Rect, Text } from 'leafer-ui';
import { Animate } from '@leafer-in/animate';

import { keyboards } from './constants';

interface IMarchingMusicConfig {
  view: string;
  width: number;
  height: number;
}

const colors = ['#ed5a65', '#43b244', '#58B2DC', '#8A6BBE'];

export class MarchingMusic {
  leafer: Leafer;
  config: IMarchingMusicConfig;
  start: { x: number; y: number };
  color: string = colors[0];
  center?: Rect;
  container?: Group;
  waveData?: Rect[][];
  waveLastTime?: number;
  waveLastIntensity: number;

  constructor(config: IMarchingMusicConfig) {
    this.config = config;
    setInterval(() => {
      this.color = colors[Math.round(Math.random() * 3)];
    }, 2000);

    this.leafer = new Leafer({
      view: config.view,
      width: config.width,
      height: config.height,
    });
  }

  update(config: Partial<IMarchingMusicConfig>) {
    this.config = { ...this.config, ...config };
    this.draw();
  }

  destroy() {
    this.leafer.destroy();
  }

  draw() {
    if (this.container) this.leafer.remove(this.container);
    this.start = {
      x: (window.innerWidth - 860) / 2,
      y: (window.innerHeight - 350) / 2,
    };

    const containerX = this.start.x;
    const containerY = this.start.y;

    this.container = new Group({
      x: containerX,
      y: containerY,
    });
    this.leafer.add(this.container);

    const getBoard = (target) => {
      let board = target;
      if (board.tag === 'Text') {
        board = target.data.board;
      }
      if (board && board.data.isBoard) {
        return board;
      }
      return null;
    };

    this.container.on_(PointerEvent.DOWN, (e) => {
      if (e.target === this.container) return;
      const board = getBoard(e.target);
      if (board) {
        board.shadow = {
          x: 0,
          y: 0,
          blur: 12,
          color: this.color,
        };
        board.data.isDown = true;
      }
    });

    this.container.on_(PointerEvent.UP, (e) => {
      if (e.target === this.container) return;
      const board = getBoard(e.target);
      if (board) {
        board.data.isDown = false;
        if (board.shadow) {
          setTimeout(() => {
            board.shadow = undefined;
          }, 120);
        }
      }
    });

    this.drawKeyboard();
    this.calWaveData();
  }

  calWaveData() {
    const steps = [
      ['t', '^6', '&7', 'u', 'h', 'g'],
      ['%5', 'f5', 'f6', 'f7', '*8', 'i', 'j', 'n', 'b', 'v', 'f', 'r'],
      ['¥$4', 'f4', 'e', 'd', 'c', 'space', 'f8', '(9', 'o', 'k', 'm'],
      ['f3', '#3', 'w', 's', 'x', 'f9', ')0', 'p', 'l', '<', 'space'],
      [
        'f2',
        '@2',
        'q',
        'a',
        'z',
        'left command',
        'f10',
        '——-',
        '{[',
        ':;',
        '>',
        'right command',
      ],
      [
        'f1',
        '!1',
        'tab',
        'caps lock',
        'left shift',
        'left option',
        'f11',
        '+=',
        ']}',
        '"',
        '?/',
        'right option',
      ],
      [
        'esc',
        'fn',
        'control',
        '~·',
        'f12',
        'back',
        '|\\',
        'enter',
        'right shift',
        'top arrow',
        'left arrow',
      ],
      ['figure', 'bottom arrow', 'right arrow'],
    ];

    const stepsLevel = steps.reduce((acc, cur, idx) => {
      cur.forEach((val) => {
        acc.set(val, idx);
      });
      return acc;
    }, new Map());

    this.waveData = [[], [], [], [], [], [], [], []];

    this.container.children.forEach((keyboard) => {
      const { isBoard, type } = keyboard.data;

      if (isBoard) {
        const level = stepsLevel.get(type);

        if (level !== undefined) {
          this.waveData[level].push(keyboard as Rect);
        }
      }
    });
  }

  drawKeyboard() {
    this.container.clear();

    keyboards.forEach((keyboard) => {
      const { x, y } = keyboard;
      const { width, height, fill, text, type } = keyboard;

      const board = new Rect({
        x,
        y,
        width,
        height,
        fill,
        cornerRadius: 5,
        cursor: 'pointer',
        data: {
          isBoard: true,
          type,
        },
      });

      if (type === 'y') {
        this.center = board;
      }

      this.container.add(board);

      if (text) {
        let fontSize = 18;
        let label = text as string;
        let lineHeight = 18;
        if (typeof text !== 'string') {
          fontSize = text.fontSize;
          if (Array.isArray(text.label)) {
            if (text.label.length === 2) {
              label = `${text.label[0]}
              ${text.label[1]}`;
            } else if (text.label.length === 3) {
              label = `${text.label[0]}  ${text.label[1]}
              ${text.label[2]}`;
            } else if (text.label.length === 4) {
              label = `${text.label[0]}  ${text.label[1]}
              ${text.label[2]}  ${text.label[3]} `;
            } else {
              label = text.label[0];
            }
            lineHeight = text.lineHeight || 10;
          } else {
            label = text.label;
          }
        }
        const textNode = new Text({
          text: label,
          fontSize,
          lineHeight,
          x: x,
          y: y,
          width,
          height,
          fill: 'white',
          textAlign: 'center',
          verticalAlign: 'middle',
          data: {
            board,
          },
          cursor: 'pointer',
        });

        this.container.add(textNode);
      }
    });
  }

  drawBarLight(audiosData: Uint8Array<any>) {
    const keyboards = this.container.children;

    const segmentSize = 64;

    const freqs = [];

    let i = 1,
      sum = 0,
      count = 0;
    while (i <= audiosData.length) {
      if (i % segmentSize === 0) {
        const avg = Math.round(sum / count);
        freqs.push(avg);
        sum = 0;
        count = 0;
      } else {
        count++;
        sum += audiosData[i - 1];
      }
      i++;
    }

    keyboards.forEach((keyboard) => {
      const { x, y, width, height } = keyboard;

      const positionX = x + width / 2;
      const positionY = y + height / 2;

      const xIdx = Math.round(positionX / 60);
      const yIdx = Math.round(positionY / 60);

      const freq = freqs[xIdx];
      const f = freq / 255;

      if (6 - yIdx > Math.round(f * 6)) {
        if (!keyboard.data.isDown) {
          keyboard.shadow = undefined;
        }
      } else {
        keyboard.shadow = {
          x: 0,
          y: 0,
          blur: 12,
          color: this.color,
        };
      }
    });
  }

  drawWaveLight(dataArray: Uint8Array<any>) {
    // 强度
    let intensity = 0;

    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i] > 200 || dataArray[i] < 40) {
        intensity = 3;
        break;
      } else if (dataArray[i] > 180 || dataArray[i] < 60) {
        intensity = 2;
        break;
      } else if (dataArray[i] > 160 || dataArray[i] < 80) {
        intensity = 1;
        break;
      }
    }
    const now = Date.now();

    if (this.waveLastTime) {
      // if (now - this.waveLastTime < 200) return;
    }
    this._drawWaveLight(intensity);
    this.waveLastTime = now;
    this.waveLastIntensity = intensity;
  }

  _drawWaveLight(intensity: number) {
    if (intensity === 1) {
      this.waveData[0].forEach((keyboard) => {
        keyboard.shadow = {
          x: 0,
          y: 0,
          blur: 12,
          color: this.color,
        };
      });
      this.waveData[1].forEach((keyboard) => {
        keyboard.shadow = undefined;
      });
    } else if (intensity === 2) {
      this.waveData[0].concat(this.waveData[1]).forEach((keyboard) => {
        keyboard.shadow = {
          x: 0,
          y: 0,
          blur: 12,
          color: this.color,
        };
      });
    } else if (intensity === 3) {
      let i = 1;
      while (i <= 6) {
        this.waveData[i].forEach((keyboard) => {
          new Animate(
            keyboard,
            [
              {
                shadow: {
                  x: 0,
                  y: 0,
                  blur: 12,
                  color: this.color,
                },
              },
              { shadow: undefined },
            ],
            { duration: 1, delay: 0.12 * i }
          );
        });
        i++;
      }
    } else {
      this.waveData[0].concat(this.waveData[1]).forEach((keyboard) => {
        keyboard.shadow = undefined;
      });
    }

    this.center.shadow = {
      x: 0,
      y: 0,
      blur: 12,
      color: this.color,
    };
  }

  closeLight() {
    this.container?.children.forEach((keyboard) => {
      keyboard.shadow = undefined;
    });
  }
}
