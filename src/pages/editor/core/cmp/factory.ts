import { Polygon, Rect } from 'leafer-ui';
import { BaseModel } from './base';
import { ComponentType } from '../type';

export function create(type: ComponentType, model: BaseModel) {
  switch (type) {
    case ComponentType.Rect:
      return new Rect(model);
    case ComponentType.Polygon:
      return new Polygon(model);
  }

  return null;
}
