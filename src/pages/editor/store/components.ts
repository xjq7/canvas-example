import { create } from 'zustand';
import { CMP_TYPE, CmpFactory } from '../components/editor/application/cmp';
import { Application } from '../components/editor/application';

type State = {
  components: any[];
  app: Application;
  selectCmp: any;
};

type Action = {
  addCmp: (type: CMP_TYPE) => void;
  updateCmp: (id: string, data, needUpdate: boolean) => void;
  removeCmp: (id: string, needUpdate: boolean) => void;
  updateApp: (app: Application) => void;
  updateSelectCmp: (selectCmp: any) => void;
};

const useComponentStore = create<State & Action>((set, get) => ({
  components: [],
  app: null,
  selectCmp: null,
  addCmp(type: CMP_TYPE) {
    const { app, components } = get();
    const [data, cmp] = CmpFactory.create(type);
    set({ components: [...components, data] });
    app.addCmp(cmp);
  },
  updateCmp(id: string, data, needUpdate: boolean) {},
  removeCmp(id: string, needUpdate: boolean) {},
  updateApp(app) {
    set({ app });
  },
  updateSelectCmp(selectCmp) {
    set({ selectCmp });
  },
}));

export { useComponentStore };
