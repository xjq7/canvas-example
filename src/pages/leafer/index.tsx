import { useEffect } from 'react';

import { App, Rect } from 'leafer-ui';
import S from './index.module.less';

import { Editor } from '@leafer-in/editor';
import '@leafer-in/view';

export default function Component() {
  useEffect(() => {
    const app = new App({
      view: 'leafer-container',
      width: 1200,
      height: 1200,
    });

    app.tree = app.addLeafer();
    app.sky = app.addLeafer({ type: 'draw', usePartRender: false });

    const rect1 = Rect.one(
      { editable: true, fill: '#FEB027', cornerRadius: [20, 0, 0, 20] },
      100,
      100
    );
    app.tree.add(rect1);
    app.tree.add(
      Rect.one(
        { editable: true, fill: '#FFE04B', cornerRadius: [0, 20, 20, 0] },
        300,
        100
      )
    );

    app.editor = new Editor();

    setTimeout(() => {
      app.tree.remove(rect1);
      app.editor.cancel();
    }, 5000);
    app.sky.add(app.editor);

    return () => {
      app.destroy();
    };
  }, []);

  return <div id="leafer-container" className={S.container}></div>;
}
