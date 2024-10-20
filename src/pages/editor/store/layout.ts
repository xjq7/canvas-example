import { create } from 'zustand';

interface IHeader {
  height: number;
}

type State = {
  contentWidth: number;
  contentHeight: number;

  header: IHeader;

  asideOpen: boolean;
};

type Action = {
  updateAsideOpen: (asideOpen: State['asideOpen']) => void;
  updateContentWidth: (width: State['contentWidth']) => void;
};

const useLayoutStore = create<State & Action>((set, get) => ({
  contentWidth: window.innerWidth - 360,
  contentHeight: window.innerHeight - 60,
  header: { height: 60 },
  asideOpen: false,
  updateAsideOpen: (asideOpen) => {
    if (asideOpen) {
      set(() => ({ contentWidth: get().contentWidth - 300, asideOpen }));
    } else {
      set(() => ({ contentWidth: get().contentWidth + 300, asideOpen }));
    }
  },
  updateContentWidth: (width) => set(() => ({ contentWidth: width })),
}));

export { useLayoutStore };
