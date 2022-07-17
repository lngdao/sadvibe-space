import { SliceStateCreator } from './index';

export type TAudio = {
  _id: string;
  name: string;
  singer: string;
  audioUrl: string;
  lyric: string | null;
};

export interface IAudioSlice {
  audio: { audios: Array<TAudio>; currentTrack: TAudio | null };
  updateAudio: (data: TAudio) => void;
  updateTracklist: (data: Array<TAudio>) => void;
}

const createAudioSlice: SliceStateCreator<IAudioSlice> = (set, get) => ({
  audio: { audios: [], currentTrack: null },
  updateAudio(data) {
    set((state) => ({
      ...state,
      audio: { ...state.audio, currentTrack: data },
    }));
  },
  updateTracklist(data) {
    set((state) => ({ ...state, audio: { ...state.audio, audios: data } }));
  },
});

export default createAudioSlice;
