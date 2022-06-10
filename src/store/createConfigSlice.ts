import { SliceStateCreator } from './index';

export type TConfig = {
  onFirstAccess: boolean;
};

export interface IConfigSlice {
  config: TConfig;
  updateConfig: (data: TConfig) => void;
}

const createConfigSlice: SliceStateCreator<IConfigSlice> = (set, get) => ({
  config: { onFirstAccess: true },
  updateConfig(data) {
    set((state) => ({ config: data }));
  },
});

export default createConfigSlice;
