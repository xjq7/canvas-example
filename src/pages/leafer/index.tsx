import { useEffect } from 'react';

import { Leafer, Rect } from 'leafer-ui';
import S from './index.module.less';

export default function Component() {
  useEffect(() => {
    const leafer = new Leafer({
      view: 'leafer-container',
      width: 600,
      height: 600,
    });

    const rect = new Rect({
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      fill: '#32cd79',
      cornerRadius: [50, 80, 0, 80],
      draggable: true,
    });

    leafer.add(rect);
    return () => {
      leafer?.destroy();
    };
  }, []);
  return <div id="leafer-container" className={S.container}></div>;
}
