import React, { memo, useMemo } from 'react';
import { Meh } from 'react-feather';
import { useStore } from '../store';
import Lottie from 'lottie-react';
import catLightMode from '../asset/lottieJson/catLightMode.json';
import catDarkMode from '../asset/lottieJson/catDarkMode.json';
import T from '../translation/T';

interface Props {
  emptyTxt?: string;
  lottie?: boolean;
}

function Empty({ emptyTxt = T().list_empty, lottie }: Props) {
  const { theme } = useStore((state) => state.setting);

  const jsonThemeData: any = useMemo(
    () => (theme.type == 'light' ? catLightMode : catDarkMode),
    [theme.type]
  );

  return (
    <div className="emptyList">
      {lottie ? (
        <Lottie animationData={jsonThemeData} loop />
      ) : (
        <Meh color={theme.value.content} size={40} />
      )}
      <h4 style={{ color: theme.value.content }}>{emptyTxt}</h4>
    </div>
  );
}

export default memo(Empty);
