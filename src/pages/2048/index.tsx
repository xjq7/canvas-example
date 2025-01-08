import { useEffect, useState } from 'react';
import { useWindowSize, useMount } from 'react-use';

export default function Component() {
  const [config, setConfig] = useState({});
  const { width, height } = useWindowSize();

  useMount(() => {});

  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center background-[#aaa] flex-col">
      <div id="" className="flex items-center justify-center"></div>
    </div>
  );
}
