import React, { useEffect, useMemo, useState } from 'react';
import { Lrc } from 'react-lrc';
import styled from 'styled-components';
import { useStore } from '../store';
import T from '../translation/T';
import Empty from './Empty';

type TLineRenderer = {
  index: number;
  active: boolean;
  line: import('clrc').LyricLine;
};

const Style = styled.div`
  flex: 1;
  height: 300px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  mask-image: linear-gradient(
    transparent,
    black 10%,
    black 85%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    transparent,
    black 10%,
    black 85%,
    transparent 100%
  );
  > .lrc {
    flex: 1;
    min-height: 0;
  }
`;

function Lyrics({
  player,
  emptyTxt,
}: {
  player: HTMLAudioElement;
  emptyTxt: string;
}) {
  const [currentActiveLineIdx, setCurrentActiveLineIdx] = useState<number>(0);
  const { audios, currentTrack } = useStore((state) => state.audio);
  const { theme } = useStore((state) => state.setting);

  const renderLyric = useMemo(() => {
    let lyric = '';
    if (currentTrack && currentTrack.lyric) {
      lyric = currentTrack.lyric;
    }

    return lyric;
  }, [currentTrack]);

  const onLineChange = ({
    index,
  }: {
    index: number;
    line: import('clrc').LyricLine;
  }) => {
    setCurrentActiveLineIdx(index);
  };

  const handleOnLyricClick = (line: import('clrc').LyricLine) => {
    player.currentTime = line.startMillisecond / 1000;
  };

  useEffect(() => {}, []);

  const lineRenderer = ({ index, active, line }: TLineRenderer) => {
    const isCurrentActiveLine = index == currentActiveLineIdx;
    const lineColor =
      index <= currentActiveLineIdx
        ? theme.value.highlight
        : theme.value.content;

    return (
      <h1
        onClick={() => handleOnLyricClick(line)}
        style={{
          color: lineColor,
          fontSize: 24,
          marginBottom: 7,
          cursor: 'pointer',
        }}
      >
        {line.content}
      </h1>
    );
  };

  return currentTrack?.lyric ? (
    <Style>
      <Lrc
        style={{ flex: 1, minHeight: 0 }}
        className={'lrc'}
        lrc={renderLyric}
        onLineChange={onLineChange}
        lineRenderer={lineRenderer}
        currentMillisecond={player.currentTime * 1000}
        intervalOfRecoveringAutoScrollAfterUserScroll={1000}
      />
    </Style>
  ) : (
    <Empty lottie emptyTxt={currentTrack ? emptyTxt : ''} />
  );
}

export default Lyrics;
