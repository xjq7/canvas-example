interface IConfig {
  width: number;
}

export default class G2048 {
  config: IConfig;
  constructor(config: IConfig) {
    this.config = config;
  }

  init() {}

  reset() {}
}
