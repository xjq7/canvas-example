import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Leafer, Rect, PointerEvent, Text } from 'leafer-ui';
import { Button, InputNumber, message, Switch } from 'antd';
import bomberImage from './bomber.png';
import markImage from './mark.jpeg';

const defaultConfig = {
  width: 800,
  height: 800,
  x: 15,
  y: 15,
  gap: 2,
  bomberCount: 20,
};

type GameStatus = 'success' | 'fail' | 'gaming';

type TapType = 'mark' | 'down';

export default function Page() {
  const gameStatusRef = useRef<GameStatus>('gaming');
  const gridsRef = useRef([]);
  const rectGridsRef = useRef([]);
  const marksRef = useRef([]);
  const openRef = useRef([]);
  const leaferRef = useRef<Leafer>();
  const remainCountRef = useRef(0);
  const configRef = useRef(defaultConfig);

  const tapTypeRef = useRef<TapType>('down');
  const [tapType, setTapType] = useState<TapType>('down');

  const [config, setConfig] = useState(defaultConfig);

  const { width, height, x, y, gap, bomberCount } = config;

  const { w, h } = useMemo(() => {
    const { width, height, gap, x, y } = config;

    const w = Math.floor((width - gap * x) / x),
      h = Math.floor((height - gap * y) / y);
    return { w, h };
  }, [config]);

  const generateGrids = (x: number, y: number) => {
    const grids = new Array(x);
    for (let i = 0; i < x; i++) grids[i] = new Array(y).fill(0);

    const set = new Set();
    const { bomberCount } = config;
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

  const removeMark = (i: number, j: number) => {
    leaferRef.current.remove(marksRef.current[i][j]);
    marksRef.current[i][j] = false;
  };

  const handleTap = (e) => {
    const { bomberCount } = configRef.current;
    if (gameStatusRef.current !== 'gaming') {
      return;
    }

    if (e.target !== leaferRef.current) {
      const { x, y } = e.target;

      const i = x / (w + gap);
      const j = y / (h + gap);
      if (tapTypeRef.current === 'down') {
        if (gridsRef.current[i][j] !== -1) {
          removeMark(i, j);
          openRef.current[i][j] = true;
          turnUp(i, j);

          if (remainCountRef.current === bomberCount) {
            message.success('成功清除所有炸弹!');
            gameStatusRef.current = 'success';
          }
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
          leaferRef.current.add(bomberRect);
          gameStatusRef.current = 'fail';
          message.error('游戏结束!');
        }
      } else {
        if (openRef.current[i][j]) {
          return;
        }
        if (marksRef.current[i][j]) {
          removeMark(i, j);
        } else {
          const markRect = new Rect({
            x: i * (w + gap),
            y: j * (h + gap),
            width: w,
            height: h,
            fill: {
              type: 'image',
              url: markImage,
            },
            cursor: 'pointer',
          });
          marksRef.current[i][j] = markRect;
          leaferRef.current.add(markRect);
        }
      }
    }
  };

  const init = useCallback(() => {
    gridsRef.current = generateGrids(x, y);
    marksRef.current = new Array(x);
    for (let i = 0; i < y; i++) marksRef.current[i] = new Array(y).fill(false);
    openRef.current = new Array(x);
    for (let i = 0; i < y; i++) openRef.current[i] = new Array(y).fill(false);

    rectGridsRef.current = new Array(x);
    for (let i = 0; i < y; i++) rectGridsRef.current[i] = new Array(y);
    gameStatusRef.current = 'gaming';
    remainCountRef.current = x * y;

    const leafer = new Leafer({ view: 'minesweeper', width, height });
    leaferRef.current = leafer;

    leafer.on(PointerEvent.TAP, handleTap);

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

        rectGridsRef.current[i][j] = rect;
        leaferRef.current.add(rect);
      }
    }
  }, [config]);

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
        if (openRef.current[x1][y1]) {
          continue;
        }

        if (gridsRef.current[x1][y1] !== -1) {
          openRef.current[x1][y1] = true;
          turnUp(x1, y1);
        }
      }
    }
  };

  const turnUp = (i: number, j: number) => {
    const target = rectGridsRef.current[i][j];
    const val = gridsRef.current[i][j];
    if (val > 0) {
      const text = new Text({
        x: i * (w + gap),
        y: j * (h + gap),
        width: w,
        height: h,
        text: String(gridsRef.current[i][j]),
        textAlign: 'center',
        verticalAlign: 'middle',
        fontSize: 24,
        fontWeight: 'bold',
      });

      leaferRef.current.add(text);
    } else if (val === 0) {
      diffusion(i, j);
    }
    remainCountRef.current--;
    target.fill = '#abcabc';
  };

  useEffect(() => {
    init();
    return () => {
      leaferRef.current?.destroy();
    };
  }, [init]);

  useEffect(() => {
    tapTypeRef.current = tapType;
  }, [tapType]);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

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
        <div className="ml-[12px] flex flex-row items-center">
          <Switch
            value={tapType === 'down'}
            onChange={(value) => setTapType(value ? 'down' : 'mark')}
          ></Switch>
          <span className="ml-[5px]">
            {tapType === 'down' ? '查看' : '标记'}
          </span>
        </div>

        <Button
          type="primary"
          onClick={() => {
            init();
          }}
          className="ml-[12px]"
        >
          重新开始
        </Button>
      </div>
      <div id="minesweeper" className="flex items-center justify-center"></div>
    </div>
  );
}
