import { useEffect, useRef, useState } from 'react';

import { Alert, Button, InputNumber, message, Modal } from 'antd';
import MineSweeper from './minesweeper';
import { useDebounce, useWindowSize } from 'react-use';
import storage from '../../utils/storage';

const storagePrefix = 'minesweeper_';

const defaultPersistConfig = storage.get(`${storagePrefix}config`) || {
  x: 15,
  y: 15,
  bomberCount: 20,
};

let defaultConfig = {
  ...defaultPersistConfig,
  width: 800,
  height: 800,
  gap: 2,
};

export default function Page() {
  const minesweeperRef = useRef<MineSweeper>();

  const { width, height } = useWindowSize();

  defaultConfig = {
    ...defaultConfig,
    width: Math.min(
      800,
      Math.min(Math.round(height * 0.82), Math.round(width * 0.82))
    ),
    height: Math.min(
      800,
      Math.min(Math.round(height * 0.82), Math.round(width * 0.82))
    ),
  };

  const [config, setConfig] = useState(defaultConfig);

  const [resultOpen, setResultOpen] = useState(false);
  const [result, setResult] = useState(false);

  const { x, y, bomberCount } = config;

  useDebounce(
    () => {
      if (!minesweeperRef.current) return;
      storage.set(`${storagePrefix}config`, config);
      minesweeperRef.current.update(config);
    },
    1000,
    [config]
  );

  useEffect(() => {
    minesweeperRef.current = new MineSweeper({
      ...config,
      view: 'minesweeper',
      onFail() {
        setResult(false);
        setResultOpen(true);
      },
      onSuccess() {
        setResult(true);
        setResultOpen(true);
      },
    });
  }, []);

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
                const maxBomberCount = Math.round(0.6 * x * y);
                if (value > maxBomberCount) {
                  message.error(`炸弹数量不能超过 ${maxBomberCount}!`);
                  setConfig({ ...config, bomberCount: maxBomberCount });
                } else {
                  setConfig({ ...config, bomberCount: value });
                }
              }
            }}
          ></InputNumber>
        </div>
        <Button
          type="primary"
          onClick={() => {
            minesweeperRef.current.reset();
          }}
          className="ml-[12px]"
        >
          重新开始
        </Button>
      </div>
      <div id="minesweeper" className="flex items-center justify-center"></div>
      <Modal
        title="游戏结束!"
        open={resultOpen}
        closable={true}
        centered={true}
        maskClosable={true}
        onOk={() => {
          setResultOpen(false);
        }}
        onCancel={() => {
          setResultOpen(false);
        }}
        footer={null}
      >
        <div className="h-[100px] flex items-center justify-center">
          {result ? (
            <Alert message="挑战成功! 已清除所有炸弹!" type="success" />
          ) : (
            <Alert message="挑战失败! 再接再厉!" type="error" />
          )}
        </div>
      </Modal>
    </div>
  );
}
