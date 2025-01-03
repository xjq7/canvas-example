import { Leafer, Path } from 'leafer-ui';
import * as utils from '@/utils/utils';
import { snowflakePath } from './constants';

const snowflakeTypes = Object.keys(snowflakePath);

export interface SnowflakeConfig {
  view: HTMLCanvasElement | string;
  density?: number;
  speed?: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
}

export default class Snowflake {
  config: SnowflakeConfig;
  leafer: Leafer;

  constructor(config: SnowflakeConfig) {
    const {
      density = 30,
      speed = {
        x: 0.1,
        y: 1.5,
      },
    } = config;
    this.config = { ...config, density, speed };

    const { width, height, view } = config;

    this.leafer = new Leafer({ view, width, height, fill: 'black' });

    this.draw();
  }

  draw() {
    this.leafer.clear();
    const { density } = this.config;

    for (let i = 0; i < density * 10; i++) {
      const x = Math.random() * this.leafer.width;
      const y = Math.random() * this.leafer.height * 0.9;

      const size = utils.randomValue(0.5, 1.2, true);

      this.drawSnowflake(x, y, size);
    }
  }

  drawSnowflake(x: number, y: number, size: number) {
    const { speed } = this.config;
    const pathIdx = utils.randomValue(0, snowflakeTypes.length);

    const snowflake = new Path({
      path: snowflakePath[snowflakeTypes[pathIdx]],
      fill: 'white',
      scale: size / 3,
      rotation: 0,
      animation: {
        style: {
          rotation: 360,
        },
        duration: 18,
        swing: true,
      },
      x,
      y,
      data: {
        speedX: Math.random() > 0.5 ? speed.x : -speed.x,
        speedY: speed.y,
      },
      around: 'center',
    });

    this.leafer.add(snowflake);

    const down = () => {
      snowflake.y += 0.2;

      if (snowflake.x < 0 || snowflake.x > this.leafer.width) {
        snowflake.data.speedX = -snowflake.data.speedX;
      }

      snowflake.x += snowflake.data.speedX;

      if (snowflake.y > this.leafer.height) {
        snowflake.y = 0;
      }
      requestAnimationFrame(down);
    };
    down();
  }

  update(config: Partial<SnowflakeConfig>) {
    this.config = { ...this.config, ...config };

    this.draw();
  }
}
