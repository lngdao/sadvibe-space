import { SliceStateCreator } from './index';
import { solidColorParamsList } from '../config/index';
import { dark, light } from '../config/theme';

export type TBackdropImage = {
  id: string;
  author: string;
  width: number;
  height: number;
  imgUrl: string;
};

type TSolidColor = typeof solidColorParamsList[number];

type TBackdrop = {
  type: 'solid' | 'image';
  value: TSolidColor | TBackdropImage;
  blur: boolean
};

type TThemeValue = Record<keyof typeof light, string>;

type TTheme = {
  type: 'dark' | 'light';
  value: TThemeValue;
};

export type TSetting = {
  backdrop: TBackdrop;
  theme: TTheme;
};

export interface ISettingSlice {
  setting: TSetting;
  updateBackdropConfig: (data: TBackdrop) => void;
  updateThemeConfig: (data: TTheme) => void;
}

const initBackdrop: TBackdrop = {
  type: 'solid',
  value: '#999B84',
  blur: false
};

const initTheme: TTheme = {
  type: 'light',
  value: light,
};

const createConfigSlice: SliceStateCreator<ISettingSlice> = (set, get) => ({
  setting: { backdrop: initBackdrop, theme: initTheme },
  updateBackdropConfig(data) {
    set((state) => ({
      ...state,
      setting: { ...state.setting, backdrop: data },
    }));
  },
  updateThemeConfig(data) {
    set((state) => ({
      ...state,
      setting: { ...state.setting, theme: data },
    }));
  },
});

export default createConfigSlice;
