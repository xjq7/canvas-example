import { useEffect, useRef, useState } from 'react';

import { Alert, Button, InputNumber, Modal, Switch } from 'antd';
import MineSweeper, { TapType } from './minesweeper';

const defaultConfig = {
  width: 800,
  height: 800,
  x: 15,
  y: 15,
  gap: 2,
  bomberCount: 20,
};

export default function Page() {
  const minesweeperRef = useRef<MineSweeper>();

  const [tapType, setTapType] = useState<TapType>('view');

  const [config, setConfig] = useState(defaultConfig);

  const [resultOpen, setResultOpen] = useState(false);
  const [result, setResult] = useState(false);

  const { x, bomberCount } = config;

  useEffect(() => {
    if (!minesweeperRef.current) return;
    minesweeperRef.current.update(config);
  }, [config]);

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

  useEffect(() => {
    minesweeperRef.current.tapType = tapType;
  }, [tapType]);

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
            value={tapType === 'view'}
            onChange={(value) => setTapType(value ? 'view' : 'mark')}
          ></Switch>
          <span className="ml-[5px]">
            {tapType === 'view' ? '查看' : '标记'}
          </span>
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
