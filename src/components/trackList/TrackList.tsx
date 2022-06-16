import _ from 'lodash';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ChevronLeft, Frown, Pause, Play } from 'react-feather';
import { useConfigStore, useStore } from '../../store';
import SearchBar from '../searchBar/SearchBar';

import './TrackList.style.css';

interface Props {
  sidebar: boolean;
  useToggleSidebar: () => void;
  listAudio: Array<any>;
  playerPlayStatus: boolean;
  onRightStatusClick: () => void;
}

const TrackList = ({
  sidebar,
  useToggleSidebar,
  listAudio,
  playerPlayStatus,
  onRightStatusClick,
}: Props) => {
  const audio = useStore((state) => state.audio);
  const updateAudio = useStore((state) => state.updateAudio);
  const updaConfig = useConfigStore((state) => state.updateConfig);

  const [tracklist, setTracklist] = useState(listAudio);
  const [textSearch, setTextSearch] = useState<string>('');

  const handleOnSearch = () => {
    if (textSearch.length) {
      let listSearch = listAudio.filter((item) => {
        let audioName = `${item.singer} - ${item.name}`.toLowerCase();

        return audioName.includes(textSearch.toLowerCase());
      });

      setTracklist(listSearch);
    } else {
      setTracklist(listAudio);
    }
  };

  useEffect(() => {
    setTracklist(listAudio);
  }, [listAudio]);

  useEffect(() => {
    handleOnSearch();
  }, [textSearch]);

  const tracklistElems = tracklist.map((item, index) => {
    const isCurrentAudio = _.isEqual(item, audio);

    const iconRightConfig = {
      size: 17,
      fill: '#333',
      cursor: 'pointer',
      onClick: onRightStatusClick,
    };
    const renderIconRight = !playerPlayStatus ? (
      <Play {...iconRightConfig} />
    ) : (
      <Pause {...iconRightConfig} />
    );

    return (
      <li className="tracklist-item" key={index}>
        <span
          onClick={() => {
            updaConfig({ onFirstAccess: false });
            updateAudio(item);
          }}
          style={{
            fontWeight: isCurrentAudio ? 'bold' : 'normal',
            cursor: 'pointer',
          }}
        >
          <strong>{isCurrentAudio ? '> ' : ''}</strong>
          {`${item.singer} - ${item.name}`}
        </span>
        {isCurrentAudio && renderIconRight}
      </li>
    );
  });

  return (
    <div
      className="tracklist"
      style={{
        left: sidebar ? 0 : -550,
        display: sidebar ? 'flex' : 'none',
        // opacity: sidebar ? 1 : 0,
      }}
    >
      <h2 className="tracklist-title">PLAYLIST</h2>
      <section className="tracklist-list">
        {tracklist.length ? (
          <ul>{tracklistElems}</ul>
        ) : (
          <div className="emptyList">
            <Frown size={40} />
            <h4>List is empty</h4>
          </div>
        )}
      </section>
      <section className="tracklist-btm">
        <SearchBar
          onClearField={() => setTextSearch('')}
          rightStatus={textSearch.length ? `${tracklist.length} result` : ''}
          deboundDelay={200}
          onSearch={(text) => setTextSearch(text)}
        />
        <div style={{ cursor: 'pointer' }} onClick={useToggleSidebar}>
          <ChevronLeft size={21} color={'#333'} />
          <h3>Back</h3>
        </div>
      </section>
    </div>
  );
};

export default TrackList;
