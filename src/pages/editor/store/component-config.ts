import React from 'react';
import { create } from 'zustand';

import { IconName } from '@/componentsIconfont';

import { ComponentType } from '../core/type';
import { shapeComponent } from '../core/cmp/shape';

type CategoryType = 'base' | 'material' | 'image' | 'text';

export interface Component {
  name: string;
  icon: IconName | (() => React.ReactNode);
  model: Record<string, any> & { type: ComponentType };
}

interface ComponentCategory {
  label: string;
  type: CategoryType;
  icon: string;
  components: Component[];
}

type State = {
  componentConfig: ComponentCategory[];
};

type Action = {};

const componentConfig: ComponentCategory[] = [
  {
    label: '基础',
    type: 'base',
    icon: 'wenzi',
    components: [...shapeComponent],
  },
  {
    label: '文字',
    type: 'text',
    icon: 'wenzi',
    components: [],
  },
  {
    label: '图片',
    type: 'image',
    icon: 'tupian',
    components: [],
  },
  {
    label: '素材',
    type: 'material',
    icon: 'sucai',
    components: [],
  },
];

const useComponentConfigStore = create<State & Action>(() => ({
  componentConfig,
}));

export { useComponentConfigStore };
