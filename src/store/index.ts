import create, { GetState, SetState, StoreApi, State } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import createAudioSlice, { IAudioSlice } from './createAudioSlice';
import createConfigSlice, { IConfigSlice } from './createConfigSlice';
import createVolumeSlice, { IVolumeSlice } from './createVolumeSlice';

interface IStore extends IAudioSlice, IVolumeSlice {}

export type SliceStateCreator<
  S extends State,
  C extends State = {},
  T extends S = S & C,
  CustomSetState = SetState<T>
> = (set: CustomSetState, get: GetState<T>, api: StoreApi<T>) => S;

export const useStore = create<IStore>()(
  devtools(
    persist(
      (set, get, api) => ({
        ...createAudioSlice(set, get, api),
        ...createVolumeSlice(set, get, api),
      }),
      { name: 'storage' }
    )
  )
);

export const useConfigStore = create<IConfigSlice>(createConfigSlice);
