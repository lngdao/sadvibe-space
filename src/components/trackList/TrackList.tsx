import _ from 'lodash';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ChevronLeft, Frown, Pause, Play } from 'react-feather';
import { useConfigStore, useStore } from '../../store';
import Empty from '../Empty';
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
  const { theme } = useStore((state) => state.setting);
  const updateAudio = useStore((state) => state.updateAudio);
  const updateConfig = useConfigStore((state) => state.updateConfig);

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
      size: 15,
      fill: theme.value.content,
      color: theme.value.content,
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
            updateConfig({ onFirstAccess: false });
            updateAudio(item);
          }}
          style={{
            color: isCurrentAudio ? theme.value.content : theme.value.grey,
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
        background: theme.value.primary,
        left: sidebar ? 0 : -550,
        display: sidebar ? 'flex' : 'none',
        // opacity: sidebar ? 1 : 0,
      }}
    >
      <h2 style={{ color: theme.value.title }} className="tracklist-title">
        PLAYLIST
      </h2>
      <section className="tracklist-list">
        {tracklist.length ? (
          <ul>{tracklistElems}</ul>
        ) : (
          <Empty emptyTxt={'List is empty'} />
          // <div className="emptyList">
          //   <Frown color={theme.value.content} size={40} />
          //   <h4 style={{ color: theme.value.content }}>List is empty</h4>
          // </div>
        )}
      </section>
      <section className="tracklist-btm">
        <SearchBar
          onClearField={() => setTextSearch('')}
          rightStatus={textSearch.length ? `${tracklist.length} result` : ''}
          deboundDelay={200}
          onSearch={(text) => setTextSearch(text)}
        />
        <div
          style={{
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
          }}
          onClick={useToggleSidebar}
        >
          <ChevronLeft size={21} color={theme.value.content} />
          <strong style={{ color: theme.value.content }}>Back</strong>
        </div>
      </section>
    </div>
  );
};

export default TrackList;
