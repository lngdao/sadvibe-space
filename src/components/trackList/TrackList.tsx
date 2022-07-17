import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, Pause, Play } from 'react-feather';
import { useConfigStore, useStore } from '../../store';
import Empty from '../Empty';
import SearchBar from '../searchBar/SearchBar';
import Tooltip from '../Tooltip';

import './TrackList.style.css';

interface Props {
  sidebar: boolean;
  useToggleSidebar: () => void;
  playerPlayStatus: boolean;
  onRightStatusClick: () => void;
}

const TrackList = ({
  sidebar,
  useToggleSidebar,
  playerPlayStatus,
  onRightStatusClick,
}: Props) => {
  const { audios, currentTrack } = useStore((state) => state.audio);
  const { theme } = useStore((state) => state.setting);
  const updateAudio = useStore((state) => state.updateAudio);
  const updateConfig = useConfigStore((state) => state.updateConfig);

  const [tracklist, setTracklist] = useState(audios);
  const [textSearch, setTextSearch] = useState<string>('');

  const handleOnSearch = () => {
    if (textSearch.length) {
      let listSearch = audios.filter((item) => {
        let audioName = `${item.singer} - ${item.name}`.toLowerCase();

        return audioName.includes(textSearch.toLowerCase());
      });

      setTracklist(listSearch);
    } else {
      setTracklist(audios);
    }
  };

  useEffect(() => {
    setTracklist(audios);
  }, [audios]);

  useEffect(() => {
    handleOnSearch();
  }, [textSearch]);

  const tracklistElems = tracklist.map((item, index) => {
    const isCurrentAudio = _.isEqual(item, currentTrack);

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
      // <Tooltip
      // text={''}
      // position="left"
      // fontSize={13}
      // opacity={0.8}
      // children={
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
      //   }
      // />
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
