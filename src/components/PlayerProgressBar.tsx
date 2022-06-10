import React, {
  MouseEventHandler,
  MutableRefObject,
  useEffect,
  useState,
} from 'react';
import { Navigation2 } from 'react-feather';
import { toHHMMSS } from '../utils/funcUtils';

interface Props {
  player: HTMLAudioElement;
  playerTime: { currentTime: string; totalDuration: string };
  isReadyToDragRef: MutableRefObject<boolean>;
  playerSpanedTimeRef: MutableRefObject<number>;
}

function PlayerProgressBar({
  isReadyToDragRef,
  playerSpanedTimeRef,
  player,
  playerTime,
}: Props) {
  const [progress, setProgress] = useState({
    isDrag: false,
    percent: 0,
    spanedTime: '00:00',
  });

  const onProgressBarClickDown: MouseEventHandler<HTMLDivElement> = (e) => {
    isReadyToDragRef.current = true;
  };

  const registerDocumentListener = () => {
    document.addEventListener('mousemove', (e) => {
      const progress = document.getElementById('progress')!;

      const clientX = e.clientX;
      const progressWidth = progress.getBoundingClientRect().width;
      const progressLeft = progress.getBoundingClientRect().left;

      const min = progressLeft;
      const max = progressWidth + progressLeft;

      if (isReadyToDragRef.current && clientX >= min && clientX <= max) {
        const percent = ((clientX - min) / progressWidth) * 100;

        playerSpanedTimeRef.current = (percent / 100) * player.duration;
        const progressSpanedTime = toHHMMSS(
          parseInt(
            ((percent / 100) * player.duration).toString(),
            10
          ).toString()
        );

        setProgress({ isDrag: true, percent, spanedTime: progressSpanedTime });
      }
    });

    document.addEventListener('mouseup', (e) => {
      if (isReadyToDragRef.current) {
        player.currentTime = playerSpanedTimeRef.current;
        isReadyToDragRef.current = false;
        setProgress((prev) => ({ ...prev, isDrag: false }));
      }
    });
  };

  const updateProgressBar = () => {
    const percent = player.currentTime / player.duration;
    if (!isReadyToDragRef.current)
      setProgress((prev) => ({ ...prev, percent: percent * 100 }));
  };

  useEffect(() => {
    registerDocumentListener();

    return () => {
      document.removeEventListener('mousemove', () => {});
      document.removeEventListener('mouseup', () => {});
    };
  });

  useEffect(() => {
    updateProgressBar();
  }, [playerTime]);

  return (
    <div
      className="progress-container"
      id="progress"
      onMouseDown={onProgressBarClickDown}
    >
      <div className="progress-bar">
        <div
          className="done"
          style={{
            right: `${100 - progress.percent}%`,
          }}
        ></div>
        <div className="remaining"></div>
      </div>
      <div
        className="handle-ctr"
        id="progressHandleCtr"
        style={{
          left: `${progress.percent}%`,
        }}
      >
        <p className="time-span">
          {!isReadyToDragRef.current
            ? playerTime.currentTime
            : progress.spanedTime}
        </p>
        <Navigation2
          className="handle"
          size={15}
          fill={'#333'}
          color={'#333'}
        />
      </div>
    </div>
  );
}

export default PlayerProgressBar;
