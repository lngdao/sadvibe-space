import React, { useRef, useState } from 'react';
import { Volume, Volume1, Volume2, VolumeX } from 'react-feather';
import styled from 'styled-components';
import { dark, light } from '../../config/theme';
import { useStore } from '../../store';
import Tooltip from '../Tooltip';

import './VolumeControl.css';

const VolumeBar = styled.input`
  &::-webkit-slider-thumb {
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background: ${(props) =>
      props.className?.includes('dark') ? dark.content : light.content};
  }
`;

function VolumeControl() {
  const [showVolumeBar, setShowVolumeBar] = useState<boolean>(false);
  const { theme } = useStore((state) => state.setting);

  const { volume } = useStore((state) => state.volume);
  const updateVolume = useStore((state) => state.updateVolume);

  const currentVolume = useRef<number>(volume);

  const renderIconVolume = () => {
    let icon;
    const iconConfig = {
      size: 24,
      color: theme.value.content,
      cursor: 'pointer',
      className: 'volume-icon',
      onClick: () => {
        updateVolume({ volume: volume == 0 ? currentVolume.current : 0 });
      },
    };

    if (volume == 0) icon = <VolumeX {...iconConfig} />;
    else if (volume < 0.3) icon = <Volume {...iconConfig} />;
    else if (volume < 0.7) icon = <Volume1 {...iconConfig} />;
    else icon = <Volume2 {...iconConfig} />;

    return icon;
  };

  return (
    <div
      className="volume-control"
      onMouseEnter={() => {
        setShowVolumeBar(true);
      }}
      onMouseLeave={() => {
        setShowVolumeBar(false);
      }}
    >
      <Tooltip
        text={`${Math.floor(volume * 100)}%`}
        childWrapperStyle={{width: '70px'}}
        children={
          <VolumeBar
            className={`volume-bar ${theme.type}`}
            type={'range'}
            min={0}
            max={1}
            value={volume}
            step={0.02}
            onChange={(event) => {
              currentVolume.current = event.target.valueAsNumber;
              updateVolume({ volume: event.target.valueAsNumber });
            }}
            style={{
              visibility: showVolumeBar ? 'visible' : 'hidden',
              position: showVolumeBar ? 'relative' : 'absolute',
              opacity: showVolumeBar ? 1 : 0,
              transform: `translateX(${showVolumeBar ? '0%' : '-15%'})`,
            }}
          />
        }
      />
      {renderIconVolume()}
    </div>
  );
}

export default VolumeControl;
