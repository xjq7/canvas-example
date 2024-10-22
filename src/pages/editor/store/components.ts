import { create } from 'zustand';
import Editor from '../core/editor';
import { BaseModel } from '../core/cmp/base';
import * as cmpFactory from '../core/cmp/factory';

type State = {
  components: any[];
  editor: Editor;
  selectCmp: any;
};

type Action = {
  addCmp: (model: BaseModel) => void;
  updateCmp: (id: string, data, needUpdate: boolean) => void;
  removeCmp: (id: string, needUpdate: boolean) => void;
  updateEditor: (editor: Editor) => void;
  updateSelectCmp: (selectCmp: any) => void;
};

const useComponentStore = create<State & Action>((set, get) => ({
  components: [],
  editor: null,
  selectCmp: null,
  addCmp(model: BaseModel) {
    const { editor, components } = get();
    set({ components: [...components, model] });
    editor.addCmp(cmpFactory.create(model.type, model));
  },
  updateCmp(id: string, data, needUpdate: boolean) {
    console.log(id, data, needUpdate);
  },
  removeCmp(id: string, needUpdate: boolean) {
    console.log(id, needUpdate);
  },
  updateEditor(editor) {
    set({ editor });
  },
  updateSelectCmp(selectCmp) {
    set({ selectCmp });
  },
}));

export { useComponentStore };
