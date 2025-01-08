import { Group, Leafer, Rect, Text } from 'leafer-ui';
import { keyboards } from './constants';

interface IMarchingMusicConfig {}

const colors = ['#ed5a65', '#43b244', '#58B2DC', '#8A6BBE'];

export class MarchingMusic {
  leafer: Leafer;
  config: IMarchingMusicConfig;
  start: { x: number; y: number };
  color: string = colors[0];

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
    this.start = {
      x: (window.innerWidth - 860) / 2,
      y: (window.innerHeight - 350) / 2,
    };
    this.drawKeyboard();
  }

  drawKeyboard() {
    this.leafer.clear();

    const containerX = this.start.x;
    const containerY = this.start.y;

    const container = new Group({
      x: containerX,
      y: containerY,
    });
    this.leafer.add(container);

    keyboards.forEach((keyboard) => {
      const { x, y } = keyboard;
      const { width, height, fill, text } = keyboard;

      const board = new Rect({
        x,
        y,
        width,
        height,
        fill,
        cornerRadius: 5,
      });
      container.add(board);

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
        });

        container.add(textNode);
      }
    });
  }

  drawLight(audiosData: Uint8Array<any>) {
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
      console.log(yIdx, Math.round(f * 6));

      if (6 - yIdx > Math.round(f * 6)) {
        keyboard.shadow = undefined;
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
}
