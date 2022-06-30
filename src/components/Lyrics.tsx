import React, { useEffect, useMemo, useRef } from 'react';
import { Lrc } from 'react-lrc';
import styled from 'styled-components';
import { useStore } from '../store';
import Empty from './Empty';

type TLineRenderer = {
  index: number;
  active: boolean;
  line: import('clrc').LyricLine;
};

const Style = styled.div`
  flex: 1;
  height: 250px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  mask-image: linear-gradient(
    transparent,
    black 0%,
    black 85%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    transparent,
    black 0%,
    black 85%,
    transparent 100%
  );
  > .lrc {
    flex: 1;
    min-height: 0;
  }
`;

function Lyrics({ player }: { player: HTMLAudioElement }) {
  const currentActiveLineIdxRef = useRef<number>(0);
  const audio = useStore((state) => state.audio);

  const renderLyric = useMemo(() => {
    let lyric = '';
    if (audio && audio.lyric) {
      lyric = audio.lyric;
    }

    return lyric;
  }, [audio]);

  const onLineChange = ({
    index,
  }: {
    index: number;
    line: import('clrc').LyricLine;
  }) => {
    currentActiveLineIdxRef.current = index;
  };

  useEffect(() => {}, []);

  const lineRenderer = ({ index, active, line }: TLineRenderer) => {
    const lineColor =
      index <= currentActiveLineIdxRef.current ? 'orange' : 'black';

    return (
      <h1 style={{ color: lineColor, fontSize: 24, marginBottom: 7 }}>
        {line.content}
      </h1>
    );
  };

  return audio?.lyric ? (
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
    <Empty emptyTxt={'The lyrics have not been updated yet'} />
  );
}

export default Lyrics;
