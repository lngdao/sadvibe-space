import axios from 'axios';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Disc,
  Menu,
  MessageCircle,
  Pause,
  Play,
  Repeat,
  Settings,
  SkipBack,
  SkipForward,
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
import { toHHMMSS } from '../utils/funcUtils';
import './Player.style.css';

function Player() {
  const [player, setPlayer] = useState<HTMLAudioElement>(new Audio());
  const [showCommentView, setShowCommentView] = useState<boolean>(false);
  const [sidebar, setSidebar] = useState<boolean>(false);
  const [showSetting, setShowSetting] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);
  const [isFavourite, setIsFarourite] = useState<boolean>(false);
  const [playerTime, setPlayerTime] = useState({
    currentTime: '00:00',
    totalDuration: '00:00',
  });
  const [isLoop, setIsLoop] = useState<boolean>(false);
  const [listAudio, setListAudio] = useState<Array<any>>([]);

  const trackloadedRef = useRef<boolean>(false);
  const playerSpanedTimeRef = useRef<number>(0);

  const audio = useStore((state) => state.audio);
  const { theme } = useStore((state) => state.setting);
  const { backdrop } = useStore((state) => state.setting);
  const updateAudio = useStore((state) => state.updateAudio);
  const config = useConfigStore((state) => state.config);
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

  const toggleLoop = () => {
    setIsLoop((prev) => !prev);
  };

  const toggleFavourite = () => {
    setIsFarourite((prev) => !prev);
  };

  const onPlayPauseClickHandler = () => {
    setPlaying((prev) => !prev);
  };

  const updatePlayerInfor = () => {
    const totalDuration = toHHMMSS(
      parseInt(player.duration.toString(), 10).toString()
    );

    const currentTime = toHHMMSS(
      parseInt(player.currentTime.toString(), 10).toString()
    );

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
      setPlaying(false);
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
      setListAudio(res.data.data);
    });
  }, []);

  useEffect(() => {
    assignEventsToPlayer();

    return cleanPlayerEvent;
  }, []);

  useEffect(() => {
    if (playing) player.play();
    else player.pause();
  }, [playing]);

  useEffect(() => {
    if (audio) {
      player.src = audio.audioUrl;
      setPlaying(false);
      assignEventsToPlayer();
    }
  }, [audio]);

  useEffect(() => {
    player.volume = volume;
  }, [volume]);

  const renderBackdrop = useMemo(
    () =>
      backdrop.type == 'solid'
        ? `${backdrop.value as string}`
        : `url('${(backdrop.value as TBackdropImage).imgUrl}') no-repeat`,
    [backdrop.value]
  );

  return (
    <div
      className="wrapper"
      style={{
        background: renderBackdrop,
      }}
    >
      <div className="player" style={{ background: theme.value.primary }}>
        <TrackList
          playerPlayStatus={playing}
          listAudio={listAudio}
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
          {/* <button
            className="heart-icon"
            dangerouslySetInnerHTML={{
              __html: isFavourite
                ? `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 47 45" style="enable-background:new 0 0 47 45;" xml:space="preserve"><path d="M46.8,14.8c0,16-21.3,29.1-22.2,29.7c-0.3,0.2-0.7,0.3-1,0.3c-0.4,0-0.7-0.1-1-0.3C21.6,43.9,0.2,30.8,0.2,14.8 c0-8.3,6-14.6,13.9-14.6c2.6,0,5.1,0.7,7.3,2c0.7,0.4,1.5,0.9,2.1,1.5c0.7-0.6,1.4-1,2.1-1.5c2.2-1.3,4.7-2,7.3-2 C40.8,0.2,46.8,6.5,46.8,14.8z"/></svg>`
                : `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 47 45" style="enable-background:new 0 0 47 45;" xml:space="preserve"><path d="M32.9,0.2c-2.6,0-5.1,0.7-7.3,2c-0.7,0.4-1.5,0.9-2.1,1.5c-0.7-0.6-1.4-1.1-2.1-1.5c-2.2-1.3-4.7-2-7.3-2 C6.2,0.2,0.2,6.5,0.2,14.8c0,16,21.3,29.1,22.2,29.7c0.3,0.2,0.7,0.3,1,0.3c0.4,0,0.7-0.1,1-0.3c0.9-0.6,22.2-13.7,22.2-29.7 C46.8,6.5,40.8,0.2,32.9,0.2z M23.5,40.4C19.3,37.6,4.2,26.7,4.2,14.8c0-6,4.2-10.6,9.9-10.6c1.9,0,3.7,0.5,5.3,1.4 c1,0.6,1.9,1.3,2.6,2.1c0.8,0.9,2.2,0.9,3,0c0.8-0.8,1.6-1.6,2.6-2.1c1.6-0.9,3.4-1.4,5.3-1.4c5.6,0,9.9,4.6,9.9,10.6 C42.8,26.7,27.6,37.6,23.5,40.4z"/></svg>`,
            }}
            onClick={toggleFavourite}
          ></button> */}
          <VolumeControl />
        </section>
        <p
          style={{ color: theme.value.content }}
          className="player-track__title"
        >{`${audio?.singer} - ${audio?.name}`}</p>
        <section className="player-center">
          <Lyrics player={player}/>
          {/* <Disc color={theme.value.content} size={150} /> */}
        </section>
        <section className="player-control__btm">
          <PlayerProgressBar
            player={player}
            playerTime={playerTime}
            playerSpanedTimeRef={playerSpanedTimeRef}
          />
          <div className="player-control__container">
            <SkipBack size={30} opacity={0.3} color={theme.value.content} />
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
            <SkipForward size={30} opacity={0.3} color={theme.value.content} />
          </div>
          <div className="player-nav__btm">
            <Menu onClick={toggleSidebar} {...btmIconConfig} />
            <Repeat
              onClick={toggleLoop}
              {...btmIconConfig}
              opacity={isLoop ? 1 : 0.3}
            />
            <MessageCircle
              opacity={0.3}
              // onClick={toggleCommentView}
              {...btmIconConfig}
            />
            <Settings onClick={toggleSettingView} {...btmIconConfig} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Player;
