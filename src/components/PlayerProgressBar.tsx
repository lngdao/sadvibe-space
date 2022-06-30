import React, {
  MouseEventHandler,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Navigation2 } from 'react-feather';
import { useStore } from '../store';
import { toHHMMSS } from '../utils/funcUtils';
import _ from 'lodash';

interface Props {
  player: HTMLAudioElement;
  playerTime: { currentTime: string; totalDuration: string };
  playerSpanedTimeRef: MutableRefObject<number>;
  dragThrottle?: number;
}

function PlayerProgressBar({
  playerSpanedTimeRef,
  player,
  playerTime,
  dragThrottle = 16,
}: Props) {
  const { theme } = useStore((state) => state.setting);
  const [progress, setProgress] = useState({
    percent: 0,
    spanedTime: '00:00',
  });
  let isReadyToDragRef = useRef<boolean>(false);

  // const dragTriggerRate = useMemo(() => {
  //   return (1 / player.duration) * 100;
  // }, [player.duration]);

  const handleProgBarMove = _.throttle((e: any) => {
    const progBarEle = document.getElementById('progress')!;
    document.addEventListener('mouseup', handleProgBarDrop);

    const mouseX = e.clientX;
    const progressWidth = progBarEle!.getBoundingClientRect().width;
    const progressLeft = progBarEle!.getBoundingClientRect().left;

    const min = progressLeft;
    const max = progressWidth + progressLeft;

    if (isReadyToDragRef.current && mouseX >= min && mouseX <= max) {
      const percent = ((mouseX - min) / progressWidth) * 100;
      playerSpanedTimeRef.current = (percent / 100) * player.duration;
      const progressSpanedTime = toHHMMSS(
        parseInt(((percent / 100) * player.duration).toString(), 10).toString()
      );

      setProgress((prev) => ({
        ...prev,
        percent,
        spanedTime: progressSpanedTime,
      }));
    }
  }, dragThrottle);

  const handleProgBarDrop = (e: any) => {
    if (isReadyToDragRef.current) {
      player.currentTime = playerSpanedTimeRef.current;
      isReadyToDragRef.current = false;

      e.target.removeEventListener('moveup', handleProgBarDrop);
      document.removeEventListener('mousemove', handleProgBarMove);
    }
  };

  const onProgressBarClickDown: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      isReadyToDragRef.current = true;

      if (e.type == 'mousedown') {
        document.addEventListener('mousemove', handleProgBarMove);
      }
    },
    []
  );

  const updateProgressBar = () => {
    const percent = player.currentTime / player.duration;
    if (!isReadyToDragRef.current)
      setProgress((prev) => ({ ...prev, percent: percent * 100 }));
  };

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
            background: theme.value.content,
            right: `${100 - progress.percent}%`,
          }}
        ></div>
        <div
          className="remaining"
          style={{ background: theme.value.content }}
        ></div>
      </div>
      <div
        className="handle-ctr"
        id="progressHandleCtr"
        style={{
          left: `${progress.percent}%`,
        }}
      >
        <p
          style={{
            color: theme.value.primary,
            background: theme.value.content,
          }}
          className="time-span"
        >
          {!isReadyToDragRef.current
            ? playerTime.currentTime
            : progress.spanedTime}
        </p>
        <Navigation2
          className="handle"
          size={15}
          fill={theme.value.content}
          color={theme.value.content}
        />
      </div>
    </div>
  );
}

export default PlayerProgressBar;
