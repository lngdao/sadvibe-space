import React, { useRef, useState } from 'react';
import { Volume, Volume1, Volume2 } from 'react-feather';
import { useStore } from '../store';

import './VolumeControl.css';

function VolumeControl() {
  const [showVolumeBar, setShowVolumeBar] = useState<boolean>(false);

  const { volume } = useStore((state) => state.volume);
  const updateVolume = useStore((state) => state.updateVolume);

  const currentVolume = useRef<number>(volume);

  const renderIconVolume = () => {
    let icon;
    const iconConfig = {
      size: 24,
      color: '#333',
      cursor: 'pointer',
      className: 'volume-icon',
      onClick: () => {
        updateVolume({ volume: volume == 0 ? currentVolume.current : 0 });
      },
    };

    if (volume == 0) icon = <Volume {...iconConfig} />;
    else if (volume < 0.6) icon = <Volume1 {...iconConfig} />;
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
      <input
        className="volume-bar"
        style={{
          visibility: showVolumeBar ? 'visible' : 'hidden',
          position: showVolumeBar ? 'relative' : 'absolute',
          opacity: showVolumeBar ? 1 : 0,
          transform: `translateX(${showVolumeBar ? '0%' : '-15%'})`,
        }}
        type="range"
        min={0}
        max={1}
        value={volume}
        step={0.02}
        onChange={(event) => {
          currentVolume.current = event.target.valueAsNumber;
          updateVolume({ volume: event.target.valueAsNumber });
        }}
      />
      {renderIconVolume()}
    </div>
  );
}

export default VolumeControl;
