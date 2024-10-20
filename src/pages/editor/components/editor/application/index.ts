import { Editor, EditorEvent } from '@leafer-in/editor';
import {
  App,
  Ellipse,
  Frame,
  Group,
  IScreenSizeData,
  Rect,
  PointerEvent,
} from 'leafer-ui';
import { Ruler } from 'leafer-x-ruler';
import { CMP_TYPE, CmpFactory } from './cmp';

interface IConfig {
  view: string;
  width: number;
  height: number;

  onMenuTap?: (event) => void;
  onSelect?: (event) => void;
}

const bgWidth = 500;
const bgHeight = 900;

export class Application {
  config: IConfig;
  app: App;
  page: Frame;

  constructor(config: IConfig) {
    this.config = config;
    this.init();
  }

  init() {
    const { view, width, height, onMenuTap, onSelect } = this.config;
    this.app = new App({ view, width, height, editor: {} });

    const ruler = new Ruler(this.app);
    // 添加自定义主题
    ruler.addTheme('custom1', {
      backgroundColor: '#6cb0ab',
      textColor: '#a45454',
      borderColor: '#6f4593',
      highlightColor: 'rgba(22,93,255,0.75)',
    });

    // 切换主题
    ruler.changeTheme('custom1');

    ruler.enabled = false;

    this.app.tree = this.app.addLeafer();
    this.app.ground = this.app.addLeafer();
    this.app.sky = this.app.addLeafer({ type: 'draw', usePartRender: false });

    this.app.editor = new Editor();
    this.app.sky.add(this.app.editor);

    const centerX = this.app.width / 2 - bgWidth / 2;
    const centerY = this.app.height / 2 - bgHeight / 2;
    this.page = new Frame({
      x: centerX,
      y: centerY,
      width: bgWidth,
      height: bgHeight,
      fill: 'white',
      editable: true,
    });

    const rect = new Rect({
      width: 200,
      height: 200,
      fill: '#32cd79',
      draggable: true,
    });

    const ellipse = new Ellipse({
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      innerRadius: 0.5,
      fill: 'white',
    });

    const group = new Group({
      x: 0,
      y: 0,
      editable: true,
    });

    group.add(rect);
    group.add(ellipse);

    this.app.tree.add(this.page);

    this.page.add(group);

    this.app.on(PointerEvent.MENU_TAP, onMenuTap);

    this.app.editor.on(EditorEvent.SELECT, onSelect);
  }

  addCmp(cmp: any) {
    const { type } = cmp;
    this.page.add(cmp);
    return cmp;
  }

  removeCmp() {}

  toJSON() {
    return this.app.toJSON();
  }

  updateCmp(id: string, data) {}

  resize(sizeData: IScreenSizeData) {
    this.app.resize(sizeData);
  }

  destroy() {
    this.app.destroy();
  }

  clear() {
    this.app.clear();
  }
}
