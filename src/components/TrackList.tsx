import React, { Dispatch, SetStateAction } from 'react';
import { ChevronLeft } from 'react-feather';
import { useConfigStore, useStore } from '../store';
import './TrackList.style.css';

interface Props {
  sidebar: boolean;
  useToggleSidebar: () => void;
  listAudio: Array<any>;
}

const TrackList = ({ sidebar, useToggleSidebar, listAudio }: Props) => {
  const audio = useStore((state) => state.audio);
  const updateAudio = useStore((state) => state.updateAudio);
  const updaConfig = useConfigStore((state) => state.updateConfig);

  const tracklistElems = listAudio.map((item, index) => {
    const isCurrentAudio = item === audio;

    return (
      <li
        onClick={() => {
          updaConfig({ onFirstAccess: false });
          updateAudio(item);
        }}
        className="tracklist-item"
        key={index}
      >
        <span style={{ fontWeight: isCurrentAudio ? 'bold' : 'normal' }}>
          <strong>{isCurrentAudio ? '> ' : ''}</strong>
          {`${item.singer} - ${item.name}`}
        </span>
      </li>
    );
  });

  return (
    <div
      className="tracklist"
      style={{
        left: sidebar ? 0 : -550,
        display: sidebar ? 'block' : 'none',
        // opacity: sidebar ? 1 : 0,
      }}
    >
      <h2 className="tracklist-title">PLAYLIST</h2>
      <section className="tracklist-list">
        <ul>{tracklistElems}</ul>
      </section>
      <section onClick={useToggleSidebar} className="tracklist-btm">
        <div>
          <ChevronLeft size={21} color={'#333'} />
          <h3>Back</h3>
        </div>
      </section>
    </div>
  );
};

export default TrackList;
