import { useEffect, useRef, useState } from 'react';

import { Leafer, Rect, PointerEvent, Text } from 'leafer-ui';
import bomberImage from './bomber.png';
import { InputNumber } from 'antd';

const defaultConfig = {
  width: 600,
  height: 600,
  x: 10,
  y: 12,
  gap: 2,
  bomberCount: 12,
};

export default function Page() {
  const gameStatusRef = useRef(true);

  const [config, setConfig] = useState(defaultConfig);

  useEffect(() => {
    const { width, height, x, y, gap, bomberCount } = config;

    const generateGrids = (x: number, y: number) => {
      const grids = new Array(x);

      for (let i = 0; i < x; i++) {
        grids[i] = new Array(y);
        for (let j = 0; j < y; j++) {
          grids[i][j] = 0;
        }
      }

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
    };

    const leafer = new Leafer({ view: 'minesweeper', width, height });

    const w = Math.floor((width - gap * x) / x),
      h = Math.floor((height - gap * y) / y);

    const grids = generateGrids(x, y);

    const rectGrids = new Array(x);
    for (let i = 0; i < y; i++) rectGrids[i] = new Array(y);

    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        const rect = new Rect({
          x: i * (w + gap),
          y: j * (h + gap),
          width: w,
          height: h,
          fill: '#22d2ef',
          draggable: true,
          cursor: 'pointer',
        });

        rectGrids[i][j] = rect;

        leafer.add(rect);
      }
    }

    const diffusion = (i: number, j: number) => {
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
          if (marks[x1][y1]) {
            continue;
          }

          if (grids[x1][y1] !== -1) {
            marks[x1][y1] = true;
            turnUp(x1, y1);
          }
        }
      }
    };

    const turnUp = (i: number, j: number) => {
      const target = rectGrids[i][j];
      const val = grids[i][j];
      if (val > 0) {
        const text = new Text({
          x: i * (w + gap),
          y: j * (h + gap),
          width: w,
          height: h,
          text: String(grids[i][j]),
          textAlign: 'center',
          verticalAlign: 'middle',
          fontSize: 24,
          fontWeight: 'bold',
        });

        leafer.add(text);
      } else if (val === 0) {
        diffusion(i, j);
      }
      target.fill = '#abcabc';
    };

    const marks = new Array(x);
    for (let i = 0; i < y; i++) marks[i] = new Array(y).fill(false);

    leafer.on(PointerEvent.TAP, (e) => {
      if (e.target !== leafer) {
        const { x, y } = e.target;

        const i = x / (w + gap);
        const j = y / (h + gap);
        if (grids[i][j] !== -1) {
          turnUp(i, j);
        } else {
          const bomberRect = new Rect({
            x: i * (w + gap),
            y: j * (h + gap),
            width: w,
            height: h,
            fill: {
              type: 'image',
              url: bomberImage,
            },
          });
          leafer.add(bomberRect);
        }
      }
    });

    return () => {
      leafer.destroy();
    };
  }, [config]);

  const { x, bomberCount } = config;

  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center background-[#aaa] flex-col">
      <div className="mb-[10px] flex flex-row">
        <div>
          网格规模:&nbsp;
          <InputNumber
            value={x}
            onChange={(value) => {
              if (typeof value === 'number') {
                setConfig({ ...config, x: value, y: value });
              }
            }}
          ></InputNumber>
        </div>
        <div className="ml-[20px]">
          炸弹数量:&nbsp;
          <InputNumber
            value={bomberCount}
            onChange={(value) => {
              if (typeof value === 'number') {
                setConfig({ ...config, bomberCount: value });
              }
            }}
          ></InputNumber>
        </div>
      </div>
      <div id="minesweeper" className="flex items-center justify-center"></div>
    </div>
  );
}
