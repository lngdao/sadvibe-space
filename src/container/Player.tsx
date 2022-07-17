import axios from 'axios';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Menu,
  MessageCircle,
  Pause,
  Play,
  Repeat,
  Settings,
  SkipBack,
  SkipForward,
  Shuffle,
} from 'react-feather';
import CommentView from '../components/commentView/CommentView';
import Lyrics from '../components/Lyrics';
import PlayerProgressBar from '../components/PlayerProgressBar';
import SettingView from '../components/settingView/SettingView';
import TrackList from '../components/trackList/TrackList';
import VolumeControl from '../components/volumeControl/VolumeControl';
import { BASE_URL } from '../config';
import { useConfigStore, useStore } from '../store';
import { TBackdropImage } from '../store/createSettingSlice';
import { getRandomInRange, textWidth, toHHMMSS } from '../utils/funcUtils';
import MediaSession, { HAS_MEDIA_SESSION } from '@mebtte/react-media-session';

import './Player.style.css';
import Tooltip from '../components/Tooltip';
import { TAudio } from '../store/createAudioSlice';

enum LOOP {
  OFF = 0,
  ALL,
  SELF,
}

const TITLE_WRAPPER_HEIGHT = 30;

function Player() {
  const [player] = useState<HTMLAudioElement>(new Audio());
  const [showCommentView, setShowCommentView] = useState<boolean>(false);
  const [sidebar, setSidebar] = useState<boolean>(false);
  const [showSetting, setShowSetting] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);
  const [isEnded, setIsEnded] = useState<boolean>(false);
  const [loop, setLoop] = useState<LOOP>(LOOP.OFF);
  const [shuffle, setShuffle] = useState<Boolean>(false);
  const [playerTime, setPlayerTime] = useState({
    currentTime: '0:00',
    totalDuration: '0:00',
  });

  const trackloadedRef = useRef<boolean>(false);
  const playerSpanedTimeRef = useRef<number>(0);

  const { audios, currentTrack } = useStore((state) => state.audio);
  const { theme } = useStore((state) => state.setting);
  const { backdrop } = useStore((state) => state.setting);
  const updateAudio = useStore((state) => state.updateAudio);
  const updateTracklist = useStore((state) => state.updateTracklist);
  const config = useConfigStore((state) => state.config);
  const updateConfig = useConfigStore((state) => state.updateConfig);
  const { volume } = useStore((state) => state.volume);

  const btmIconConfig = {
    size: 25,
    color: theme.value.content,
    cursor: 'pointer',
  };

  const toggleSidebar = () => {
    setSidebar((prev) => !prev);
  };

  const toggleCommentView = () => {
    setShowCommentView((prev) => !prev);
  };

  const toggleSettingView = () => {
    setShowSetting((prev) => !prev);
  };

  const handleMarqueeTitleAudio = (currentTrack: TAudio) => {
    const title = `${currentTrack.singer.toUpperCase()} - ${currentTrack.name.toUpperCase()}`;
    const titleWrapperWidth = document.querySelector(
      '.player-track__title'
    )?.clientWidth;
    const actualTitleWidth = textWidth(title); // measure text width
    const titleElm = document.querySelector('.player-track__title > p');

    if (actualTitleWidth > titleWrapperWidth!) {
      if (!titleElm?.classList.contains('marquee'))
        titleElm?.classList.add('marquee');
    } else {
      if (titleElm?.classList.contains('marquee'))
        titleElm?.classList.remove('marquee');
    }
  };

  const handleOnChangeRepeatState = () => {
    switch (loop) {
      case LOOP.OFF:
        return setLoop(LOOP.ALL);
      case LOOP.ALL:
        return setLoop(LOOP.SELF);
      case LOOP.SELF:
        return setLoop(LOOP.OFF);
      default:
        return setLoop(LOOP.OFF);
    }
  };

  const handlePlayNextTrack = () => {
    config.onFirstAccess && updateConfig({ onFirstAccess: false });
    const currentTrackIdx = audios.indexOf(currentTrack!);
    let nextTrackIdx;
    if (shuffle) {
      nextTrackIdx = getRandomInRange(0, audios.length - 1);
    } else {
      if (currentTrackIdx == audios.length - 1) nextTrackIdx = 0;
      else nextTrackIdx = currentTrackIdx + 1;
    }

    updateAudio(audios[nextTrackIdx]);
  };

  const handlePlayPrevTrack = () => {
    config.onFirstAccess && updateConfig({ onFirstAccess: false });
    const currentTrackIdx = audios.indexOf(currentTrack!);
    let prevTrackIdx;
    if (shuffle) {
      prevTrackIdx = getRandomInRange(0, audios.length - 1);
    } else {
      if (currentTrackIdx == 0) prevTrackIdx = audios.length - 1;
      else prevTrackIdx = currentTrackIdx - 1;
    }

    updateAudio(audios[prevTrackIdx]);
  };

  const onPlayPauseClickHandler = () => {
    setPlaying((prev) => !prev);
  };

  const updatePlayerInfor = () => {
    let totalDuration = toHHMMSS(
      parseInt(player.duration.toString(), 10).toString()
    );

    let currentTime = toHHMMSS(
      parseInt(player.currentTime.toString(), 10).toString()
    );

    if (currentTime.split(':')[0] == 'NaN') currentTime = '_';
    if (totalDuration.split(':')[0] == 'NaN') totalDuration = '_';

    setPlayerTime((prev) => ({ ...prev, currentTime, totalDuration }));
  };

  const assignEventsToPlayer = () => {
    player.addEventListener('canplay', () => {
      trackloadedRef.current = true;
      updatePlayerInfor();
      if (config && !config.onFirstAccess) {
        setPlaying(true);
      }
    });

    player.addEventListener('ended', () => {
      setIsEnded(true);
      // setPlaying(false);
    });

    player.addEventListener('timeupdate', () => {
      if (trackloadedRef.current) updatePlayerInfor();
    });
  };

  const cleanPlayerEvent = () => {
    player.removeEventListener('canplay', () => {});
    player.removeEventListener('ended', () => {});
    player.removeEventListener('timeupdate', () => {});
  };

  useEffect(() => {
    axios.get(`${BASE_URL}audio`).then((res) => {
      updateAudio(res.data.data[0]);
      updateTracklist(res.data.data);
    });
  }, []);

  useEffect(() => {
    assignEventsToPlayer();

    return cleanPlayerEvent;
  }, []);

  useEffect(() => {
    if (isEnded) {
      setPlaying(false);
      if (loop == LOOP.ALL) {
        handlePlayNextTrack();
      } else if (loop == LOOP.SELF) {
        setTimeout(() => setPlaying(true), 0);
      }
    }
  }, [isEnded]);

  useEffect(() => {
    if (playing) {
      player.play();
      setIsEnded(false);
    } else player.pause();
  }, [playing]);

  useEffect(() => {
    if (currentTrack) {
      handleMarqueeTitleAudio(currentTrack);
      player.src = currentTrack.audioUrl;
      setPlaying(false);
      assignEventsToPlayer();
    }
  }, [currentTrack]);

  useEffect(() => {
    player.volume = volume;
  }, [volume]);

  const renderBackdrop = useMemo(() => {
    let backdropVal;

    if (backdrop.type == 'solid') {
      backdropVal = `${backdrop.value as string}`;
    } else {
      if (!backdrop.blur)
        backdropVal = `url('${
          (backdrop.value as TBackdropImage).imgUrl
        }') no-repeat`;
      else
        backdropVal = `url('${
          (backdrop.value as TBackdropImage).imgUrl + '/?blur'
        }') no-repeat`;
    }

    return backdropVal;
  }, [backdrop.value, backdrop.blur]);

  return (
    <div
      className="wrapper"
      style={{
        background: renderBackdrop,
      }}
    >
      {/* <MediaSession
        title="Way back"
        artist="Vicetone,Cozi Zuehlsdorff"
        album="Way Back"
        artwork={[
          {
            src: 'cover_large.jpeg',
            sizes: '256x256,384x384,512x512',
            type: 'image/jpeg',
          },
          {
            src: 'cover_small.jpeg',
            sizes: '96x96,128x128,192x192',
            type: 'image/jpeg',
          },
        ]}
        onPlay={player.play}
        onPause={player.pause}
        // onSeekBackward={onSeekBackward}
        // onSeekForward={onSeekForward}
        onPreviousTrack={handlePlayPrevTrack}
        onNextTrack={handlePlayNextTrack}
      /> */}
      <div className="player" style={{ background: theme.value.primary }}>
        <TrackList
          playerPlayStatus={playing}
          sidebar={sidebar}
          useToggleSidebar={toggleSidebar}
          onRightStatusClick={onPlayPauseClickHandler}
        />
        {showCommentView && (
          <CommentView
            showCommentView={showCommentView}
            useToggleCommentView={toggleCommentView}
          />
        )}
        <SettingView
          showSetting={showSetting}
          useToggleSetting={toggleSettingView}
        />
        <section className="player-control__top">
          <p className="play-pause-text">
            <strong style={{ color: theme.value.content }}>
              {playing ? 'PLAYING' : 'PAUSED'}
            </strong>
            <span style={{ color: theme.value.content }}>
              {playerTime.currentTime} / {playerTime.totalDuration}
            </span>
          </p>
          <VolumeControl />
        </section>
        <div
          style={{ color: theme.value.content, height: 30 }}
          className="player-track__title"
        >
          <p>
            {currentTrack
              ? `${currentTrack?.singer} - ${currentTrack?.name}`
              : 'Loading...'}
          </p>
        </div>
        <section className="player-center">
          <Lyrics player={player} />
        </section>
        <section className="player-control__btm">
          <PlayerProgressBar
            player={player}
            playerTime={playerTime}
            playerSpanedTimeRef={playerSpanedTimeRef}
            disable={!currentTrack}
          />
          <div className="player-control__container">
            <SkipBack
              size={30}
              color={theme.value.content}
              onClick={handlePlayPrevTrack}
            />
            {!playing ? (
              <Play
                onClick={onPlayPauseClickHandler}
                size={30}
                color={theme.value.content}
              />
            ) : (
              <Pause
                onClick={onPlayPauseClickHandler}
                size={30}
                color={theme.value.content}
              />
            )}
            <SkipForward
              size={30}
              color={theme.value.content}
              onClick={handlePlayNextTrack}
            />
          </div>
          <div className="player-nav__btm">
            <Tooltip
              text="Playlist"
              children={<Menu onClick={toggleSidebar} {...btmIconConfig} />}
            />
            <Tooltip
              text="Loop"
              badge={loop == LOOP.SELF ? '1' : undefined}
              children={
                <Repeat
                  onClick={handleOnChangeRepeatState}
                  {...btmIconConfig}
                  opacity={loop != LOOP.OFF ? 1 : 0.3}
                />
              }
            />
            <Tooltip
              text="Shuffle"
              children={
                <Shuffle
                  opacity={shuffle ? 1 : 0.3}
                  onClick={() => setShuffle((prev) => !prev)}
                  {...btmIconConfig}
                />
              }
            />
            <Tooltip
              text="Discussion"
              children={
                <MessageCircle
                  opacity={0.3}
                  // onClick={toggleCommentView}
                  {...btmIconConfig}
                />
              }
            />
            <Tooltip
              text="Settings"
              children={
                <Settings onClick={toggleSettingView} {...btmIconConfig} />
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Player;
