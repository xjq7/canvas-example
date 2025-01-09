import { Group, Leafer, PointerEvent, Rect, Text } from 'leafer-ui';
import { keyboards } from './constants';

interface IMarchingMusicConfig {}

const colors = ['#ed5a65', '#43b244', '#58B2DC', '#8A6BBE'];

export class MarchingMusic {
  leafer: Leafer;
  config: IMarchingMusicConfig;
  start: { x: number; y: number };
  color: string = colors[0];
  center?: Rect;
  container?: Group;

  constructor(config: IMarchingMusicConfig) {
    this.config = config;
    setInterval(() => {
      this.color = colors[Math.round(Math.random() * 3)];
    }, 2000);

    this.leafer = new Leafer({ view: window });
  }

  update(config: Partial<IMarchingMusicConfig>) {
    this.config = { ...this.config, ...config };
    this.reDraw();
  }

  draw() {
    this.reDraw();
  }

  destroy() {
    this.leafer.destroy();
  }

  reDraw() {
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
    const keyboards = this.leafer.children[0].children;

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

  drawWaveLight() {
    // const { x, y, width, height } = this.center;

    const firstRound = [];

    this.container.children.forEach((keyboard) => {
      if (['t', '^6', '&7', 'u', 'h', 'g'].includes(keyboard.data.type)) {
        firstRound.push(keyboard);
      }
    });

    firstRound.forEach((keyboard) => {
      if (true) {
        keyboard.shadow = {
          x: 0,
          y: 0,
          blur: 12,
          color: this.color,
        };
      } else {
        keyboard.shadow = undefined;
      }
    });

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
