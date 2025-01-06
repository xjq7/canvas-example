import { Leafer, Path } from 'leafer-ui';
import * as utils from '@/utils/utils';
import { snowflakePath } from './constants';
import { shadowEqual } from '@/utils/utils';

export interface SnowflakeConfig {
  view: HTMLCanvasElement | string;
  density?: number;
  speed?: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
  types: string[];
}

export default class Snowflake {
  config: SnowflakeConfig;
  leafer: Leafer;

  constructor(config: SnowflakeConfig) {
    const {
      density = 30,
      speed = {
        x: 0.05,
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

      const size = utils.randomValue(1.2, 1.5, true);

      this.drawSnowflake(x, y, size);
    }
  }

  drawSnowflake(x: number, y: number, size: number) {
    const { speed } = this.config;
    const { types } = this.config;
    const pathIdx = utils.randomValue(0, types.length);

    const snowflake = new Path({
      path: snowflakePath[types[pathIdx]],
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
        speedY: utils.randomValue(0.05, 0.15),
        directionInterval: utils.randomValue(500, 800),
      },
      around: 'center',
    });

    this.leafer.add(snowflake);

    const down = () => {
      snowflake.y += utils.randomValue(0.12, 0.16, true);

      snowflake.data.directionInterval--;

      if (
        snowflake.x < 0 ||
        snowflake.x > this.leafer.width ||
        (snowflake.data.directionInterval < 0 && Math.random() > 0.5)
      ) {
        snowflake.data.speedX = -snowflake.data.speedX;
        snowflake.data.directionInterval = utils.randomValue(500, 800);
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
    const mergeConfig = { ...this.config, ...config };

    if (shadowEqual(this.config, mergeConfig)) {
      return;
    }
    this.config = { ...this.config, ...config };

    this.draw();
  }
}
