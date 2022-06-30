import React from 'react';
import { Frown } from 'react-feather';
import { useStore } from '../store';

interface Props {
  emptyTxt: string;
}

function Empty({ emptyTxt }: Props) {
  const { theme } = useStore((state) => state.setting);

  return (
    <div className="emptyList">
      <Frown color={theme.value.content} size={40} />
      <h4 style={{ color: theme.value.content }}>{emptyTxt}</h4>
    </div>
  );
}

export default Empty;
