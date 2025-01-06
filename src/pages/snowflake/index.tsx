import { useEffect, useRef, useState } from 'react';
import { InputNumber, Select } from 'antd';
import { useDebounce, useUpdateEffect, useWindowSize } from 'react-use';
import Snowflake, { SnowflakeConfig } from './snowflake';

import S from './index.module.less';

const defaultConfig: SnowflakeConfig = {
  density: 25,
  view: 'snowflake',
  width: window.innerWidth,
  height: window.innerHeight,
  types: ['type1', 'type2', 'type3', 'type4', 'type5', 'type6'],
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

  useUpdateEffect(() => {
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
        &nbsp;&nbsp;&nbsp;&nbsp; 雪花风格: &nbsp;
        <Select
          mode="tags"
          style={{ width: 240 }}
          maxTagCount={2}
          placeholder="雪花风格"
          onChange={(value) => {
            setConfig({ ...config, types: value });
          }}
          options={[
            {
              value: 'type1',
              label: 'type1',
            },
            {
              value: 'type2',
              label: 'type2',
            },
            {
              value: 'type3',
              label: 'type3',
            },
            {
              value: 'type4',
              label: 'type4',
            },
            {
              value: 'type5',
              label: 'type5',
            },
            {
              value: 'type6',
              label: 'type6',
            },
          ]}
        />
      </div>
      <div id="snowflake" className="flex items-center justify-center"></div>
    </div>
  );
}
