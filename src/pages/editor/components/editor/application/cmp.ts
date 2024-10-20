import { Rect } from 'leafer-ui';

export type CMP_TYPE = 'RECT' | 'IMAGE';

export interface IBaseCmp {
  x: number;
  y: number;
  width: number;
  height: number;
  editable: boolean;
}

const baseCmp: IBaseCmp = {
  x: 0,
  y: 0,
  width: 200,
  height: 200,
  editable: true,
};

interface IRect extends Partial<Rect> {
  type: CMP_TYPE;
}

function createRect(): IRect {
  return {
    ...baseCmp,
    type: 'RECT',
    width: 200,
    height: 200,
    fill: '#32cd79',
  };
}
function createImage() {
  return { ...baseCmp };
}

export const CmpFactory = {
  create: function (type: CMP_TYPE) {
    if (type === 'RECT') {
      const data = createRect();
      const cmp = new Rect(data);
      return [data, cmp];
    }

    return [];
  },
};
