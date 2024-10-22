import { App, Frame, IScreenSizeData } from 'leafer-ui';

export interface IApplicationConfig {
  view: string;
  width: number;
  height: number;
}

export class Application {
  config: IApplicationConfig;
  app: App;
  page: Frame;

  constructor(config: IApplicationConfig) {
    this.config = config;
    const { view, width, height } = config;
    this.app = new App({ view, width, height, editor: {} });

    this.app.tree = this.app.addLeafer();
    this.app.ground = this.app.addLeafer();
    this.app.sky = this.app.addLeafer({ type: 'draw', usePartRender: false });
  }

  toJSON() {
    return this.app.toJSON();
  }

  resize(sizeData: IScreenSizeData) {
    this.app.resize(sizeData);
  }

  destroy() {
    this.app.destroy();
  }
}
