import React from 'react';
import classNames from 'classnames';
import './iconfont.css';

type IconName = 'moban' | 'yonghu' | 'wenzi' | 'sucai' | 'jiantou' | 'jiantou1';

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {
  name: IconName;
  size?: number;
  style?: React.CSSProperties;
  className?: string;
}

function Component(props: Props) {
  const { name, className, size = 24, style, ...restProps } = props;
  return (
    <span
      className={classNames('iconfont', 'icon-' + name, className)}
      style={{ fontSize: size, cursor: 'pointer', ...style }}
      {...restProps}
    ></span>
  );
}

export default Component;
