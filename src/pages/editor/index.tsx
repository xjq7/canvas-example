import { useEffect } from 'react';

import { useWindowSize } from 'react-use';

import Editor from './components/editor';
import Header from './components/header';
import Material from './components/material';
import Setting from './components/setting';

import { useLayoutStore } from './store/layout';

import S from './index.module.less';

export default function Component() {
  const { updateContentWidth } = useLayoutStore();
  const { width } = useWindowSize();

  useEffect(() => {
    updateContentWidth(width - 360);
  }, [width]);

  return (
    <div className="bg-[#f2f3f5] h-[100vh] w-[100vw]">
      <Header />
      <div className={S.content}>
        <Material />
        <Editor />
        <Setting />
      </div>
    </div>
  );
}
