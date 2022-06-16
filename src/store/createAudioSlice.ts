import { SliceStateCreator } from './index';

export type TAudio = {
  _id: string
  name: string
  singer: string
  audioUrl: string
}

export interface IAudioSlice {
  audio: TAudio | null;
  updateAudio: (data: TAudio) => void;
}

const createAudioSlice: SliceStateCreator<IAudioSlice> = (set, get) => ({
  audio: null,
  updateAudio(data) {
    set((state) => ({ audio: data }));
  },
});

export default createAudioSlice;
