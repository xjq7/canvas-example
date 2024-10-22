import { useMemo, useState } from 'react';
import classNames from 'classnames';

import Iconfont from '@/components/Iconfont';
import { useLayoutStore } from '../../store/layout';

import { useComponentStore } from '../../store/components';
import { useComponentConfigStore } from '../../store/component-config';
import S from './index.module.less';

export default function Material() {
  const { componentConfig } = useComponentConfigStore();

  const [activeType, setActiveType] = useState(componentConfig[0].type);
  const { asideOpen, updateAsideOpen } = useLayoutStore();
  const { addCmp } = useComponentStore();

  const components = useMemo(() => {
    const currentComponents = componentConfig.find(
      (o) => o.type === activeType
    );
    return currentComponents.components;
  }, [componentConfig, activeType]);

  const Item = ({ item }) => {
    return (
      <div
        className={classNames(
          S.item,
          item.type === activeType && S['item-active']
        )}
        onClick={() => {
          setActiveType(item.type);
          updateAsideOpen(true);
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
          {componentConfig.map((item) => (
            <Item item={item} key={item.type} />
          ))}
        </div>

        {asideOpen && (
          <div className={S.aside}>
            {components.map((cmp) => {
              return (
                <div
                  className={S.item}
                  onClick={() => {
                    addCmp(cmp.model as any);
                  }}
                  key={cmp.name}
                >
                  {typeof cmp.icon === 'string' ? (
                    <Iconfont name={cmp.icon}></Iconfont>
                  ) : (
                    cmp.icon()
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div
        className={S.menu}
        onClick={() => {
          updateAsideOpen(!asideOpen);
        }}
      >
        {asideOpen ? <Iconfont name="jiantou1" /> : <Iconfont name="jiantou" />}
      </div>
    </aside>
  );
}
