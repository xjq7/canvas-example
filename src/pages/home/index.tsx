import { useEffect, useRef, useState } from 'react';
import { Card, Tag } from 'antd';
import { drawFns } from './draw';
import S from './index.module.less';

const list = Object.keys(drawFns) as (keyof typeof drawFns)[];

export default function Home() {
  const [active, setActive] = useState(list[0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const fn = drawFns[active];
    fn(ctx);
  }, [active]);

  return (
    <div className={S.container}>
      <Card title="示例" className={S.card}>
        <div className={S.content}>
          <div className={S.tab}>
            {list.map((label) => (
              <Tag.CheckableTag
                key={label}
                checked={active === label}
                onClick={() => {
                  setActive(label);
                }}
                className={S.tag}
              >
                {label}
              </Tag.CheckableTag>
            ))}
          </div>

          <canvas
            ref={canvasRef}
            width="500"
            height="500"
            style={{ border: '1px solid #000000' }}
          ></canvas>
        </div>
      </Card>
    </div>
  );
}