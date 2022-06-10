import { SliceStateCreator } from './index';

export type TVolume = {
  volume: number
};

export interface IVolumeSlice {
  volume: TVolume;
  updateVolume: (data: TVolume) => void;
}

const createVolumeSlice: SliceStateCreator<IVolumeSlice> = (set, get) => ({
  volume: { volume: 1 },
  updateVolume(data) {
    set((state) => ({ volume: data }));
  },
});

export default createVolumeSlice;
