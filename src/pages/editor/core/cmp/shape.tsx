import Iconfont from '@/components/Iconfont';
import { Component } from '../../store/component-config';
import { ComponentType } from '../type';
import { baseModel } from './base';

const rect: Component = {
  name: '矩形',
  icon: () => <Iconfont size={28} name="xingzhuang-juxing"></Iconfont>,
  model: {
    ...baseModel,
    type: ComponentType.Rect,
    width: 150,
    height: 150,
    fill: 'lime',
  },
};

const triangle: Component = {
  name: '三角形',
  icon: () => <Iconfont size={28} name="xingzhuang-sanjiaoxing"></Iconfont>,
  model: {
    ...baseModel,
    type: ComponentType.Polygon,
    width: 100,
    height: 100,
    sides: 3,
    fill: 'lime',
  },
};

const circle: Component = {
  name: '圆',
  icon: () => <Iconfont size={28} name="yuanhuan"></Iconfont>,
  model: {
    ...baseModel,
    type: ComponentType.Rect,
    width: 150,
    height: 150,
    fill: 'lime',
  },
};

export const shapeComponent = [rect, triangle, circle];
