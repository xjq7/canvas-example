import Iconfont from '~/components/Iconfont';
import S from './index.module.less';
import { useLayoutStore } from '../../store/layout';
import { useState } from 'react';
import classNames from 'classnames';
import { useComponentStore } from '../../store/components';

const items = [
  {
    label: '模板',
    icon: 'moban',
  },
  {
    label: '素材',
    icon: 'sucai',
  },
  {
    label: '文字',
    icon: 'wenzi',
  },
];

export default function Material() {
  const [activeIdx, setActiveIdx] = useState(0);
  const { asideOpen, updateAsideOpen } = useLayoutStore();
  const { addCmp } = useComponentStore();

  const Item = ({ item, index }) => {
    return (
      <div
        className={classNames(S.item, index === activeIdx && S['item-active'])}
        onClick={() => {
          setActiveIdx(index);
          addCmp('RECT');
        }}
      >
        <Iconfont name={item.icon} />
        <span>{item.label}</span>
      </div>
    );
  };

  return (
    <aside className={S.material}>
      <div className={S.content}>
        <div className={S.list}>
          {items.map((item, index) => (
            <Item item={item} index={index} />
          ))}
        </div>

        {asideOpen && <div className={S.aside}></div>}
      </div>

      <div
        className={S.menu}
        onClick={() => {
          updateAsideOpen(!asideOpen);
        }}
      >
        {asideOpen ? <Iconfont name="jiantou" /> : <Iconfont name="jiantou1" />}
      </div>
    </aside>
  );
}
