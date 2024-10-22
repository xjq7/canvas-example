import { ComponentType } from '../type';

export interface BaseModel {
  x: number;
  y: number;
  width?: number;
  height?: number;
  editable: boolean;
  type?: ComponentType;
}

export const baseModel: BaseModel = {
  x: 0,
  y: 0,
  editable: true,
  type: ComponentType.Rect,
};
