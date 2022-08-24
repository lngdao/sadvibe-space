import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, Pause, Play } from 'react-feather';
import { useConfigStore, useStore } from '../../store';
import { TAudio } from '../../store/createAudioSlice';
import T from '../../translation/T';
import { measureTextWidth } from '../../utils/funcUtils';
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
  const { theme, lng } = useStore((state) => state.setting);
  const updateAudio = useStore((state) => state.updateAudio);
  const updateConfig = useConfigStore((state) => state.updateConfig);

  const [tracklist, setTracklist] = useState(audios ?? []);
  const [textSearch, setTextSearch] = useState<string>('');

  const { result, playing_state, songs } = T();

  const handleMarqueeStatus = (currentTrack: TAudio) => {
    const title = `${playing_state}: ${currentTrack.singer} - ${currentTrack.name}`;
    const titleWrapperWidth =
      document.querySelector('.tracklist-status')?.clientWidth;
    const actualTitleWidth = measureTextWidth(title);
    const titleElm = document.querySelector('.tracklist-status__left > p');

    if (actualTitleWidth * 0.8 > titleWrapperWidth! * 0.75) {
      // measure width text diff with measured value about 20%
      if (!titleElm?.classList.contains('marquee'))
        titleElm?.classList.add('marquee');
    } else {
      if (titleElm?.classList.contains('marquee'))
        titleElm?.classList.remove('marquee');
    }
  };

  const handleOnStatusLeftClick = () => {
    const eleIdx = currentTrack
      ? audios.findIndex((ele) => ele == currentTrack)
      : 0;

    const targetElm = document.querySelectorAll('.tracklist-item')[
      eleIdx
    ] as HTMLElement;

    // targetElm.scrollIntoView()

    const tracklistElm = document.querySelector(
      '.tracklist-list'
    ) as HTMLElement;
    tracklistElm!.scrollTop =
      targetElm.offsetTop - tracklistElm!.clientHeight / 2;
  };

  useEffect(() => {
    if (currentTrack) {
      handleMarqueeStatus(currentTrack);
    }
  }, [currentTrack, lng]);

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
        {T().playlist.toUpperCase()}
      </h2>
      <section className="tracklist-list">
        {tracklist.length ? <ul>{tracklistElems}</ul> : <Empty />}
      </section>
      <section className="tracklist-btm">
        <SearchBar
          onClearField={() => setTextSearch('')}
          rightStatus={textSearch.length ? `${tracklist.length} ${result}` : ''}
          deboundDelay={200}
          onSearch={(text) => setTextSearch(text)}
        />
        <div className="tracklist-status">
          <div
            style={{ color: theme.value.highlight }}
            className="tracklist-status__left"
            onClick={handleOnStatusLeftClick}
          >
            <div
              style={{
                background: theme.value.primary,
                color: theme.value.grey,
              }}
            >
              {playing_state}:
            </div>
            <p>
              {currentTrack &&
                `${currentTrack?.singer} - ${currentTrack?.name}`}
            </p>
          </div>
          <div
            style={{ color: theme.value.title }}
            className="tracklist-status__right"
          >
            {audios.length} {songs.toLowerCase()}
          </div>
        </div>
        <div
          style={{
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
          }}
          onClick={useToggleSidebar}
        >
          <ChevronLeft size={21} color={theme.value.content} />
          <strong style={{ color: theme.value.content }}>{T().back}</strong>
        </div>
      </section>
    </div>
  );
};

export default TrackList;
