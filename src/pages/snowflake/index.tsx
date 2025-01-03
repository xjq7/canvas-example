import { useEffect, useRef, useState } from 'react';
import Snowflake, { SnowflakeConfig } from './snowflake';
import S from './index.module.less';
import { InputNumber } from 'antd';
import { useDebounce, useWindowSize } from 'react-use';

const defaultConfig: SnowflakeConfig = {
  density: 10,
  view: 'snowflake',
  width: window.innerWidth,
  height: window.innerHeight,
};

export default function Component() {
  const snowflakeRef = useRef<Snowflake>();

  const [config, setConfig] = useState(defaultConfig);
  const { width, height } = useWindowSize();

  useEffect(() => {
    snowflakeRef.current = new Snowflake(config);
  }, []);

  const [,] = useDebounce(
    () => {
      snowflakeRef.current.update(config);
    },
    500,
    [config]
  );

  useEffect(() => {
    setConfig((prev) => ({ ...prev, width, height }));
  }, [width, height]);

  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center background-[#aaa] flex-col">
      <div className={S.settings}>
        密度: &nbsp;
        <InputNumber
          placeholder="请输入密度"
          value={config.density}
          max={100}
          onChange={(val) => {
            setConfig({ ...config, density: val });
          }}
        />
      </div>
      <div id="snowflake" className="flex items-center justify-center"></div>
    </div>
  );
}
